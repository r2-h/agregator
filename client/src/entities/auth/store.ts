import type { PostAuthLoginResponses } from "@/shared/api";
import { createStore } from "@/shared/store";

export const authStore = createStore({
  accessToken: null as string | null,
  user: null as PostAuthLoginResponses[200]["user"] | null,
});
