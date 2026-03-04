import { useState } from "react";
import {
	Eye,
	EyeOff,
	Columns,
	X,
	Type,
	Hash,
	Calendar,
	Tag,
} from "lucide-react";
import EditableCell from "./EditableCell";
import type { Collection, Item, Field } from "../types";

interface TableViewProps {
	collection: Collection;
	items: Item[];
	visibleFieldIds: string[];
	onToggleColumn: (fieldId: string) => void;
	onUpdateItem: (itemId: string, fieldId: string, newValue: unknown) => void;
}

function FieldIcon({ type }: { type: string }) {
	if (type === "date") return <Calendar className="w-3 h-3 text-gray-300" />;
	if (type === "select") return <Tag className="w-3 h-3 text-gray-300" />;
	if (type === "number") return <Hash className="w-3 h-3 text-gray-300" />;
	return <Type className="w-3 h-3 text-gray-300" />;
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

const itemsPerPage = 8;
const emptyRowCount = Math.max(0, itemsPerPage - items.length);

return (
	<div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative mb-2">
	<div className="overflow-auto">
	<table className="w-full text-left border-separate border-spacing-0 min-w-max">
	<thead>
	<tr className="bg-gray-50">
	{visibleFields.map((field: Field, idx) => (
		<th
		key={field.id}
		className={`px-4 py-3.5 border-b border-r border-gray-200 whitespace-nowrap ${
			idx === 0 ? "sticky left-0 z-20 bg-gray-50" : ""
		}`}
		>
		<div className="flex items-center gap-1.5">
		<FieldIcon type={field.type} />
		<span className="text-xs font-semibold text-gray-500">
		{field.label}
		</span>
		</div>
		</th>
	))}
	
	<th className="px-3 py-3 border-b border-gray-200 bg-gray-50 sticky right-0 z-20 w-12">
	<button
	onClick={() => setShowColumnPanel(!showColumnPanel)}
	className={`flex items-center justify-center w-8 h-8 mx-auto rounded-lg border transition-all ${
		showColumnPanel
		? "bg-maranics-primary text-white border-maranics-primary"
		: "bg-white border-gray-200 text-gray-400 hover:border-maranics-primary hover:text-maranics-primary"
	}`}
	title="Show/hide columns"
	>
	<Columns className="w-3.5 h-3.5" />
	</button>
	</th>
	</tr>
	</thead>
	
	<tbody>

	{items.map((item: Item) => (
		<tr
		key={item.id}
		className="hover:bg-slate-50 transition-colors group"
		>
		{visibleFields.map((field: Field, fieldIdx) => (
			<td
			key={field.id}
			className={`p-0 text-sm border-b border-r border-gray-100 h-12 relative ${
				fieldIdx === 0
				? "sticky left-0 z-10 bg-white group-hover:bg-slate-50 font-semibold"
				: ""
			}`}
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
		<td className="border-b border-gray-100 sticky right-0 bg-gray-50/30 w-12" />
		</tr>
	))}
	
	{Array.from({ length: emptyRowCount }).map((_, i) => (
		<tr key={`empty-${i}`}>
		{visibleFields.map((field, fieldIdx) => (
			<td
			key={field.id}
			className={`border-b border-r border-gray-100 h-12 ${
				fieldIdx === 0 ? "sticky left-0 bg-white" : ""
			}`}
			/>
		))}
		<td className="border-b border-gray-100 sticky right-0 bg-gray-50/30 w-12" />
		</tr>
	))}
	</tbody>
	</table>
	</div>
	
	{/* Show/hide columns panel*/}
	{showColumnPanel && (
		<>
		<div
		className="fixed inset-0 z-40"
		onClick={() => setShowColumnPanel(false)}
		/>
		
		<div className="absolute top-12 right-4 z-50 w-64 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
		<div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
		<span className="text-xs font-black text-gray-500 uppercase tracking-widest">
		Show / Hide Columns
		</span>
		<button
		onClick={() => setShowColumnPanel(false)}
		className="text-gray-400 hover:text-gray-600"
		>
		<X className="w-4 h-4" />
		</button>
		</div>
		
		<div className="p-2 max-h-80 overflow-y-auto">
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
