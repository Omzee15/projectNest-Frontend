import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProjectBoard } from '@/components/ProjectBoard';
import { Navbar } from '@/components/Navbar';
import { ProjectWithLists, Project, ListWithTasks, Task } from '@/types';
import { mockProject } from '@/utils/mockData';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export default function ProjectDashboard() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<ProjectWithLists | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    if (!projectId) {
      setProject(mockProject);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiService.getProject(projectId);
      setProject(response.data);
    } catch (error) {
      console.error('Failed to load project:', error);
      // Try to redirect to a valid project or show the projects list
      try {
        const projectsResponse = await apiService.getProjects();
        if (projectsResponse.data && projectsResponse.data.length > 0) {
          // Use the first valid project
          const firstProject = projectsResponse.data[0];
          const validProjectResponse = await apiService.getProject(firstProject.project_uid);
          setProject(validProjectResponse.data);
          
          toast({
            title: 'Project Not Found',
            description: `Loading "${firstProject.name}" instead.`,
            variant: 'default',
          });
        } else {
          // Fallback to mock data if no projects exist
          setProject(mockProject);
          toast({
            title: 'Using Demo Data',
            description: 'No projects found. Showing demo project.',
            variant: 'default',
          });
        }
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        setProject(mockProject);
        toast({
          title: 'Using Demo Data',
          description: 'Could not connect to backend. Showing demo project.',
          variant: 'default',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskMove = async (taskId: string, newListUid: string) => {
    try {
      await apiService.moveTask(taskId, newListUid);
      toast({
        title: 'Task moved',
        description: 'Task successfully moved to new list.',
      });
      // Reload the project to reflect changes
      await loadProject();
    } catch (error) {
      console.error('Failed to move task:', error);
      toast({
        title: 'Move failed',
        description: 'Could not move task. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleTaskClick = (taskId: string) => {
    console.log('Task clicked:', taskId);
    // TODO: Open task detail modal
  };

  const handleAddTask = async (listUid: string, taskData: any) => {
    try {
      const taskRequest = {
        list_uid: listUid,
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        status: 'todo', // Default status for new tasks
        due_date: taskData.due_date,
      };

      await apiService.createTask(taskRequest);
      
      toast({
        title: 'Task created',
        description: `Task "${taskData.title}" created successfully`,
      });

      // Reload the project to reflect changes
      await loadProject();
    } catch (error) {
      console.error('Failed to create task:', error);
      toast({
        title: 'Failed to create task',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleAddList = async () => {
    console.log('List created, reloading project data');
    // Reload the project to get the updated lists
    await loadProject();
  };

  const handleDeleteList = async (listUid: string) => {
    try {
      await apiService.deleteList(listUid);
      
      toast({
        title: 'List deleted',
        description: 'List deleted successfully',
      });

      // Update local state to remove the deleted list
      if (project) {
        setProject({
          ...project,
          lists: project.lists.filter(list => list.list_uid !== listUid)
        });
      }
    } catch (error) {
      console.error('Failed to delete list:', error);
      toast({
        title: 'Failed to delete list',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTask = async (taskUid: string) => {
    try {
      await apiService.deleteTask(taskUid);
      
      toast({
        title: 'Task deleted',
        description: 'Task deleted successfully',
      });

      // Update local state to remove the deleted task
      if (project) {
        setProject({
          ...project,
          lists: project.lists.map(list => ({
            ...list,
            tasks: list.tasks.filter(task => task.task_uid !== taskUid)
          }))
        });
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast({
        title: 'Failed to delete task',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleProjectUpdate = (updatedProject: Project) => {
    if (project) {
      setProject({
        ...project,
        ...updatedProject,
      });
    }
  };

  const handleListUpdate = (listUid: string, updatedList: ListWithTasks) => {
    if (project) {
      setProject({
        ...project,
        lists: project.lists.map(list =>
          list.list_uid === listUid ? updatedList : list
        )
      });
    }
  };

  const handleTaskUpdate = (taskUid: string, updatedTask: Task) => {
    if (project) {
      setProject({
        ...project,
        lists: project.lists.map(list => ({
          ...list,
          tasks: list.tasks.map(task =>
            task.task_uid === taskUid ? updatedTask : task
          )
        }))
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading project...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Project not found</h2>
            <p className="text-muted-foreground">The project you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <ProjectBoard
        project={project}
        onTaskMove={handleTaskMove}
        onTaskClick={handleTaskClick}
        onAddTask={handleAddTask}
        onAddList={handleAddList}
        onDeleteList={handleDeleteList}
        onDeleteTask={handleDeleteTask}
        onProjectUpdate={handleProjectUpdate}
        onListUpdate={handleListUpdate}
        onTaskUpdate={handleTaskUpdate}
      />
    </div>
  );
}