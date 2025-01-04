import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/cloudflare";

import "./tailwind.css";

import { CustomSidebar } from "./components/Sidebar";
import { useState } from "react";
import { Header } from "./components/Header";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
        </body>
    </html>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div>
      {/* <Header /> */}
      <div className="flex flex-col h-screen bg-background">
        <Header onOpenSidebar={() => setSidebarOpen(true)} />
        <div className="flex flex-1 overflow-hidden">
          <CustomSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
          <div className="flex-1 overflow-auto md:ml-64">
          <main className="h-[calc(100vh-theme(height.16))] w-full max-w-full overflow-hidden">
            <Outlet />
          </main>
          </div>
        </div>
      </div>
    </div>
  );
}