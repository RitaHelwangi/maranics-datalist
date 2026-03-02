import { useState } from "react";
import { Eye, EyeOff, Columns, X } from "lucide-react";
import EditableCell from "./EditableCell";
import type { Collection, Item, Field } from "../types";

interface TableViewProps {
	collection: Collection;
	items: Item[];
	visibleFieldIds: string[];
	onToggleColumn: (fieldId: string) => void;
	onUpdateItem: (itemId: string, fieldId: string, newValue: unknown) => void;
}

function TableView({
	collection,
	items,
	visibleFieldIds,
	onToggleColumn,
	onUpdateItem,
}: TableViewProps) {
	const [editingCell, setEditingCell] = useState<{
		rowId: string;
		fieldId: string;
	} | null>(null);
	
	
	const [showColumnPanel, setShowColumnPanel] = useState(false);
	
	const visibleFields = collection.fields.filter((f) =>
		visibleFieldIds.includes(f.id),
);

return (
	<div className="bg-white rounded-lg shadow overflow-hidden relative">
	<table className="w-full">
	<thead className="bg-gray-50">
	<tr>
	{visibleFields.map((field: Field) => (
		<th
		key={field.id}
		className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase"
		>
		{field.label}
		</th>
	))}
	
	{/*replace later: Column toggle button*/}
	<th className="px-3 py-3 text-right">
	<button
	onClick={() => setShowColumnPanel(!showColumnPanel)}
	className={`p-2 rounded-lg border transition-colors ${
		showColumnPanel
		? "bg-maranics-primary text-white border-maranics-primary"
		: "bg-white border-gray-300 text-gray-500 hover:border-maranics-primary"
	}`}
	title="Show/hide columns"
	>
	<Columns className="w-4 h-4" />
	</button>
	</th>
	</tr>
	</thead>
	
	<tbody className="divide-y divide-gray-200">
	{items.map((item: Item) => (
		<tr key={item.id} className="hover:bg-gray-50">
		{visibleFields.map((field: Field) => (
			<td
			key={field.id}
			className="text-sm text-gray-900 h-12 relative p-0"
			>
			<EditableCell
			value={item[field.id]}
			field={field}
			isEditing={
				editingCell?.rowId === item.id &&
				editingCell?.fieldId === field.id
			}
			onStartEditing={() =>
				setEditingCell({ rowId: item.id, fieldId: field.id })
			}
			onSave={(newValue) => {
				onUpdateItem(item.id, field.id, newValue);
				setEditingCell(null);
			}}
			/>
			</td>
		))}
		<td className="px-3"></td>
		</tr>
	))}
	</tbody>
	</table>
	
	{/* Show/hide columns panel */}
	{showColumnPanel && (
		<>
		<div
		className="fixed inset-0 z-40"
		onClick={() => setShowColumnPanel(false)}
		/>
		
		<div className="absolute top-12 right-4 z-50 w-64 bg-white border border-gray-200 rounded-lg shadow-xl">
		<div className="p-3 border-b flex items-center justify-between">
		<span className="text-xs font-semibold text-gray-600 uppercase">
		Show / Hide Columns
		</span>
		<button onClick={() => setShowColumnPanel(false)}>
		<X className="w-4 h-4 text-gray-400" />
		</button>
		</div>
		
		<div className="p-2">
		{collection.fields.map((field: Field) => {
			const isVisible = visibleFieldIds.includes(field.id);
			return (
				<button
				key={field.id}
				onClick={() => onToggleColumn(field.id)}
				className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
					isVisible
					? "text-gray-900 bg-green-50"
					: "text-gray-400 hover:bg-gray-50"
				}`}
				>
				{isVisible ? (
					<Eye className="w-4 h-4 text-maranics-primary" />
				) : (
					<EyeOff className="w-4 h-4 text-gray-300" />
				)}
				{field.label}
				</button>
			);
		})}
		</div>
		</div>
		</>
	)}
	</div>
);
}

export default TableView;
