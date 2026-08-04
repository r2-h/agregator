import { chatStore } from "@/entities/chat/store";
import { useChatSocket } from "@/entities/chat/use-chat-socket";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { ChatComposer } from "./components/chat-composer";
import { ChatHeader } from "./components/chat-header";
import { ChatSidebar } from "./components/chat-sidebar";
import { EmptyChat } from "./components/empty-chat";
import { MessageList } from "./components/message-list";

export function ChatPage() {
  useChatSocket();

  const activeConversationId = chatStore.useStore((state) => state.activeConversationId);
  const isMobile = useIsMobile();
  const showSidebar = !isMobile || !activeConversationId;
  const showChat = !isMobile || !!activeConversationId;

  return (
    <div className="flex h-[calc(100dvh-4.5rem)] min-h-0 flex-col overflow-hidden">
      <div className="mx-auto flex w-full max-w-6xl flex-1 overflow-hidden rounded-2xl border border-border bg-background text-foreground">
        {showSidebar ? <ChatSidebar /> : null}

        {showChat ? (
          <section className="flex min-w-0 flex-1 flex-col">
            {activeConversationId ? (
              <>
                <ChatHeader />
                <MessageList />
                <ChatComposer />
              </>
            ) : (
              <EmptyChat />
            )}
          </section>
        ) : null}
      </div>
    </div>
  );
}
