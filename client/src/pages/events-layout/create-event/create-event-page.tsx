import { postEventsMutation } from "@/shared/api/@tanstack/react-query.gen";
import { useMutation } from "@tanstack/react-query";
import { type SubmitEvent } from "react";
import { EventForm } from "../components/event-form/event-form";
import { useRouter } from "@tanstack/react-router";

export function CreateEventPage() {
  const router = useRouter();
  const mutation = useMutation(postEventsMutation({ credentials: "include" }));

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const address = String(formData.get("address") ?? "").trim();
    const startsAt = formData.get("startedAt");
    const capacity = Number(formData.get("capacity"));

    mutation.mutate(
      { body: { title, description, capacity, address, startsAt } },
      { onSuccess: (data) => router.navigate({ to: "/events/$id", params: { id: data.id } }) },
    );
  };

  return <EventForm handleSubmit={handleSubmit} isPending={mutation.isPending} formType="create" />;
}
