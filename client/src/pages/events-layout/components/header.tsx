import { Link } from "@tanstack/react-router";
import { SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/shared/ui/sidebar";

export function Header() {
  return (
    <SidebarHeader className="border-b border-sidebar-border py-3 ">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            render={
              <Link to="/events">
                <span className="px-1 rounded-md bg-primary text-primary-foreground font-heading font-semibold">
                  Events
                </span>
              </Link>
            }
          />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
