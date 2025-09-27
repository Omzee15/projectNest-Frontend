import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Edit } from 'lucide-react';
import { ListColumn } from './ListColumn';
import { TaskCard } from './TaskCard';
import { CreateListDialog } from './CreateListDialog';
import { EditProjectDialog } from './EditProjectDialog';
import { ColorIndicator } from '@/components/ui/color-picker';
import { ProjectWithLists, Task, ListWithTasks, Project } from '@/types';

interface ProjectBoardProps {
  project: ProjectWithLists;
  onTaskMove?: (taskId: string, newListUid: string) => void;
  onTaskClick?: (taskId: string) => void;
  onAddTask?: (listUid: string, taskData: any) => void;
  onAddList?: () => void;
  onDeleteList?: (listUid: string) => void;
  onDeleteTask?: (taskUid: string) => void;
  onProjectUpdate?: (updatedProject: Project) => void;
  onListUpdate?: (listUid: string, updatedList: ListWithTasks) => void;
  onTaskUpdate?: (taskUid: string, updatedTask: Task) => void;
}

export function ProjectBoard({
  project,
  onTaskMove,
  onTaskClick,
  onAddTask,
  onAddList,
  onDeleteList,
  onDeleteTask,
  onProjectUpdate,
  onListUpdate,
  onTaskUpdate,
}: ProjectBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showEditProjectDialog, setShowEditProjectDialog] = useState(false);
  
  // Use project.lists directly instead of local state
  const lists = project.lists;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    
    // Find the task being dragged
    const task = lists
      .flatMap(list => list.tasks)
      .find(task => task.task_uid === active.id);
    
    setActiveTask(task || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // For visual feedback during drag, we don't need to update state
    // The actual move will be handled in handleDragEnd
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveTask(null);
    
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Find the task and lists involved
    const activeTask = lists
      .flatMap(list => list.tasks)
      .find(task => task.task_uid === activeId);
    
    if (!activeTask) return;

    const overList = lists.find(list => list.list_uid === overId) ||
                    lists.find(list => 
                      list.tasks.some(task => task.task_uid === overId)
                    );

    if (!overList) return;

    // Call the parent callback
    onTaskMove?.(activeTask.task_uid, overList.list_uid);
  };

  const handleEditProject = () => {
    setShowEditProjectDialog(true);
  };

  const handleProjectUpdated = (updatedProject: Project) => {
    if (onProjectUpdate) {
      onProjectUpdate(updatedProject);
    }
    setShowEditProjectDialog(false);
  };

  const handleListUpdate = (listUid: string, updatedList: ListWithTasks) => {
    // Call parent callback to update state
    if (onListUpdate) {
      onListUpdate(listUid, updatedList);
    }
  };

  const handleTaskUpdate = (taskUid: string, updatedTask: Task) => {
    // Call parent callback to update state
    if (onTaskUpdate) {
      onTaskUpdate(taskUid, updatedTask);
    }
  };

  return (
    <div className="flex-1 overflow-hidden">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="h-full p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <ColorIndicator color={project.color || '#FFFFFF'} size="md" />
                <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-secondary"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={handleEditProject}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {project.description && (
                <p className="text-muted-foreground mt-1 ml-8">{project.description}</p>
              )}
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-6 h-full">
            {lists.map((list) => (
              <ListColumn
                key={list.list_uid}
                list={list}
                onTaskClick={onTaskClick}
                onAddTask={onAddTask}
                onListDelete={onDeleteList}
                onListUpdate={handleListUpdate}
                onTaskDelete={onDeleteTask}
                onTaskUpdate={handleTaskUpdate}
              />
            ))}
            
            <div className="flex-shrink-0">
              <CreateListDialog
                projectUid={project.project_uid}
                projectName={project.name}
                onListCreate={() => onAddList?.()}
              />
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="rotate-6 opacity-95">
              <TaskCard task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <EditProjectDialog
        project={project}
        open={showEditProjectDialog}
        onOpenChange={setShowEditProjectDialog}
        onProjectUpdated={handleProjectUpdated}
      />
    </div>
  );
}