import { useState } from "react";
import type { Collection, Item, Field } from "../types";

interface ItemFormProps {
	collection: Collection;
	item?: Item | null; 
	onSave: (data: Item) => void;
	onClose: () => void;
}

function ItemForm({ collection, item, onSave, onClose }: ItemFormProps) {
	const [formData, setFormData] = useState<Record<string, unknown>>(
		item ? { ...item } : {},
	);
	
	function handleChange(fieldId: string, value: string) {
		setFormData((prev) => ({ ...prev, [fieldId]: value }));
	}
	
	function handleSubmit() {
		onSave(formData as Item);
		onClose();
	}
	
	function renderInput(field: Field) {
		const value = String(formData[field.id] ?? "");
		
		if (field.type === "select" && field.options) {
			return (
				<select
				value={value}
				onChange={(e) => handleChange(field.id, e.target.value)}
				className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-maranics-primary"
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
		
		if (field.type === "date") {
			return (
				<input
				type="datetime-local"
				value={value}
				onChange={(e) => handleChange(field.id, e.target.value)}
				className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-maranics-primary"
				/>
			);
		}
		
		return (
			<input
			type="text"
			value={value}
			placeholder={`Enter ${field.label.toLowerCase()}`}
			onChange={(e) => handleChange(field.id, e.target.value)}
			className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-maranics-primary"
			/>
		);
	}
	
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		<div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
		{/* Modal header */}
		<div className="p-6 border-b border-gray-200">
		<h2 className="text-lg font-bold text-gray-900">
		{item ? "Edit Item" : "Add New Item"}
		</h2>
		</div>
		
		{/* Form fields */}
		<div className="p-6 space-y-4 max-h-96 overflow-y-auto">
		{collection.fields.map((field: Field) => (
			<div key={field.id}>
			<label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
			{field.label}
			{field.required && <span className="text-red-500 ml-1">*</span>}
			</label>
			{renderInput(field)}
			</div>
		))}
		</div>
		
		{/* Modal footer */}
		<div className="p-6 border-t border-gray-200 flex justify-end gap-3">
		<button
		onClick={onClose}
		className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
		>
		Cancel
		</button>
		<button
		onClick={handleSubmit}
		className="px-4 py-2 text-sm font-medium text-white bg-maranics-primary rounded-lg hover:bg-maranics-dark"
		>
		{item ? "Save Changes" : "Add Item"}
		</button>
		</div>
		</div>
		</div>
	);
}

export default ItemForm;
