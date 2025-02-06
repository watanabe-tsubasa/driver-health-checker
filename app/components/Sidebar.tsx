import { NavLink } from '@remix-run/react';
import { Input } from '~/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet';
import { cn } from '~/lib/utils';

const menuItems = [
  { name: "配送前登録", href: "/driver/start" },
  { name: "帰着後登録", href: "/driver/end/store-select" },
  { name: "承認画面", href: "/approve/dashboard/start" },
  { name: "トップページ", href: "/" },
];

const SidebarContent = () => (
  <div className="flex flex-col h-full">
    <div className="p-4 border-b">
      <Input type="search" placeholder="Search..." className="w-full" />
    </div>
    <nav className="flex-1 overflow-y-auto">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Menu</h2>
        <div className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-md", 
                isActive
                ? "bg-gray-100 text-foreground shadow-sm"
                : " hover:bg-accent hover:text-accent-foreground focus:outline-none focus:bg-accent focus:text-accent-foreground",
              )}
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
    <div className="p-4 border-t">
      <p className="text-sm text-muted-foreground">© 2024 イオンリテール</p>
    </div>
  </div>
);

interface CustomSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomSidebar({ open, onOpenChange }: CustomSidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-1 min-h-0 bg-background border-r">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Drawer */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="h-screen w-64 p-0 flex flex-col">
          <SheetHeader className="px-4 py-2 border-b">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className='flex-1'>
          <SidebarContent />

          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

