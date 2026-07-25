import { Sidebar, SidebarInset, SidebarProvider, SidebarTrigger } from "@/shared/ui/sidebar";
import { Outlet } from "@tanstack/react-router";
import { Header } from "./components/header";
import { Content } from "./components/content";
import { Footer } from "./components/footer";

export function EventsLayoutPage() {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <Header />
        <Content />
        <Footer />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-12 items-center px-4">
          <SidebarTrigger />
        </header>
        <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
