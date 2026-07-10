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
    return <tr className="border-b border-border">
        <td className="py-2 px-4"><FontAwesomeIcon icon={type === 'folder' ? faFolder : faFile} className={clsx("w-4 h-4", type === 'folder' ? 'text-orange-500' : 'text-red-500')} /> {name}</td>
        <td className="py-2 px-4 text-muted-foreground">{createdAt.toLocaleDateString()}</td>
        <td className="py-2 px-4 text-muted-foreground">{updatedAt.toLocaleDateString()}</td>
        <td className="py-2 px-4 text-muted-foreground">{size || '-'}</td>
        <td className="py-2 px-4">
            <button>
                <FontAwesomeIcon icon={faTrashAlt} className="w-4 h-4" />
                <FontAwesomeIcon icon={faPencil} className="w-4 h-4" />
            </button>
        </td>
    </tr>

    // return <div className="flex items-center justify-between">
    //     <div className="flex items-center gap-2">
    //         <FontAwesomeIcon icon={type === 'folder' ? faFolder : faFile} className="w-4 h-4" />
    //         <span>{name}</span>
    //     </div>
    //     <div className="flex items-center gap-2">
    //         <span>{size}</span>
    //         <span>{createdAt.toLocaleDateString()}</span>
    //         <span>{updatedAt.toLocaleDateString()}</span>
    //     </div>
    // </div>
}