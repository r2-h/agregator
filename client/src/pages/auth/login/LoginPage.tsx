import { postAuthLoginMutation } from "@/shared/api/@tanstack/react-query.gen";
import { Button } from "@/shared/ui/button";
import { CardDescription, CardTitle } from "@/shared/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { type SubmitEvent } from "react";
import { AuthLayout } from "../components/AuthLayout";
import { authStore } from "@/app/store";

export function LoginPage() {
  const navigate = useNavigate();

  const loginMutation = useMutation(postAuthLoginMutation());

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    loginMutation.mutate(
      { body: { email, password }, credentials: "include" },
      {
        onSuccess: (data) => {
          authStore.setState(data);
          navigate({ to: "/events" });
        },
      },
    );
  };

  return (
    <AuthLayout
      header={
        <>
          <CardTitle>Вход</CardTitle>
          <CardDescription>Введите email и пароль для входа</CardDescription>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <FieldError>{loginMutation.error?.message}</FieldError>
          <Field>
            <FieldLabel htmlFor="login-email">Email</FieldLabel>
            <Input
              id="login-email"
              name="email"
              type="email"
              placeholder="example@expample.ru"
              autoComplete="email"
              required
              disabled={loginMutation.isPending}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="login-password">Пароль</FieldLabel>
            <Input.Password
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={5}
              disabled={loginMutation.isPending}
            />
          </Field>
          <Field>
            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Вход..." : "Войти"}
            </Button>
            <FieldDescription className="text-center">
              Нет аккаунта?{" "}
              <Link className="underline-offset-4 hover:underline" to="/register">
                Регистрация
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </AuthLayout>
  );
}
