interface FilterBarProps {
	searchText: string;
	onSearchChange: (value: string) => void;
}

function FilterBar({ searchText, onSearchChange }: FilterBarProps) {
	return (
		<div className="mb-4">
		<input
		type="text"
		placeholder="Search..."
		value={searchText}
		onChange={(e) => onSearchChange(e.target.value)}
		className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-maranics-primary"
		/>
		</div>
	);
}

export default FilterBar;
