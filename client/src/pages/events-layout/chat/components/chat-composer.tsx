import { chatActions, chatStore } from "@/entities/chat/store";
import type { GetMessagesByIdResponse } from "@/shared/api";
import {
  getMessagesByIdQueryKey,
  getMessagesConversationsQueryKey,
  postMessagesByIdMutation,
} from "@/shared/api/@tanstack/react-query.gen";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SendIcon } from "lucide-react";
import type { KeyboardEvent, SubmitEvent } from "react";

export function ChatComposer() {
  const queryClient = useQueryClient();
  const activeConversationId = chatStore.useStore((state) => state.activeConversationId);
  const composerText = chatStore.useStore((state) => state.composerText);

  const sendMutation = useMutation({
    ...postMessagesByIdMutation(),
    onSuccess: (message) => {
      queryClient.setQueryData<GetMessagesByIdResponse>(
        getMessagesByIdQueryKey({ path: { id: activeConversationId } }),
        (prev) => {
          if (!prev) return [message];
          if (prev.some((item) => item.id === message.id)) return prev;
          return [...prev, message];
        },
      );

      queryClient.invalidateQueries({ queryKey: getMessagesConversationsQueryKey() });

      chatActions.setText("");
    },
  });

  const canSend = composerText.trim().length > 0 && !sendMutation.isPending && !!activeConversationId;

  const submit = () => {
    if (!canSend) return;

    sendMutation.mutate({
      path: { id: activeConversationId },
      body: { text: composerText.trim() },
    });
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border p-3 sm:p-4">
      <Input
        value={composerText}
        onChange={(event) => chatActions.setText(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Написать сообщение..."
        disabled={sendMutation.isPending}
        autoComplete="off"
        className="flex-1"
      />
      <Button type="submit" size="icon" disabled={!canSend} aria-label="Отправить">
        <SendIcon />
      </Button>
    </form>
  );
}
