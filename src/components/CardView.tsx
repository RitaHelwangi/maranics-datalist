/**
* CardView.tsx
*
* Displays collection items as cards instead of a table.
* Better for mobile screens.
* Uses Badge for select fields, same as TableView.
*/

import Badge from "./Badge";
import type { Collection, Item, Field } from "../types";

interface CardViewProps {
	collection: Collection;
	items: Item[];
}

function CardView({ collection, items }: CardViewProps) {
	// Same helper as TableView - renders the right content per field type
	function renderValue(field: Field, item: Item) {
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
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		{items.map((item: Item) => (
			<div
			key={item.id}
			className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
			>
			{collection.fields.map((field: Field) => (
				<div key={field.id} className="mb-3">
				<p className="text-xs font-semibold text-gray-500 uppercase mb-1">
				{field.label}
				</p>
				<div className="text-sm text-gray-900">
				{renderValue(field, item)}
				</div>
				</div>
			))}
			</div>
		))}
		</div>
	);
}

export default CardView;
