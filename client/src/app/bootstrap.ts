import { postAuthRefresh } from "@/shared/api";
import { client } from "@/shared/api/client.gen";
import { authStore } from "./store";

client.setConfig({ baseUrl: import.meta.env.VITE_API_URL });

export async function authRefresh() {
  try {
    const { data, response } = await postAuthRefresh({ throwOnError: true, credentials: "include" });
    if (!response.ok) {
      authStore.setState({ accessToken: null, user: null });
      throw new Error("postAuthRefresh request not ok");
    }
    authStore.setState({
      accessToken: data.accessToken,
      user: { email: data.user.email, id: data.user.id, name: data.user.name },
    });
  } catch (error) {
    console.error(`error->`, error);
  }
}

export function clientInterceptors() {
  client.interceptors.request.use((request) => {
    const token = authStore.getState().accessToken;

    if (token) request.headers.set("Authorization", `Bearer ${token}`);

    return request;
  });

  client.interceptors.response.use(async (response, request) => {
    if (response.status !== 401 || request.url.includes("/auth/refresh")) return response;

    await authRefresh();
    return response;
  });
}
