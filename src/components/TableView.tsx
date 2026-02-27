import Badge from "./Badge";
import type { Collection, Item, Field } from "../types";

interface TableViewProps {
	collection: Collection;
	items: Item[];
}

function TableView({ collection, items }: TableViewProps) {
	function renderCell(field: Field, item: Item) {
		const value = item[field.id];
		
		if (field.type === "select" && field.options) {
			const option = field.options.find((o) => o.value === value);
			if (option) {
				return <Badge label={option.label} color={option.color} />;
				
			}
		}
		
		if (field.type === "date" && value) {
			const formatted = new Date(String(value)).toLocaleDateString("en-GB", {
				day: "2-digit",
				month: "short",
				year: "numeric",
			});
			return <span>{formatted}</span>;
		}
		
		return <span>{String(value ?? "—")}</span>;
	}
	
	return (
		<div className="bg-white rounded-lg shadow overflow-hidden">
		<table className="w-full">
		<thead className="bg-gray-50">
		<tr>
		{collection.fields.map((field: Field) => (
			<th
			key={field.id}
			className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase"
			>
			{field.label}
			</th>
		))}
		</tr>
		</thead>
		<tbody className="divide-y divide-gray-200">
		{items.map((item: Item) => (
			<tr key={item.id} className="hover:bg-gray-50">
			{collection.fields.map((field: Field) => (
				<td key={field.id} className="px-6 py-4 text-sm text-gray-900">
				{renderCell(field, item)}
				</td>
			))}
			</tr>
		))}
		</tbody>
		</table>
		</div>
	);
}

export default TableView;
