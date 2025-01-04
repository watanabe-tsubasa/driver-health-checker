import { Link } from '@remix-run/react';
import { Menu } from 'lucide-react';
import { Button } from '~/components/ui/button';

interface HeaderProps {
  onOpenSidebar: () => void;
}

export function Header({ onOpenSidebar }: HeaderProps) {
  return (
    <header className="flex top-0 z-0 w-full border-b bg-background pl-4 md:pl-64">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Button variant="outline" className="md:hidden" onClick={onOpenSidebar}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          <Link to="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold">Your Logo</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Add any additional header items here, e.g., user profile, notifications */}
        </div>
      </div>
    </header>
  );
}

