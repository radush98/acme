import clsx from "clsx"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    primary?: boolean;
    secondary?: boolean;
    danger?: boolean;
    onClick?: () => void;
    disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, primary, secondary, danger, onClick, disabled, className, ...props }) => {
    return <button
        className={clsx({
            'bg-primary text-white': primary,
            'bg-secondary text-white': secondary,
            'bg-danger text-white': danger,
        }, 'px-4 py-2 rounded-md hover:cursor-pointer', className)}
        onClick={onClick}
        disabled={disabled}
        {...props}>
        {children}
    </button>
}