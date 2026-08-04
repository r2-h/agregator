import { SidebarContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/shared/ui/sidebar";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { MessageCircleMore, PlusIcon, SquaresExclude } from "lucide-react";

export function Content() {
  const matchRoute = useMatchRoute();

  const isActive = {
    createNew: !!matchRoute({ to: "/events/create-new" }),
    all: !!matchRoute({ to: "/events" }),
    my: !!matchRoute({ to: "/events/my" }),
    joined: !!matchRoute({ to: "/events/joined" }),
    chat: !!matchRoute({ to: "/events/chat" }),
  };

  return (
    <SidebarContent>
      <SidebarMenu className="gap-3 px-1">
        <SidebarMenuItem className="mt-3">
          <SidebarMenuButton
            isActive={isActive.createNew}
            tooltip="Создать событие"
            render={
              <Link to="/events/create-new">
                <PlusIcon />
                <span>Создать событие</span>
              </Link>
            }
          />
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            isActive={isActive.all}
            tooltip="Все события"
            render={
              <Link to="/events">
                <SquaresExclude />
                <span>Все события</span>
              </Link>
            }
          />
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            isActive={isActive.my}
            tooltip="Мои события"
            render={
              <Link to="/events/my">
                <SquaresExclude />
                <span>Мои события</span>
              </Link>
            }
          />
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            isActive={isActive.joined}
            tooltip="События с моим участием"
            render={
              <Link to="/events/joined">
                <SquaresExclude />
                <span>Мои участия</span>
              </Link>
            }
          />
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            isActive={isActive.chat}
            tooltip="Чат"
            render={
              <Link to="/events/chat">
                <MessageCircleMore />
                <span>Чат</span>
              </Link>
            }
          />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarContent>
  );
}
