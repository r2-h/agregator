import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { authStore } from "@/app/store";
import { chatStore } from "@/entities/chat/store";
import { getMessagesByIdOptions } from "@/shared/api/@tanstack/react-query.gen";
import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/utils/cn";
import { formatDate } from "@/shared/utils/format-date";

export function MessageList() {
  const activeConversationId = chatStore.useStore((state) => state.activeConversationId);
  const authUserId = authStore.useStore((state) => state.user?.id);
  const bottomRef = useRef<HTMLDivElement>(null);

  const messagesQuery = useQuery({
    ...getMessagesByIdOptions({ path: { id: activeConversationId } }),
    enabled: Boolean(activeConversationId),
  });

  const messages = messagesQuery.data ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, activeConversationId]);

  if (messagesQuery.isLoading) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            key={index}
            className={cn("h-10 w-2/3 rounded-2xl", index % 2 === 0 ? "self-start" : "self-end")}
          />
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
        Напишите первое сообщение
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-3 sm:p-4">
      {messages.map((message) => {
        const isMine = message.senderId === authUserId;

        return (
          <div
            key={message.id}
            className={cn(
              "flex max-w-[85%] flex-col gap-1 sm:max-w-[70%]",
              isMine ? "self-end" : "self-start",
            )}
          >
            <div
              className={cn(
                "rounded-2xl px-3 py-2 text-sm break-words whitespace-pre-wrap",
                isMine
                  ? "rounded-br-md bg-primary text-primary-foreground"
                  : "rounded-bl-md bg-muted text-foreground",
              )}
            >
              {message.text}
              {message.image ? (
                <img src={message.image} alt="" className="mt-2 max-h-56 rounded-lg object-cover" />
              ) : null}
            </div>
            <span
              className={cn(
                "px-1 text-[11px] text-muted-foreground",
                isMine ? "text-right" : "text-left",
              )}
            >
              {formatDate(message.createdAt)}
            </span>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
