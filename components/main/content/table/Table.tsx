import { faList } from "@fortawesome/free-solid-svg-icons";
import { TableRow, TableRowProps } from "./TableRow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


interface TableProps {
    items: TableRowProps[];
}

const rowClassName = "table w-full table-fixed";

export const Table: React.FC<TableProps> = ({ items }) => {
    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-border">
            <table className="flex h-full min-h-0 w-full table-fixed flex-col">
                <thead className="block shrink-0">
                    <tr className={rowClassName}>
                        <th colSpan={5} className="border-b border-border px-4 py-4 text-left text-sm font-500 text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faList} className="h-4 w-4" />
                                Showing {items.length || 0} items
                            </div>
                        </th>
                    </tr>
                    <tr className={`${rowClassName} border-b border-border text-sm text-muted-foreground`}>
                        <th className="w-[35%] px-4 py-2 text-left font-500">Name</th>
                        <th className="px-4 py-2 text-left font-500">Created At</th>
                        <th className="px-4 py-2 text-left font-500">Updated At</th>
                        <th className="px-4 py-2 text-left font-500">Size</th>
                        <th className="px-4 py-2 text-left font-500">Actions</th>
                    </tr>
                </thead>
                <tbody className="block min-h-0 flex-1 overflow-y-auto">
                    {items.map((item) => (
                        <TableRow key={item.id} {...item} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
