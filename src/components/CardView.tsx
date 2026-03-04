import Badge from "./Badge";
import type { Collection, Item, Field } from "../types";
import {
	ChevronDown,
	ChevronUp,
	Edit,
	Database,
	Anchor,
	Users,
	Activity,
} from "lucide-react";
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

// showInCard flag to pick exactly which badges show in summary
const cardBadgeFields = collection.fields
.filter((f) => f.showInCard === true)
.slice(0, 2);
const badgeField1 = cardBadgeFields[0] ?? null;
const badgeField2 = cardBadgeFields[1] ?? null;

const fromPortField = collection.fields.find((f) => f.id === "fromPort");
const toPortField = collection.fields.find((f) => f.id === "toPort");
const hasRoute = !!(fromPortField && toPortField);


const dateField = collection.fields.find((f) => f.type === "date");

const summaryFieldIds = [
	titleField?.id,
	badgeField1?.id,
	badgeField2?.id,
	fromPortField?.id,
	toPortField?.id,
	dateField?.id,
].filter(Boolean);

const extraFields = collection.fields.filter(
	(f) => !summaryFieldIds.includes(f.id),
);

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
			className={`bg-white rounded-xl border transition-all ${
				isExpanded
				? "border-maranics-primary shadow-md"
				: "border-gray-200 hover:shadow-sm"
			}`}
			>
			<div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 items-center">
			<div className="md:col-span-2 lg:col-span-3 flex items-start gap-3">
			<div className="p-2 bg-gray-100 rounded-lg text-maranics-primary shrink-0 mt-1">
			<CollectionIcon name={collection.icon} />
			</div>
			<div className="min-w-0">
			<p className="text-sm font-bold text-gray-900 truncate md:whitespace-normal">
			{String(item[titleField.id] ?? "—")}
			</p>
			<p className="text-xs text-gray-400 uppercase mt-0.5">
			{collection.name}
			</p>
			</div>
			</div>
			
			<div
			className={`flex flex-col gap-2 lg:flex-row lg:gap-6 lg:items-center md:col-span-2 ${
				hasRoute ? "lg:col-span-4" : "lg:col-span-6"
			}`}
			>
			{badgeField1 && (
				<div>
				<p className="text-xs font-semibold text-gray-400 uppercase mb-1">
				{badgeField1.label}
				</p>
				{renderValue(badgeField1, item)}
				</div>
			)}
			{badgeField2 && (
				<div>
				<p className="text-xs font-semibold text-gray-400 uppercase mb-1">
				{badgeField2.label}
				</p>
				{renderValue(badgeField2, item)}
				</div>
			)}
			</div>
			
			{hasRoute && (
				<div className="hidden lg:block lg:col-span-2">
				<p className="text-xs font-semibold text-gray-400 uppercase mb-1">
				Route
				</p>
				<p className="text-sm font-medium text-gray-900">
				{String(item[fromPortField!.id] ?? "—")} →{" "}
				{String(item[toPortField!.id] ?? "—")}
				</p>
				</div>
			)}
			
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
			
			<div className="flex items-center justify-end gap-2 md:col-span-2 lg:col-span-1 lg:col-start-12">
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
			
			{/* Expanded section */}
			{isExpanded && (
				<div className="border-t border-gray-100 px-4 py-4 bg-gray-50 rounded-b-xl">
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
				{Object.entries(grouped).map(([groupName, fields]) => (
					<div key={groupName}>
					<h4 className="text-xs font-bold text-maranics-primary uppercase tracking-wider mb-3 pb-1 border-b border-gray-200">
					{groupName}
					</h4>
					<div className="flex flex-col gap-3">
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
