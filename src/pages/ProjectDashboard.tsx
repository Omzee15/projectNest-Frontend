import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProjectBoard } from '@/components/ProjectBoard';
import { Navbar } from '@/components/Navbar';
import { ProjectWithLists } from '@/types';
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
      // Fallback to mock data for demonstration
      setProject(mockProject);
      toast({
        title: 'Using Demo Data',
        description: 'Could not connect to backend. Showing demo project.',
        variant: 'default',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskMove = async (taskId: string, newListId: number) => {
    try {
      await apiService.moveTask(taskId, newListId);
      toast({
        title: 'Task moved',
        description: 'Task successfully moved to new list.',
      });
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

  const handleAddTask = async (listId: number) => {
    console.log('Add task to list:', listId);
    // TODO: Open add task modal
  };

  const handleAddList = () => {
    console.log('Add new list');
    // TODO: Open add list modal
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
      />
    </div>
  );
}