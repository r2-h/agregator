import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { type SubmitEvent } from "react";
import { authStore } from "@/app/store";
import { postAuthRegisterMutation } from "@/shared/api/@tanstack/react-query.gen";
import { Button } from "@/shared/ui/button";
import { CardTitle } from "@/shared/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { AuthLayout } from "../components/AuthLayout";

export function RegisterPage() {
  const navigate = useNavigate();
  const mutation = useMutation(postAuthRegisterMutation());

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    mutation.mutate(
      { body: { email, password, name }, credentials: "include" },
      {
        onSuccess: (data) => {
          authStore.setState(data);
          navigate({ to: "/events" });
        },
      },
    );
  };

  return (
    <AuthLayout header={<CardTitle>Регистрация</CardTitle>}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <FieldError>{mutation.error?.message}</FieldError>
          <Field>
            <FieldLabel htmlFor="register-name">Имя</FieldLabel>
            <Input
              id="register-name"
              name="name"
              type="text"
              placeholder="Иван Иванов"
              autoComplete="name"
              required
              minLength={2}
              maxLength={30}
              disabled={mutation.isPending}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="register-email">Email</FieldLabel>
            <Input
              id="register-email"
              name="email"
              type="email"
              placeholder="example@example.ru"
              required
              disabled={mutation.isPending}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="register-password">Пароль</FieldLabel>
            <Input.Password
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={5}
              required
              disabled={mutation.isPending}
            />
          </Field>
          <Field>
            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? "Создаётся..." : "Создать аккаунт"}
            </Button>
            <FieldDescription className="text-center">
              Уже есть аккаунт?{" "}
              <Link className="underline-offset-4 hover:underline" to="/login">
                Войти
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </AuthLayout>
  );
}
