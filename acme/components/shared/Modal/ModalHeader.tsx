import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";

interface ModalHeaderProps {
  title: string;
  onClose?: () => void;
  className?: string;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  onClose,
  className,
}) => {
  return (
    <div
      className={clsx(
        "flex items-center justify-between border-b border-border px-6 py-4",
        className,
      )}
    >
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
};
