import clsx from "clsx";
import { useMemo } from "react";

export type InputValidator = (value: string) => string | null;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  validators?: InputValidator[];
  error?: string | null;
}

export const Input: React.FC<InputProps> = ({
  label,
  id,
  value,
  validators = [],
  error,
  className,
  ...props
}) => {
  const validationError = useMemo(() => {
    if (typeof value !== "string") {
      return null;
    }

    for (const validator of validators) {
      const message = validator(value);
      if (message) {
        return message;
      }
    }

    return null;
  }, [validators, value]);

  const resolvedError = error ?? validationError;

  return (
    <div>
      {label ? (
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-foreground"
        >
          {label}
        </label>
      ) : null}
      <input
        id={id}
        value={value}
        aria-invalid={Boolean(resolvedError)}
        className={clsx(
          "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
          resolvedError ? "border-destructive focus:border-destructive focus:ring-destructive/20" : "",
          className,
        )}
        {...props}
      />
      {resolvedError ? (
        <p className="mt-2 text-sm text-destructive">{resolvedError}</p>
      ) : null}
    </div>
  );
};
