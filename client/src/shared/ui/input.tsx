import { Input as InputPrimitive } from "@base-ui/react/input";
import { Eye, EyeOff } from "lucide-react";
import * as React from "react";
import { cn } from "../utils/cn";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className,
      )}
      {...props}
    />
  );
}

export { Input };

Input.Password = PasswordInput;

function PasswordInput(props: React.ComponentProps<"input">) {
  const [show, setShow] = React.useState(false);

  return (
    <>
      <Input
        {...props}
        type={show ? "text" : "password"}
        className="pr-10 [anchor-name:--password-input]"
      />

      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="cursor-pointer max-w-fit absolute mr-3 [position-anchor:--password-input] [position-area:span-inline-start]"
      >
        {show ? <EyeOff /> : <Eye />}
      </button>
    </>
  );
}
