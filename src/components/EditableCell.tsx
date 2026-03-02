import { useState, useEffect, useRef } from "react";
import { Pencil } from "lucide-react";
import Badge from "./Badge";
import type { Field } from "../types";

interface EditableCellProps {
	value: unknown;
	field: Field;
	isEditing: boolean;
	onStartEditing: () => void;
	onSave: (newValue: unknown) => void;
}

function EditableCell({
	value,
	field,
	isEditing,
	onStartEditing,
	onSave,
}: EditableCellProps) {
	
	const [localValue, setLocalValue] = useState(value);
	const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);
	
	useEffect(() => {
		setLocalValue(value);
	}, [value]);
	
	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isEditing]);
	
	function handleBlur() {
		onSave(localValue);
	}
	
	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter") onSave(localValue);
		if (e.key === "Escape") {
			setLocalValue(value); 
			onSave(value);
		}
	}
	
	if (!isEditing) {
		const option =
		field.type === "select" && field.options
		? field.options.find((o) => o.value === value)
		: null;
		
		const displayValue =
		field.type === "date" && value
		? new Date(String(value)).toLocaleDateString("en-GB", {
			day: "2-digit",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		})
		: String(value ?? "—");
		
		return (
			<button
			onClick={onStartEditing}
			className="group w-full h-full flex items-center px-4 text-left hover:bg-green-50 transition-colors"
			>
			{option ? (
				<Badge label={option.label} color={option.color} />
			) : (
				<span className="text-sm text-gray-900 flex-1">
				{displayValue}
				</span>
			)}
			
			<Pencil className="w-3 h-3 text-maranics-primary opacity-0 group-hover:opacity-60 ml-2" />
			</button>
		);
	}
	
	// --- Edit mode ---
	const inputClass =
	"absolute inset-0 w-full h-full px-4 text-sm border-2 border-maranics-primary bg-white outline-none z-20";
	
	// Show dropdown for select fields
	if (field.type === "select" && field.options) {
		return (
			<select
			ref={inputRef as React.RefObject<HTMLSelectElement>}
			value={String(localValue ?? "")}
			onChange={(e) => setLocalValue(e.target.value)}
			onBlur={handleBlur}
			className={inputClass}
			>
			<option value="">Select...</option>
			{field.options.map((opt) => (
				<option key={opt.value} value={opt.value}>
				{opt.label}
				</option>
			))}
			</select>
		);
	}
	
	// Show date picker for date fields
	if (field.type === "date") {
		return (
			<input
			ref={inputRef as React.RefObject<HTMLInputElement>}
			type="datetime-local"
			value={String(localValue ?? "")}
			onChange={(e) => setLocalValue(e.target.value)}
			onBlur={handleBlur}
			onKeyDown={handleKeyDown}
			className={inputClass}
			/>
		);
	}
	
	// Default: text input
	return (
		<input
		ref={inputRef as React.RefObject<HTMLInputElement>}
		type="text"
		value={String(localValue ?? "")}
		onChange={(e) => setLocalValue(e.target.value)}
		onBlur={handleBlur}
		onKeyDown={handleKeyDown}
		className={inputClass}
		/>
	);
}

export default EditableCell;
