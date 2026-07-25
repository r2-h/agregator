import { getEventsByIdOptions } from "@/shared/api/@tanstack/react-query.gen";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { formatDate } from "@/shared/utils/format-date";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Footer } from "./components/footer";
import { eventRoute } from "./event-route";

export function EventPage() {
  const { id } = eventRoute.useParams();
  const { data: event } = useQuery(getEventsByIdOptions({ path: { id } }));

  if (!event) return null;

  const startsAt = formatDate(event.startsAt);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <Button
        variant="ghost"
        nativeButton={false}
        size="sm"
        className="w-fit"
        render={<Link to="/events">Назад к списку</Link>}
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-lg leading-snug">{event.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="text-muted-foreground">Когда</p>
            <p>{startsAt}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Адрес</p>
            <p>{event.address}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Вместимость</p>
            <p>До {event.capacity} участников</p>
          </div>
          <div>
            <p className="text-muted-foreground">Описание</p>
            <p>{event.description}</p>
          </div>
        </CardContent>

        <Footer event={event} />
      </Card>
    </div>
  );
}
