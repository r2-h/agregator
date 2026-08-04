import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { chatActions, chatStore } from "@/entities/chat/store";
import {
  getMessagesConversationsOptions,
  getUsersOptions,
} from "@/shared/api/@tanstack/react-query.gen";
import { Input } from "@/shared/ui/input";
import { Skeleton } from "@/shared/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { UserRow } from "./user-row";

export function ChatSidebar() {
  const searchQuery = chatStore.useStore((state) => state.searchQuery);
  const sidebarTab = chatStore.useStore((state) => state.sidebarTab);
  const activeConversationId = chatStore.useStore((state) => state.activeConversationId);
  const onlineUsers = chatStore.useStore((state) => state.onlineUsers);

  const conversationsQuery = useQuery(getMessagesConversationsOptions());
  const usersQuery = useQuery(getUsersOptions());

  const list =
    sidebarTab === "conversations" ? (conversationsQuery.data ?? []) : (usersQuery.data ?? []);
  const isLoading = sidebarTab === "conversations" ? conversationsQuery.isLoading : usersQuery.isLoading;

  const filtered = list.filter((user) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);
  });

  return (
    <aside className="flex h-full w-full flex-col border-r border-border bg-background lg:w-80 lg:shrink-0">
      <div className="space-y-3 border-b border-border p-3">
        <h2 className="px-1 text-base font-semibold">Чаты</h2>

        <Tabs
          value={sidebarTab}
          onValueChange={(value: "conversations" | "users") => chatActions.setSidebarTab(value)}
        >
          <TabsList className="w-full">
            <TabsTrigger value="conversations" className="flex-1">
              Диалоги
            </TabsTrigger>
            <TabsTrigger value="users" className="flex-1">
              Пользователи
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => chatActions.setSearchQuery(event.target.value)}
            placeholder="Поиск..."
            className="pl-8"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {isLoading && (
          <div className="space-y-2 p-1">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 px-2 py-2">
                <Skeleton className="size-8 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">
            {sidebarTab === "conversations" ? "Пока нет диалогов" : "Пользователи не найдены"}
          </p>
        )}

        <div className="space-y-1">
          {filtered.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              isActive={activeConversationId === user.id}
              isOnline={onlineUsers.includes(user.id)}
              onSelect={() => chatActions.selectConversation(user)}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
