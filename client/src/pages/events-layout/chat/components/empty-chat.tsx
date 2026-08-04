import { MessageCircleIcon } from "lucide-react";

export function EmptyChat() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <MessageCircleIcon className="size-7 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-base font-medium">Выберите диалог</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          Откройте существующий чат или найдите пользователя, чтобы начать переписку
        </p>
      </div>
    </div>
  );
}
