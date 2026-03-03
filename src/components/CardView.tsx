import Badge from "./Badge";
import type { Collection, Item, Field } from "../types";
import { ChevronDown, ChevronUp, Edit, Database, Anchor, Users, Activity } from "lucide-react";
import { useState } from "react";


interface CardViewProps {
	collection: Collection;
	items: Item[];
	onEdit: (item: Item) => void;
}

function CollectionIcon({ name }: { name: string }) {
	if (name === "Anchor") return <Anchor className="w-4 h-4" />;
	if (name === "Users") return <Users className="w-4 h-4" />;
	if (name === "Activity") return <Activity className="w-4 h-4" />;
	return <Database className="w-4 h-4" />;
}


function CardView({ collection, items, onEdit }: CardViewProps) {
	const [expandedIds, setExpandedIds] = useState<string[]>([]);
	
	function toggleExpand(id: string) {
		setExpandedIds((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
	);
}

const titleField =
collection.fields.find((f) => f.id === "title") ||
collection.fields.find((f) => f.id === "patientName") ||
collection.fields.find((f) => f.id === "name") ||
collection.fields[0];

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

const extraFields = collection.fields.filter(
	(f) => !summaryFieldIds.includes(f.id),
);

// Group extra fields by their group property
function groupFields(fields: Field[]) {
	return fields.reduce(
		(groups, field) => {
			const groupName = field.group || "General";
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
		const option = field.options?.find((o) => o.value === value);
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
			className={`bg-white rounded-xl border transition-all ${
				isExpanded
				? "border-maranics-primary shadow-md"
				: "border-gray-200 hover:shadow-sm"
			}`}
			>
			{/* Summary row - responsive grid */}
			<div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 items-center">
			{/* Title + collection icon */}
			<div className="md:col-span-2 lg:col-span-3 flex items-start gap-3">
			<div className="p-2 bg-gray-100 rounded-lg text-maranics-primary shrink-0 mt-1">
			<CollectionIcon name={collection.icon} />
			</div>
			<div className="min-w-0">
			<p className="text-xs font-semibold text-gray-400 uppercase mb-0.5">
			{collection.name}
			</p>
			<p className="text-sm font-bold text-gray-900 truncate md:whitespace-normal">
			{String(item[titleField.id] ?? "—")}
			</p>
			<p className="text-xs text-gray-400">{item.id}</p>
			</div>
			</div>
			
			{/* Event + Status badges */}
			<div className="grid grid-cols-1 xs:grid-cols-2 gap-2 md:col-span-2 lg:col-span-4">
			{eventField && (
				<div>
				<p className="text-xs font-semibold text-gray-400 uppercase mb-1">
				{eventField.label}
				</p>
				{renderValue(eventField, item)}
				</div>
			)}
			{statusField && (
				<div>
				<p className="text-xs font-semibold text-gray-400 uppercase mb-1">
				{statusField.label}
				</p>
				{renderValue(statusField, item)}
				</div>
			)}
			</div>
			
			{/* Route - hidden on mobile */}
			{fromPortField && toPortField && (
				<div className="hidden lg:block lg:col-span-2">
				<p className="text-xs font-semibold text-gray-400 uppercase mb-1">
				Route
				</p>
				<p className="text-sm font-medium text-gray-900">
				{String(item[fromPortField.id] ?? "—")} →{" "}
				{String(item[toPortField.id] ?? "—")}
				</p>
				</div>
			)}
			
			{/* Date - hidden on mobile */}
			{dateField && (
				<div className="hidden lg:block lg:col-span-2">
				<p className="text-xs font-semibold text-gray-400 uppercase mb-1">
				{dateField.label}
				</p>
				<div className="text-sm text-gray-900">
				{renderValue(dateField, item)}
				</div>
				</div>
			)}
			
			{/* Action buttons */}
			<div className="flex items-center justify-end gap-2 md:col-span-2 lg:col-span-1">
			<button
			onClick={() => onEdit(item)}
			className="flex items-center gap-1.5 h-9 px-3 border border-gray-300 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50"
			>
			<Edit className="w-3.5 h-3.5" />
			<span className="hidden md:inline">Edit</span>
			</button>
			
			{extraFields.length > 0 && (
				<button
				onClick={() => toggleExpand(item.id)}
				className={`flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium transition-colors ${
					isExpanded
					? "bg-maranics-primary text-white"
					: "bg-maranics-primary/10 text-maranics-primary hover:bg-maranics-primary/20"
				}`}
				>
				{isExpanded ? "Less" : "More"}
				{isExpanded ? (
					<ChevronUp className="w-3.5 h-3.5" />
				) : (
					<ChevronDown className="w-3.5 h-3.5" />
				)}
				</button>
			)}
			</div>
			</div>
			
			{/* Expanded section - grouped fields side by side */}
			{isExpanded && (
				<div className="border-t border-gray-100 px-5 py-4 bg-gray-50 rounded-b-xl overflow-x-auto">
				<div className="flex gap-8 min-w-max">
				{Object.entries(grouped).map(([groupName, fields]) => (
					<div key={groupName} className="min-w-36">
					<h4 className="text-xs font-bold text-maranics-primary uppercase tracking-wider mb-3 pb-1 border-b border-gray-200">
					{groupName}
					</h4>
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
