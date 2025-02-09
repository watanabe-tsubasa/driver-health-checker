import { Form, Link, NavLink, useLocation, useNavigation } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { LoginResponseType } from "~/lib/types";
import { cn } from "../lib/utils"
import { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Card } from "~/components/ui/card";

export const LoginButton = () => {
  const location = useLocation();
  const currentPath = location.pathname + location.search; // クエリパラメータも含める

  return (
    <Link to={`/login?redirect=${encodeURIComponent(currentPath)}`}>
      <Button variant="outline" size="sm" className="mx-2">
        ログイン
      </Button>
    </Link>
  );
};


interface LogoutButtonProps {
  // isLoggedIn: boolean;
  user: LoginResponseType;
}

export const LogoutButton = ({ 
  // isLoggedIn,
  user
 }: LogoutButtonProps) => {
  const location = useLocation();
  const currentPath = location.pathname + location.search;
  // if (!isLoggedIn) {
  //   return null; // ログインしていない場合は何も表示しない
  // }

  return (
    <div className="px-2 flex flex-row space-x-2 items-baseline justify-center">
      <p className="mb-2 hidden md:block">こんにちは {user.lastName}さん</p>
      <Form method="post" action={`/logout?redirect=${encodeURIComponent(currentPath)}`}>
        <Button type="submit" variant="secondary">
          ログアウト
        </Button>
      </Form>
    </div>
  );
}

export const AccessDenied = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex items-center justify-center min-h-screen-header bg-gray-50">
    <Card className="w-full h-40 m-4 flex items-center justify-center">
      {children}
    </Card>
  </div>
  )
}


export interface TabType {
  label: string;
  to: string;
}
interface TabProps {
  tabs: TabType[];
  children: ReactNode;
}

export const Tabs = ({ tabs, children }: TabProps) => {
  const navigation = useNavigation();
  const isNavigating = navigation.state === "loading";
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col">
      <div className="flex space-x-1 rounded-xl bg-muted p-1">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              cn(
                "flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )
            }
          >
            {({ isPending }) => (
              <div className="flex items-center justify-center space-x-1">
                <div className="w-4 h-4"></div>
                <span>{tab.label}</span>
                <div className="w-4 h-4 flex items-center justify-center">
                  {isNavigating && isPending && (
                    <Loader2 className="animate-spin w-4 h-4" />
                  )}
                </div>
              </div>
            )}
          </NavLink>
        ))}
      </div>
      <div className="mt-4 p-4 bg-background rounded-lg shadow flex-1 min-h-0 overflow-auto">
        {children}
      </div>
    </div>
  )
}

