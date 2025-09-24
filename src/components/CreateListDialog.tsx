import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateListDialogProps {
  projectId: number;
  projectName: string;
  onListCreate?: (listData: any) => void;
  trigger?: React.ReactNode;
}

export function CreateListDialog({ projectId, projectName, onListCreate, trigger }: CreateListDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'List name is required',
        variant: 'destructive',
      });
      return;
    }

    const listData = {
      name: name.trim(),
      project_id: projectId,
      position: Date.now(), // Simple position based on timestamp
    };

    onListCreate?.(listData);
    
    // Reset form
    setName('');
    setOpen(false);

    toast({
      title: 'List created',
      description: `List "${name}" added to ${projectName}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            className="w-72 h-12 border-2 border-dashed border-border hover:border-border-light hover:bg-muted/50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add another list
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New List</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">List Name *</Label>
            <Input
              id="name"
              placeholder="Enter list name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="text-sm text-muted-foreground">
            Adding to: <span className="font-medium">{projectName}</span>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Create List
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}