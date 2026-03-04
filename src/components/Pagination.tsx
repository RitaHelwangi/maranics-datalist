import { ChevronLeft, ChevronRight } from "lucide-react";

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
	
	if (totalItems === 0) return null;
	
	return (
		<div className="bg-white border border-gray-200 rounded-xl px-6 py-4 flex items-center justify-center gap-2">
		<button
		onClick={() => onPageChange(currentPage - 1)}
		disabled={currentPage === 1}
		className="h-10 w-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-maranics-primary hover:text-maranics-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
		>
		<ChevronLeft className="w-4 h-4" />
		</button>
		
		{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
			<button
			key={page}
			onClick={() => onPageChange(page)}
			className={`h-10 min-w-[40px] px-2 text-xs font-black rounded-xl border transition-all ${
				page === currentPage
				? "bg-maranics-primary border-maranics-primary text-white shadow-md"
				: "bg-white border-gray-200 text-gray-600 hover:border-maranics-primary hover:text-maranics-primary"
			}`}
			>
			{page}
			</button>
		))}
		
		<button
		onClick={() => onPageChange(currentPage + 1)}
		disabled={currentPage === totalPages}
		className="h-10 w-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-maranics-primary hover:text-maranics-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
		>
		<ChevronRight className="w-4 h-4" />
		</button>
		</div>
	);
}

export default Pagination;
