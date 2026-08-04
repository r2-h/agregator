import { ArrowLeftIcon, Volume2Icon, VolumeXIcon } from "lucide-react";
import { chatActions, chatStore } from "@/entities/chat/store";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { getInitials } from "../helpers";

export function ChatHeader() {
  const selectedUser = chatStore.useStore((state) => state.selectedUser);
  const onlineUsers = chatStore.useStore((state) => state.onlineUsers);
  const isSoundEnabled = chatStore.useStore((state) => state.isSoundEnabled);
  const isMobile = useIsMobile();

  if (!selectedUser) return null;

  const isOnline = onlineUsers.includes(selectedUser.id);

  return (
    <header className="flex items-center gap-3 border-b border-border px-3 py-2.5 sm:px-4">
      {isMobile && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => chatActions.clearConversation()}
          aria-label="Назад к списку"
        >
          <ArrowLeftIcon />
        </Button>
      )}

      <Avatar size="default">
        <AvatarFallback>{getInitials(selectedUser.name)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{selectedUser.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {isOnline ? "В сети" : "Не в сети"} · {selectedUser.email}
        </p>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={isSoundEnabled ? "Выключить звук" : "Включить звук"}
        onClick={() => chatActions.toggleSound()}
      >
        {isSoundEnabled ? <Volume2Icon /> : <VolumeXIcon />}
      </Button>
    </header>
  );
}
