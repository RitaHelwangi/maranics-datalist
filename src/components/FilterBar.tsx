import { SlidersHorizontal } from "lucide-react";

interface FilterBarProps {
	searchText: string;
	onSearchChange: (value: string) => void;
	activeFilterCount: number;
	onOpenFilters: () => void;
}

function FilterBar({
	searchText,
	onSearchChange,
	activeFilterCount,
	onOpenFilters,
}: FilterBarProps) {
	return (
		<div className="flex items-center gap-2">
		<input
		type="text"
		placeholder="Search..."
		value={searchText}
		onChange={(e) => onSearchChange(e.target.value)}
		className="w-full md:w-72 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-maranics-primary"
		/>
		<button
		onClick={onOpenFilters}
		className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors shrink-0 ${
			activeFilterCount > 0
			? "bg-maranics-primary text-white border-maranics-primary"
			: "bg-white text-gray-500 border-gray-200 hover:border-maranics-primary hover:text-maranics-primary"
		}`}
		>
		<SlidersHorizontal className="w-3.5 h-3.5" />
		{activeFilterCount > 0 && (
			<span className="bg-white text-maranics-primary text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
			{activeFilterCount}
			</span>
		)}
		</button>
		</div>
	);
}

export default FilterBar;
