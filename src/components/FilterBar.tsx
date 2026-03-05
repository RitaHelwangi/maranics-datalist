import { Search, SlidersHorizontal } from "lucide-react";

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
		<div className="flex items-center gap-2 w-full lg:w-auto">
		<div className="relative flex-1 lg:w-72 lg:flex-none">
		<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
		<input
		type="text"
		placeholder="Search..."
		value={searchText}
		onChange={(e) => onSearchChange(e.target.value)}
		className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-maranics-primary"
		/>
		</div>
		
		<button
		onClick={onOpenFilters}
		className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors shrink-0 ${
			activeFilterCount > 0
			? "bg-maranics-primary text-white border-maranics-primary"
			: "bg-white text-gray-500 border-gray-200 hover:border-maranics-primary hover:text-maranics-primary"
		}`}
		>
		<SlidersHorizontal className="w-3.5 h-3.5" />
		<span className="hidden sm:inline">Filters</span>
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
