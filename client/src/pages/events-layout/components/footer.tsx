import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { LogOutIcon } from "lucide-react";
import { authStore } from "@/app/store";
import { postAuthLogoutMutation } from "@/shared/api/@tanstack/react-query.gen";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/ui/sidebar";

export function Footer() {
  const navigate = useNavigate();
  const isSidebarExpanded = useSidebar().state === "expanded";
  const mutation = useMutation(postAuthLogoutMutation({ credentials: "include" }));
  const user = authStore.useStore((d) => d.user);

  const handleLogOut = () => {
    mutation.mutate({});
    authStore.setState({ accessToken: null, user: null });
    navigate({ to: "/login" });
  };

  return (
    <SidebarFooter>
      <SidebarMenu className="gap-2 px-1">
        {isSidebarExpanded && (
          <SidebarMenuItem>
            <div className="flex items-center gap-2 rounded-md px-2 py-1 5">
              <Avatar className="size-8 rounded-lg">
                <AvatarFallback className="rounded-lg text-xs">{user?.name[0]}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{user?.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </SidebarMenuItem>
        )}

        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={handleLogOut}
            tooltip="Выйти из аккаунта"
            className="cursor-pointer"
          >
            <LogOutIcon />
            <span>Выйти</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
