interface PaginationProps {
	totalItems: number;
	itemsPerPage: number;
	currentPage: number;
	onPageChange: (page: number) => void;
}

function Pagination({
	totalItems,
	itemsPerPage,
	currentPage,
	onPageChange,
}: PaginationProps) {
	
	const totalPages = Math.ceil(totalItems / itemsPerPage);

	if (totalPages <= 1) return null;
	
	return (
		<div className="flex items-center justify-center gap-2 mt-4 py-4">
		
		<button
		onClick={() => onPageChange(currentPage - 1)}
		disabled={currentPage === 1}
		className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
		>
		‹
		</button>
		
		{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
			<button
			key={page}
			onClick={() => onPageChange(page)}
			className={`px-3 py-2 rounded-lg text-sm font-medium ${
				page === currentPage
				? "bg-maranics-primary text-white"
				: "border border-gray-300 text-gray-600 hover:bg-gray-50"
			}`}
			>
			{page}
			</button>
		))}
		
		<button
		onClick={() => onPageChange(currentPage + 1)}
		disabled={currentPage === totalPages}
		className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
		>
		›
		</button>
		</div>
	);
}

export default Pagination;
