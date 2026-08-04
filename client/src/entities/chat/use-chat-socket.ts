import { authStore } from "@/app/store";
import type { GetMessagesByIdResponse } from "@/shared/api";
import {
  getMessagesByIdQueryKey,
  getMessagesConversationsQueryKey,
} from "@/shared/api/@tanstack/react-query.gen";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { chatActions, chatStore } from "./store";

type IncomingMessage = GetMessagesByIdResponse[number];

export function useChatSocket() {
  const queryClient = useQueryClient();
  const userId = authStore.useStore((state) => state.user?.id);

  useEffect(() => {
    if (!userId) return;

    const socketUrl = new URL(import.meta.env.VITE_API_URL, window.location.origin).origin;
    const socket = io(socketUrl, { path: "/socket.io", query: { userId }, withCredentials: true });

    socket.on("getOnlineUsers", (onlineUsers: string[]) => chatActions.setOnlineUsers(onlineUsers));

    socket.on("newMessage", (message: IncomingMessage) => {
      const { activeConversationId, isSoundEnabled } = chatStore.getState();
      const authUserId = authStore.getState().user?.id;
      const peerId = message.senderId === authUserId ? message.receiverId : message.senderId;

      if (activeConversationId === peerId) {
        queryClient.setQueryData<GetMessagesByIdResponse>(
          getMessagesByIdQueryKey({ path: { id: peerId } }),
          (prev) => {
            if (!prev) return [message];
            if (prev.some((item) => item.id === message.id)) return prev;
            return [...prev, message];
          },
        );
      }

      queryClient.invalidateQueries({ queryKey: getMessagesConversationsQueryKey() });

      if (isSoundEnabled && message.senderId !== authUserId)
        new Audio("/message.mp3").play().catch(() => {});
    });

    return () => {
      socket.disconnect();
      chatActions.clearOnlineUsers();
    };
  }, [queryClient, userId]);
}
