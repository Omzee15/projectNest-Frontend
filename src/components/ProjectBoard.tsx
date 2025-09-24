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
import { Plus } from 'lucide-react';
import { ListColumn } from './ListColumn';
import { TaskCard } from './TaskCard';
import { CreateListDialog } from './CreateListDialog';
import { ProjectWithLists, Task, ListWithTasks } from '@/types';

interface ProjectBoardProps {
  project: ProjectWithLists;
  onTaskMove?: (taskId: string, newListId: number) => void;
  onTaskClick?: (taskId: string) => void;
  onAddTask?: (listId: number) => void;
  onAddList?: () => void;
}

export function ProjectBoard({
  project,
  onTaskMove,
  onTaskClick,
  onAddTask,
  onAddList,
}: ProjectBoardProps) {
  const [lists, setLists] = useState<ListWithTasks[]>(project.lists);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

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
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Find the active task and over list
    const activeTask = lists
      .flatMap(list => list.tasks)
      .find(task => task.task_uid === activeId);
    
    if (!activeTask) return;

    const activeList = lists.find(list => 
      list.tasks.some(task => task.task_uid === activeId)
    );
    
    const overList = lists.find(list => list.list_uid === overId) ||
                    lists.find(list => 
                      list.tasks.some(task => task.task_uid === overId)
                    );

    if (!activeList || !overList) return;

    if (activeList.id !== overList.id) {
      setLists(prevLists => {
        const newLists = [...prevLists];
        
        // Remove task from active list
        const activeListIndex = newLists.findIndex(list => list.id === activeList.id);
        const newActiveList = { ...newLists[activeListIndex] };
        newActiveList.tasks = newActiveList.tasks.filter(task => task.task_uid !== activeId);
        
        // Add task to over list
        const overListIndex = newLists.findIndex(list => list.id === overList.id);
        const newOverList = { ...newLists[overListIndex] };
        const updatedTask = { ...activeTask, list_id: overList.id };
        newOverList.tasks = [...newOverList.tasks, updatedTask];
        
        newLists[activeListIndex] = newActiveList;
        newLists[overListIndex] = newOverList;
        
        return newLists;
      });
    }
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
    onTaskMove?.(activeTask.task_uid, overList.id);
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
            <div>
              <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
              {project.description && (
                <p className="text-muted-foreground mt-1">{project.description}</p>
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
              />
            ))}
            
            <div className="flex-shrink-0">
              <CreateListDialog
                projectId={project.id}
                projectName={project.name}
                onListCreate={(listData) => onAddList?.()}
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
    </div>
  );
}