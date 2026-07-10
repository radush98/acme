import { faList } from "@fortawesome/free-solid-svg-icons";
import { TableRow, TableRowProps } from "./TableRow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


interface TableProps {
    items: TableRowProps[];
}

export const Table: React.FC<TableProps> = ({ items }) => {
    return <div className="overflow-hidden rounded-md border border-border">
        <table className="w-full border-collapse">

            <thead>
                <tr>
                    <th colSpan={5} className="py-4 px-4 text-muted-foreground text-left font-500 border-b border-border ">
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faList} className="w-4 h-4" />
                            Showing {items.length || 0} items
                        </div>
                    </th>
                </tr>
                <tr className="l text-muted-foreground border-b border-border">
                    <th className="py-2 px-4 text-left font-500">Name</th>
                    <th className="py-2 px-4 text-left font-500">Created At</th>
                    <th className="py-2 px-4 text-left font-500">Updated At</th>
                    <th className="py-2 px-4 text-left font-500">Size</th>
                    <th className="py-2 px-4 text-left font-500">Actions</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item) => (
                    <TableRow key={item.id} {...item} />
                ))}
            </tbody>
        </table>
    </div>


}