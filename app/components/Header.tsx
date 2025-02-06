import { Link } from '@remix-run/react';
import { Menu } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { LogoutButton } from './FunctionalComponents';
import { LoginResponseType } from '~/lib/types';

interface HeaderProps {
  user: LoginResponseType | null;
  onOpenSidebar: () => void;
}

export function Header({ user, onOpenSidebar }: HeaderProps) {
  return (
    <header className="flex top-0 z-0 w-full border-b bg-background pl-4 md:pl-64">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Button variant="outline" className="md:hidden" onClick={onOpenSidebar}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          <Link to="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold">ドライバー体調管理</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <LogoutButton user={user}/>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className='mx-2'>ログイン</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

