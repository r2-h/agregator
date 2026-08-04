import { type SubmitEvent } from "react";
import type { PatchEventsByIdData, PatchEventsByIdResponse } from "@/shared/api";
import { ControlledSlider } from "@/shared/components/ControlledSlider";
import { Card, CardContent } from "@/shared/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { FormFooter } from "./form-footer";
import { FormHeader } from "./form-header";
import { useDirtyValues } from "./use-dirty-values";

export type FormType = "create" | "update";

type Props = {
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  isPending: boolean;
  formType: FormType;
  responseEvent?: PatchEventsByIdResponse;
};

export function EventForm({ handleSubmit, isPending, formType, responseEvent }: Props) {
  const defaultValues: PatchEventsByIdData["body"] = responseEvent
    ? { ...responseEvent, startsAt: new Date(responseEvent.startsAt).toISOString().slice(0, 16) }
    : { address: "", capacity: 1, description: "", startsAt: "", title: "" };

  const { handleDirty, isDirty } = useDirtyValues(defaultValues);

  return (
    <div className="flex w-full justify-center">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <FormHeader formType={formType} />

        <Card>
          <form onSubmit={handleSubmit}>
            <fieldset disabled={isPending}>
              <CardContent className="space-y-6 pt-6">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="title">Название</FieldLabel>
                    <Input
                      id="title"
                      name="title"
                      placeholder="До 200 символов"
                      maxLength={200}
                      required
                      defaultValue={defaultValues.title}
                      onChange={(e) => handleDirty("title", e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="description">Описание</FieldLabel>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Не пустое значение"
                      rows={5}
                      required
                      defaultValue={defaultValues.description}
                      onChange={(e) => handleDirty("description", e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="startsAt">Дата и время начала</FieldLabel>
                    <Input
                      id="startsAt"
                      name="startsAt"
                      type="datetime-local"
                      required
                      defaultValue={defaultValues.startsAt as string}
                      onChange={(e) => handleDirty("startsAt", e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="address">Адрес</FieldLabel>
                    <Input
                      id="address"
                      name="address"
                      placeholder="До 255 символов"
                      maxLength={255}
                      required
                      defaultValue={defaultValues.address}
                      onChange={(e) => handleDirty("address", e.target.value)}
                    />
                  </Field>

                  <Field>
                    <FieldLabel className="inline-flex items-center gap-2">Вместимость</FieldLabel>
                    <ControlledSlider
                      isPending={isPending}
                      defaultValue={defaultValues.capacity}
                      handleDirty={handleDirty}
                    />
                  </Field>
                </FieldGroup>
              </CardContent>

              <FormFooter formType={formType} isDirty={isDirty} isPending={isPending} />
            </fieldset>
          </form>
        </Card>
      </div>
    </div>
  );
}
