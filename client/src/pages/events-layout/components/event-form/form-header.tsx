import { Button } from "@/shared/ui/button";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { FormType } from "./event-form";

type Props = {
  formType: FormType;
};

export function FormHeader({ formType }: Props) {
  const router = useRouter();

  return (
    <div className="space-y-1">
      <Button variant="ghost" size="sm" onClick={() => router.history.back()} className="cursor-pointer">
        <ArrowLeft className="size-4" />
        Назад
      </Button>
      <h1 className="font-heading text-2xl font-semibold">{`${formType === "create" ? "Создать" : "Редактировать"} событие`}</h1>
      <p className="text-sm text-muted-foreground">Заполните поля события</p>
    </div>
  );
}
