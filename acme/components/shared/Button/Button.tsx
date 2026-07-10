import clsx from "clsx"

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: ButtonVariant;
    onClick?: () => void;
    disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = "secondary", onClick, disabled, className, ...props }) => {
    return <button
        className={clsx({
            'bg-primary text-white': variant === "primary",
            'bg-secondary text-secondary-foreground': variant === "secondary",
            'bg-destructive text-white': variant === "danger",
        }, 'px-4 py-2 rounded-md hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50', className)}
        onClick={onClick}
        disabled={disabled}
        {...props}>
        {children}
    </button>
}