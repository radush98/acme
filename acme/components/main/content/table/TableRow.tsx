import { faFile, faFolder, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";

export interface TableRowProps {
    id: string;
    type: 'folder' | 'file';
    name: string;
    size?: number;
    createdAt: Date;
    updatedAt: Date;
    onClick?: () => void;
}

export const TableRow: React.FC<TableRowProps> = ({ type, createdAt, name, size, updatedAt, onClick
}) => {
    return <tr className="table w-full table-fixed border-b border-border cursor-pointer transition-colors hover:bg-accent">
        <td className="w-[35%] px-4 py-4"><FontAwesomeIcon icon={type === 'folder' ? faFolder : faFile} className={clsx("w-4 h-4", type === 'folder' ? 'text-orange-500' : 'text-red-500')} /> {name}</td>
        <td className="py-4 px-4 text-muted-foreground">{createdAt.toLocaleDateString()}</td>
        <td className="py-4 px-4 text-muted-foreground">{updatedAt.toLocaleDateString()}</td>
        <td className="py-4 px-4 text-muted-foreground">{size || '-'}</td>
        <td className="px-4 py-4">
            <div className="flex items-center gap-2">
        <button>
                <FontAwesomeIcon icon={faPencil} className="w-4 h-4 text-primary opacity-70" />
            </button>
            <button>
                <FontAwesomeIcon icon={faTrashAlt} className="w-4 h-4 text-destructive" />
            </button>
            </div>
        </td>
    </tr>
}