import Badge from "./Badge";
import type { Collection, Item, Field } from "../types";
import { X, Edit, Database, Anchor, Users, Activity } from "lucide-react";
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

function LabelValue({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div>
		<p className="text-xs font-semibold text-gray-400 uppercase mb-1">
		{label}
		</p>
		{children}
		</div>
	);
}

function CardView({ collection, items, onEdit }: CardViewProps) {
	const [modalItem, setModalItem] = useState<Item | null>(null);
	
	const titleField =
	collection.fields.find((f) => f.id === "title") ||
	collection.fields.find((f) => f.id === "patientName") ||
	collection.fields.find((f) => f.id === "name") ||
	collection.fields[0];
	
	const cardBadgeFields = collection.fields
	.filter((f) => f.showInCard === true)
	.slice(0, 2);
	const badgeField1 = cardBadgeFields[0] ?? null;
	const badgeField2 = cardBadgeFields[1] ?? null;
	
	const fromPortField = collection.fields.find((f) => f.routeFrom);
	const toPortField = collection.fields.find((f) => f.routeTo);
	const hasRoute = !!(fromPortField && toPortField);
	const dateField = collection.fields.find((f) => f.type === "date");
	
	const subtitleField = collection.fields.find(
		(f) => f.type === "text" && f.id !== titleField?.id,
	);
	
	const summaryFieldIds = [
		titleField?.id,
		subtitleField?.id,
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
					month: "short",
					year: "numeric",
				})}
				</span>
			);
		}
		return <span>{String(value ?? "—")}</span>;
	}
	
	const grouped = groupFields(extraFields);
	
	return (
		<>
		<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
		{items.map((item: Item) => (
			<div
			key={item.id}
			className="bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-all"
			>
			<div className="p-4">
			<div className="flex items-center gap-2 mb-3">
			<div className="p-1.5 bg-maranics-primary/10 rounded-lg text-maranics-primary shrink-0">
			<CollectionIcon name={collection.icon} />
			</div>
			<div className="min-w-0 flex-1">
			<p className="text-sm font-bold text-gray-900 truncate">
			{String(item[titleField.id] ?? "—")}
			</p>
			{subtitleField && (
				<p className="text-xs text-gray-400 truncate mt-0.5">
				{String(item[subtitleField.id] ?? "")}
				</p>
			)}
			</div>
			</div>
			
			{(badgeField1 || badgeField2) && (
				<div className="flex gap-6 mb-3">
				{badgeField1 && (
					<LabelValue label={badgeField1.label}>
					<div className="text-sm">
					{renderValue(badgeField1, item)}
					</div>
					</LabelValue>
				)}
				{badgeField2 && (
					<LabelValue label={badgeField2.label}>
					<div className="text-sm">
					{renderValue(badgeField2, item)}
					</div>
					</LabelValue>
				)}
				</div>
			)}
			
			{hasRoute && (
				<p className="text-sm text-gray-700 font-medium mb-2">
				{String(item[fromPortField!.id] ?? "—")} →{" "}
				{String(item[toPortField!.id] ?? "—")}
				</p>
			)}
			
			<div className="flex items-center justify-between gap-2 mt-1">
			{dateField ? (
				<p className="text-xs text-gray-400">
				{String(
					renderValue(dateField, item).props?.children ?? "—",
				)}
				</p>
			) : (
				<span />
			)}
			
			<div className="flex items-center gap-2 shrink-0">
			<button
			onClick={() => onEdit(item)}
			className="flex items-center gap-1.5 h-8 px-3 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
			>
			<Edit className="w-3 h-3" />
			Edit
			</button>
			{extraFields.length > 0 && (
				<button
				onClick={() => setModalItem(item)}
				className="flex items-center gap-1 h-8 px-3 rounded-lg text-xs font-medium bg-maranics-primary/10 text-maranics-primary hover:bg-maranics-primary/20 transition-colors"
				>
				More
				</button>
			)}
			</div>
			</div>
			</div>
			</div>
		))}
		</div>
		
		{/* Modal */}
		{modalItem && (
			<>
			<div
			className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
			onClick={() => setModalItem(null)}
			/>
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
			{/* Modal header */}
			<div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
			<div className="flex items-center gap-2.5">
			<div className="p-1.5 bg-maranics-primary/10 rounded-lg text-maranics-primary">
			<CollectionIcon name={collection.icon} />
			</div>
			<div>
			<p className="text-sm font-bold text-gray-900">
			{String(modalItem[titleField.id] ?? "—")}
			</p>
			{subtitleField && (
				<p className="text-xs text-gray-400">
				{String(modalItem[subtitleField.id] ?? "")}
				</p>
			)}
			</div>
			</div>
			<div className="flex items-center gap-2">
			<button
			onClick={() => {
				onEdit(modalItem);
				setModalItem(null);
			}}
			className="flex items-center gap-1.5 h-8 px-3 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
			>
			<Edit className="w-3 h-3" />
			Edit
			</button>
			<button
			onClick={() => setModalItem(null)}
			className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
			>
			<X className="w-4 h-4" />
			</button>
			</div>
			</div>
			
			{/* Modal body */}
			<div className="overflow-y-auto px-6 py-5">
			<div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
			{Object.entries(grouped).map(([groupName, fields]) => (
				<div key={groupName}>
				<h4 className="text-xs font-bold text-maranics-primary uppercase tracking-wider mb-3 pb-1 border-b border-gray-100">
				{groupName}
				</h4>
				<div className="flex flex-col gap-3">
				{fields.map((field: Field) => (
					<LabelValue key={field.id} label={field.label}>
					<div className="text-sm text-gray-900">
					{renderValue(field, modalItem)}
					</div>
					</LabelValue>
				))}
				</div>
				</div>
			))}
			</div>
			</div>
			</div>
			</div>
			</>
		)}
		</>
	);
}

export default CardView;
