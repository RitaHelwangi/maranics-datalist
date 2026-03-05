import {
	X,
	SlidersHorizontal,
	RotateCcw,
	Search,
	ChevronDown,
	Bookmark,
	Trash2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { Collection, Option } from "../types";

interface SavedFilter {
	id: string;
	name: string;
	filters: Record<string, string>;
}

interface Props {
	collection: Collection;
	activeFilters: Record<string, string>;
	onFilterChange: (fieldId: string, value: string) => void;
	onClear: () => void;
	isOpen: boolean;
	onClose: () => void;
}

// Searchable Dropdown ─────────────────────────────

function Dropdown({
	options,
	value,
	onChange,
	placeholder,
}: {
	options: Option[];
	value: string;
	onChange: (v: string) => void;
	placeholder: string;
}) {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const ref = useRef<HTMLDivElement>(null);
	const selected = options.find((o) => o.value === value);
	const filtered = options.filter((o) =>
		o.label.toLowerCase().includes(search.toLowerCase()),
);

useEffect(() => {
	const close = (e: MouseEvent) => {
		if (ref.current && !ref.current.contains(e.target as Node)) {
			setOpen(false);
			setSearch("");
		}
	};
	document.addEventListener("mousedown", close);
	return () => document.removeEventListener("mousedown", close);
}, []);

return (
	<div ref={ref} className="relative">
	<button
	onClick={() => {
		setOpen((o) => !o);
		setSearch("");
	}}
	className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm bg-white transition-colors ${
		selected
		? "border-maranics-primary text-gray-800"
		: "border-gray-200 text-gray-400 hover:border-gray-300"
	}`}
	>
	<span className="flex items-center gap-2 truncate">
	{selected ? (
		<>
		<span
		className="w-2 h-2 rounded-full shrink-0"
		style={{ backgroundColor: selected.color }}
		/>
		<span className="truncate">{selected.label}</span>
		</>
	) : (
		placeholder
	)}
	</span>
	<ChevronDown
	className={`w-3.5 h-3.5 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
	/>
	</button>
	
	{open && (
		<div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
		<div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
		<Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
		<input
		autoFocus
		type="text"
		placeholder="Search..."
		value={search}
		onChange={(e) => setSearch(e.target.value)}
		className="flex-1 text-sm outline-none placeholder-gray-400"
		/>
		{search && (
			<button onClick={() => setSearch("")}>
			<X className="w-3 h-3 text-gray-400" />
			</button>
		)}
		</div>
		<div className="max-h-48 overflow-y-auto">
		<button
		onClick={() => {
			onChange("");
			setOpen(false);
		}}
		className={`w-full text-left px-3 py-2 text-sm ${!value ? "bg-maranics-primary/10 text-maranics-primary font-semibold" : "text-gray-500 hover:bg-gray-50"}`}
		>
		</button>
		{filtered.length === 0 ? (
			<p className="px-3 py-3 text-xs text-gray-400 text-center">
			</p>
		) : (
			filtered.map((o) => (
				<button
				key={o.value}
				onClick={() => {
					onChange(o.value);
					setOpen(false);
					setSearch("");
				}}
				className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 ${
					value === o.value
					? "bg-maranics-primary/10 text-maranics-primary font-semibold"
					: "text-gray-700 hover:bg-gray-50"
				}`}
				>
				<span
				className="w-2 h-2 rounded-full shrink-0"
				style={{ backgroundColor: o.color }}
				/>
				{o.label}
				</button>
			))
		)}
		</div>
		</div>
	)}
	</div>
);
}

//  FilterPanel ──────────────────────────────

function FilterPanel({
	collection,
	activeFilters,
	onFilterChange,
	onClear,
	isOpen,
	onClose,
}: Props) {
	const fields = collection.fields.filter(
		(f) => f.type === "select" && f.filterable,
	);
	const activeCount = Object.values(activeFilters).filter(Boolean).length;
	
	const storageKey = `savedFilters_${collection.id}`;
	const [savedFilters, setSavedFilters] = useState<SavedFilter[]>(() => {
		try {
			return JSON.parse(sessionStorage.getItem(storageKey) ?? "[]");
		} catch {
			return [];
		}
	});
	const [saveName, setSaveName] = useState("");
	const [showSaveInput, setShowSaveInput] = useState(false);
	
	function persistSaved(updated: SavedFilter[]) {
		setSavedFilters(updated);
		sessionStorage.setItem(storageKey, JSON.stringify(updated));
	}
	
	function handleSave() {
		if (!saveName.trim() || activeCount === 0) return;
		const newFilter: SavedFilter = {
			id: Date.now().toString(),
			name: saveName.trim(),
			filters: { ...activeFilters },
		};
		persistSaved([...savedFilters, newFilter]);
		setSaveName("");
		setShowSaveInput(false);
	}
	
	function handleLoad(saved: SavedFilter) {
		
		onClear();
		Object.entries(saved.filters).forEach(([fieldId, value]) => {
			onFilterChange(fieldId, value);
		});
	}
	
	function handleDelete(id: string) {
		persistSaved(savedFilters.filter((f) => f.id !== id));
	}
	
	if (!isOpen) return null;
	
	return (
		<>
		<div
		className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px]"
		onClick={onClose}
		/>
		<div className="fixed top-0 right-0 h-full w-80 bg-white z-50 flex flex-col shadow-2xl border-l border-gray-100">
		{/* Header */}
		<div className="flex items-center justify-between px-5 pt-5 pb-4 shrink-0">
		<div className="flex items-center gap-2.5">
		<div className="w-7 h-7 rounded-lg bg-maranics-primary/10 flex items-center justify-center">
		<SlidersHorizontal className="w-3.5 h-3.5 text-maranics-primary" />
		</div>
		<span className="text-sm font-bold text-gray-800 tracking-wide uppercase">
		Filters
		</span>
		{activeCount > 0 && (
			<span className="bg-maranics-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
			{activeCount}
			</span>
		)}
		</div>
		<button
		onClick={onClose}
		className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
		>
		<X className="w-4 h-4" />
		</button>
		</div>
		
		<div className="h-px bg-gray-100 mx-5 shrink-0" />
		
		<div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
	
		{savedFilters.length > 0 && (
			<div>
			<p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
			Saved Filters
			</p>
			<div className="flex flex-col gap-1.5">
			{savedFilters.map((saved) => (
				<div
				key={saved.id}
				className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:border-maranics-primary group transition-colors"
				>
				<button
				onClick={() => handleLoad(saved)}
				className="flex-1 text-left text-sm font-medium text-gray-700 group-hover:text-maranics-primary truncate"
				>
				{saved.name}
				</button>
				<button
				onClick={() => handleDelete(saved.id)}
				className="shrink-0 text-gray-300 hover:text-red-400 transition-colors"
				>
				<Trash2 className="w-3.5 h-3.5" />
				</button>
				</div>
			))}
			</div>
			</div>
		)}
		
		{savedFilters.length > 0 && (
			<div className="h-px bg-gray-100 -mx-0" />
		)}
		
		{fields.length === 0 ? (
			<p className="text-sm text-gray-400 text-center mt-10">
			No filters available.
			</p>
		) : (
			fields.map((field) => (
				<div key={field.id}>
				<div className="flex items-center justify-between mb-2">
				<p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
				{field.label}
				</p>
				{activeFilters[field.id] && (
					<button
					onClick={() => onFilterChange(field.id, "")}
					className="text-[10px] font-semibold text-maranics-primary hover:underline"
					>
					clear
					</button>
				)}
				</div>
				<Dropdown
				options={field.options ?? []}
				value={activeFilters[field.id] ?? ""}
				onChange={(v) => onFilterChange(field.id, v)}
				placeholder={`Any ${field.label.toLowerCase()}`}
				/>
				</div>
			))
		)}
		</div>
		
		{activeCount > 0 && (
			<>
			<div className="h-px bg-gray-100 mx-5 shrink-0" />
			<div className="px-5 py-4 flex flex-col gap-2 shrink-0">
			{/* Save filter input */}
			{showSaveInput ? (
				<div className="flex gap-2">
				<input
				autoFocus
				type="text"
				placeholder="Filter name..."
				value={saveName}
				onChange={(e) => setSaveName(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") handleSave();
					if (e.key === "Escape") setShowSaveInput(false);
				}}
				className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maranics-primary"
				/>
				<button
				onClick={handleSave}
				disabled={!saveName.trim()}
				className="px-3 py-2 rounded-lg bg-maranics-primary text-white text-sm font-semibold disabled:opacity-40 hover:bg-maranics-dark transition-colors"
				>
				Save
				</button>
				</div>
			) : (
				<button
				onClick={() => setShowSaveInput(true)}
				className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-gray-200 text-sm font-semibold text-gray-400 hover:border-maranics-primary hover:text-maranics-primary transition-all"
				>
				<Bookmark className="w-3.5 h-3.5" />
			
				</button>
			)}
			
			<button
			onClick={onClear}
			className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
			>
			<RotateCcw className="w-3.5 h-3.5" />
			</button>
			</div>
			</>
		)}
		</div>
		</>
	);
}

export default FilterPanel;
