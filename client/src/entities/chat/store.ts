import type { GetUsersResponse, PostAuthLoginResponses } from "@/shared/api";
import { createStore } from "@/shared/store";

export type ChatUser = GetUsersResponse[number] | PostAuthLoginResponses[200]["user"];

export const chatStore = createStore({
  selectedUser: null as ChatUser | null,
  activeConversationId: "",
  searchQuery: "",
  sidebarTab: "conversations" as "conversations" | "users",
  composerText: "",
  isSoundEnabled: true,
  onlineUsers: [] as string[],
});

export const chatActions = {
  selectConversation(user: ChatUser) {
    chatStore.setState((state) => ({
      ...state,
      selectedUser: user,
      activeConversationId: user.id,
      composerText: "",
    }));
  },
  clearConversation() {
    chatStore.setState((state) => ({
      ...state,
      selectedUser: null,
      activeConversationId: "",
      composerText: "",
    }));
  },
  toggleSound() {
    chatStore.setState((state) => ({ ...state, isSoundEnabled: !state.isSoundEnabled }));
  },
  setText(value: string) {
    chatStore.setState((state) => ({ ...state, composerText: value }));
  },
  setSidebarTab(tab: "conversations" | "users") {
    chatStore.setState((state) => ({ ...state, sidebarTab: tab }));
  },
  setSearchQuery(value: string) {
    chatStore.setState((state) => ({ ...state, searchQuery: value }));
  },
  setOnlineUsers(users: string[]) {
    chatStore.setState((state) => ({ ...state, onlineUsers: users }));
  },
  clearOnlineUsers() {
    chatStore.setState((state) => ({ ...state, onlineUsers: [] }));
  },
};
