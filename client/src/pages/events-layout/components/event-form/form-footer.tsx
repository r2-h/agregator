import { Button } from "@/shared/ui/button";
import { CardFooter } from "@/shared/ui/card";
import type { FormType } from "./event-form";

type Props = {
  formType: FormType;
  isPending: boolean;
  isDirty: boolean;
};

export function FormFooter({ formType, isPending, isDirty }: Props) {
  const action =
    formType === "create"
      ? isPending
        ? "Создаётся"
        : "Создать событие"
      : isPending
        ? "Сохраняется"
        : "Сохранить";

  return (
    <CardFooter className="justify-end gap-2 border-t mt-5">
      <Button type="submit" className="cursor-pointer" disabled={isPending || !isDirty}>
        {action}
      </Button>
    </CardFooter>
  );
}
