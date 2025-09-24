import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { CreateTaskDialog } from './CreateTaskDialog';
import { ListWithTasks } from '@/types';

interface ListColumnProps {
  list: ListWithTasks;
  onTaskClick?: (taskId: string) => void;
  onAddTask?: (listId: number) => void;
}

export function ListColumn({ list, onTaskClick, onAddTask }: ListColumnProps) {
  const { setNodeRef } = useDroppable({
    id: list.list_uid,
  });

  const taskIds = list.tasks.map(task => task.task_uid);

  return (
    <Card className="w-72 flex-shrink-0 bg-muted/30 border-border-light">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-foreground">
            {list.name}
          </h3>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              {list.tasks.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-secondary"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-3 space-y-3">
        <div
          ref={setNodeRef}
          className="space-y-2 min-h-2"
        >
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {list.tasks.map((task) => (
              <TaskCard
                key={task.task_uid}
                task={task}
                onClick={() => onTaskClick?.(task.task_uid)}
              />
            ))}
          </SortableContext>
        </div>

        <CreateTaskDialog
          listId={list.id}
          listName={list.name}
          onTaskCreate={(taskData) => onAddTask?.(list.id)}
        />
      </CardContent>
    </Card>
  );
}