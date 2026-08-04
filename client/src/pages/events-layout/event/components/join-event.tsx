import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteEventsByIdJoinMutation,
  getMeJoinedOptions,
  postEventsByIdJoinMutation,
} from "@/shared/api/@tanstack/react-query.gen";
import { Button } from "@/shared/ui/button";
import { formatDate } from "@/shared/utils/format-date";

export function JoinEvent({ eventId }: { eventId: string }) {
  const queryClient = useQueryClient();

  const { data: myJoinedEventsList } = useQuery(getMeJoinedOptions());

  const joined = myJoinedEventsList?.find((obj) => obj.event.id === eventId);
  const joinedAt = joined?.joinedAt ? formatDate(joined?.joinedAt) : null;

  const joinEventMutation = useMutation({
    ...postEventsByIdJoinMutation(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: getMeJoinedOptions().queryKey }),
  });
  const leaveEventMutation = useMutation({
    ...deleteEventsByIdJoinMutation(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: getMeJoinedOptions().queryKey }),
  });
  const isLoadingMutations = joinEventMutation.isPending || leaveEventMutation.isPending;

  const onLeaveEvent = () => leaveEventMutation.mutate({ path: { id: eventId } });
  const onJoinEvent = () => joinEventMutation.mutate({ path: { id: eventId } });

  return joined ? (
    <div className="w-full flex justify-between items-center">
      <Button
        variant="outline"
        disabled={isLoadingMutations}
        onClick={onLeaveEvent}
        className="cursor-pointer"
      >
        Выйти из события
      </Button>
      <span className="text-xs text-muted-foreground">Вы присоединились к событию {joinedAt}</span>
    </div>
  ) : (
    <Button disabled={isLoadingMutations} onClick={onJoinEvent} className="cursor-pointer">
      Присоединиться
    </Button>
  );
}
