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
		<div className="relative flex-1 lg:w-80 lg:flex-none">
		<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
		<input
		type="text"
		placeholder="Search..."
		value={searchText}
		onChange={(e) => onSearchChange(e.target.value)}
		className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-maranics-primary bg-white placeholder-gray-400"
		/>
		</div>
		
		<button
		onClick={onOpenFilters}
		className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all shrink-0 ${
			activeFilterCount > 0
			? "bg-maranics-primary text-white border-maranics-primary shadow-sm"
			: "bg-white text-gray-500 border-gray-200 hover:border-maranics-primary hover:text-maranics-primary"
		}`}
		>
		<SlidersHorizontal className="w-4 h-4" />
		Filters
		{activeFilterCount > 0 && (
			<span className="bg-white text-maranics-primary text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none">
			{activeFilterCount}
			</span>
		)}
		</button>
		</div>
	);
}

export default FilterBar;
