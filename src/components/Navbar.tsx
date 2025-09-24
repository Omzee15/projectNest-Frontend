import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Plus, Bell, Settings } from 'lucide-react';
import { CreateProjectDialog } from './CreateProjectDialog';
import { useNavigate } from 'react-router-dom';

export function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="border-b border-border bg-background h-14 flex items-center justify-between px-6">
      <div className="flex items-center gap-6">
        <button 
          onClick={() => navigate('/')}
          className="font-bold text-lg text-foreground hover:text-primary transition-colors"
        >
          ProjectBoard
        </button>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search..."
            className="pl-10 w-64 bg-muted/50 border-border-light"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <CreateProjectDialog 
          trigger={
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Button>
          }
        />
        
        <Button variant="ghost" size="sm">
          <Bell className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
        
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
            JD
          </AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}