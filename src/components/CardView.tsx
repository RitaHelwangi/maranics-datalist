/**
* CardView.tsx
*
* Displays items as horizontal rows.
* The "More" button expands to show all remaining fields,
* grouped by category for better readability.
*/

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Badge from "./Badge";
import type { Collection, Item, Field } from "../types";

interface CardViewProps {
	collection: Collection;
	items: Item[];
	onEdit: (item: Item) => void;
}

function CardView({ collection, items, onEdit }: CardViewProps) {
	const [expandedIds, setExpandedIds] = useState<string[]>([]);
	
	function toggleExpand(id: string) {
		setExpandedIds((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
	);
}

// Fields shown in the main card row
const titleField =
collection.fields.find((f) => f.id === "title") || collection.fields[0];
const eventField = collection.fields.find((f) => f.id === "event");
const statusField = collection.fields.find((f) => f.id === "status");
const fromPortField = collection.fields.find((f) => f.id === "fromPort");
const toPortField = collection.fields.find((f) => f.id === "toPort");
const dateField = collection.fields.find((f) => f.type === "date");

const summaryFieldIds = [
	titleField?.id,
	eventField?.id,
	statusField?.id,
	fromPortField?.id,
	toPortField?.id,
	dateField?.id,
].filter(Boolean);

// All other fields go in the expanded section
const extraFields = collection.fields.filter(
	(f) => !summaryFieldIds.includes(f.id),
);

// Group extra fields by their group property
// Returns an object like { "Engine & Fuel": [field1, field2], "Reporting": [field3] }
function groupFields(fields: Field[]) {
	return fields.reduce(
		(groups, field) => {
			const groupName = field.group || "Other";
			if (!groups[groupName]) groups[groupName] = [];
			groups[groupName].push(field);
			return groups;
		},
		{} as Record<string, Field[]>,
	);
}

function renderValue(field: Field, item: Item) {
	const value = item[field.id];
	
	if (field.type === "select" && field.options) {
		const option = field.options.find((o) => o.value === value);
		if (option) return <Badge label={option.label} color={option.color} />;
	}
	
	if (field.type === "date" && value) {
		return (
			<span>
			{new Date(String(value)).toLocaleString("en-GB", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			})}
			</span>
		);
	}
	
	return <span>{String(value ?? "—")}</span>;
}

return (
	<div className="space-y-3">
	{items.map((item: Item) => {
		const isExpanded = expandedIds.includes(item.id);
		const grouped = groupFields(extraFields);
		
		return (
			<div
			key={item.id}
			className="bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
			>
			{/* Main row - always visible */}
			<div className="px-6 py-4 flex items-center gap-6">
			{/* Title + collection label + ID */}
			<div className="min-w-48">
			<p className="text-xs font-semibold text-gray-400 uppercase mb-1">
			{collection.name}
			</p>
			<p className="text-sm font-bold text-gray-900">
			{String(item[titleField.id] ?? "—")}
			</p>
			<p className="text-xs text-gray-400">{item.id}</p>
			</div>
			
			{/* Event badge */}
			{eventField && (
				<div className="min-w-24">
				<p className="text-xs font-semibold text-gray-400 uppercase mb-1">
				Event
				</p>
				{renderValue(eventField, item)}
				</div>
			)}
			
			{/* Status badge */}
			{statusField && (
				<div className="min-w-28">
				<p className="text-xs font-semibold text-gray-400 uppercase mb-1">
				Status
				</p>
				{renderValue(statusField, item)}
				</div>
			)}
			
			{/* Route: From → To */}
			{fromPortField && toPortField && (
				<div className="min-w-40">
				<p className="text-xs font-semibold text-gray-400 uppercase mb-1">
				Route
				</p>
				<p className="text-sm text-gray-900">
				{String(item[fromPortField.id] ?? "—")} →{" "}
				{String(item[toPortField.id] ?? "—")}
				</p>
				</div>
			)}
			
			{/* Date */}
			{dateField && (
				<div className="min-w-36">
				<p className="text-xs font-semibold text-gray-400 uppercase mb-1">
				{dateField.label}
				</p>
				<div className="text-sm text-gray-900">
				{renderValue(dateField, item)}
				</div>
				</div>
			)}
			
			<div className="flex-1" />
			
			{/* Edit button */}
			<button
			onClick={() => onEdit(item)}
			className="px-4 py-1.5 text-xs font-medium border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 shrink-0"
			>
			Edit
			</button>
			
			{/* More button */}
			{extraFields.length > 0 && (
				<button
				onClick={() => toggleExpand(item.id)}
				className="flex items-center gap-1 px-4 py-1.5 text-xs font-medium border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 shrink-0"
				>
				More
				{isExpanded ? (
					<ChevronUp className="w-3 h-3" />
				) : (
					<ChevronDown className="w-3 h-3" />
				)}
				</button>
			)}
			</div>
			
			{/* Expanded section - all groups side by side */}
			{isExpanded && (
				<div className="border-t border-gray-100 bg-gray-50 rounded-b-lg px-6 py-4 overflow-x-auto">
				<div className="flex gap-8 min-w-max">
				{Object.entries(grouped).map(([groupName, fields]) => (
					<div key={groupName} className="min-w-40">
					{/* Group header */}
					<h4 className="text-xs font-bold text-maranics-primary uppercase tracking-wider mb-3 pb-1 border-b border-gray-200">
					{groupName}
					</h4>
					{/* Fields in this group */}
					<div className="space-y-2">
					{fields.map((field: Field) => (
						<div key={field.id}>
						<p className="text-xs font-semibold text-gray-400 uppercase">
						{field.label}
						</p>
						<div className="text-sm text-gray-900">
						{renderValue(field, item)}
						</div>
						</div>
					))}
					</div>
					</div>
				))}
				</div>
				</div>
			)}
			</div>
		);
	})}
	</div>
);
}

export default CardView;
