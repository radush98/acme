import { TableRow, TableRowProps } from "./TableRow";

interface TableProps {
    items: TableRowProps[];
}

export const Table: React.FC<TableProps> = ({ items }) => {
    return <table className="w-full border-collapse border border-gray-300 rounded-md">
        <tr>
            <td colSpan={5} className="py-2 px-4 text-muted-foreground">Showing {items.length || 0} items</td>
        </tr>
        <thead>
            <tr>
                <th>Name</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Size</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {items.map((item) => (
                <TableRow key={item.id} {...item} />
            ))}
        </tbody>
    </table>
}