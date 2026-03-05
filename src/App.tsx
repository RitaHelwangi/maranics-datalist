import { Menu, LayoutGrid, Table2 } from "lucide-react";
import { useState, useEffect } from "react";
import { collections, sampleData } from "./data";
import type { Collection, Item } from "./types";
import TableView from "./components/TableView";
import CardView from "./components/CardView";
import FilterBar from "./components/FilterBar";
import FilterPanel from "./components/FilterPanel"; 
import ItemForm from "./components/ItemForm";
import Pagination from "./components/Pagination";
import Sidebar from "./components/Sidebar";

function App() {
	const [currentCollectionId, setCurrentCollectionId] = useState("voyages");
	
	const [viewMode, setViewMode] = useState<"table" | "card">(
		window.innerWidth < 1024 ? "card" : "table",
	);
	
	const [searchText, setSearchText] = useState("");
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<Item | null>(null);
	const [data, setData] = useState(sampleData);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 8;
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
	const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false); 
	const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
		{},
	); 
	
	useEffect(() => {
		const handleResize = () => {
			const mobile = window.innerWidth < 1024;
			setIsMobile(mobile);
			if (mobile) setViewMode("card");
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);
	
	const [visibleFieldIds, setVisibleFieldIds] = useState<
	Record<string, string[]>
	>(() => {
		const defaults: Record<string, string[]> = {};
		collections.forEach((c) => {
			defaults[c.id] = c.fields.slice(0, 7).map((f) => f.id);
		});
		return defaults;
	});
	
	const currentCollection = collections.find(
		(c: Collection) => c.id === currentCollectionId,
	)!;
	
	const allItems = data[currentCollectionId] || [];
	
	// Search + active filters combined
	const filteredItems = allItems.filter((item: Item) => {
		const matchesSearch = currentCollection.fields.some((field) =>
			String(item[field.id] ?? "")
		.toLowerCase()
		.includes(searchText.toLowerCase()),
	);
	const matchesFilters = Object.entries(activeFilters).every(
		([fieldId, value]) => !value || String(item[fieldId] ?? "") === value,
	);
	return matchesSearch && matchesFilters;
});

const paginatedItems = filteredItems.slice(
	(currentPage - 1) * itemsPerPage,
	currentPage * itemsPerPage,
);

function handleCollectionChange(id: string) {
	setCurrentCollectionId(id);
	setSearchText("");
	setActiveFilters({}); 
	setCurrentPage(1);
}

const handleSearchChange = (text: string) => {
	setSearchText(text);
	setCurrentPage(1);
};

function handleToggleColumn(fieldId: string) {
	setVisibleFieldIds((prev) => {
		const current = prev[currentCollectionId] || [];
		const updated = current.includes(fieldId)
		? current.filter((id) => id !== fieldId)
		: [...current, fieldId];
		return { ...prev, [currentCollectionId]: updated };
	});
}

function handleUpdateCell(
	itemId: string,
	fieldId: string,
	newValue: unknown,
) {
	setData((prev) => ({
		...prev,
		[currentCollectionId]: prev[currentCollectionId].map((item) =>
			item.id === itemId ? { ...item, [fieldId]: newValue } : item,
	),
}));
}

function handleSave(formData: Item) {
	if (editingItem) {
		setData((prev) => ({
			...prev,
			[currentCollectionId]: prev[currentCollectionId].map((item) =>
				item.id === editingItem.id
			? { ...formData, id: editingItem.id }
			: item,
		),
	}));
} else {
	const newItem = { ...formData, id: Date.now().toString() };
	setData((prev) => ({
		...prev,
		[currentCollectionId]: [newItem, ...prev[currentCollectionId]],
	}));
}
setIsFormOpen(false);
setEditingItem(null);
}

function openAddForm() {
	setEditingItem(null);
	setIsFormOpen(true);
}

function openEditForm(item: Item) {
	setEditingItem(item);
	setIsFormOpen(true);
}

const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

return (
	<div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
	{/* Header */}
	<header className="bg-white border-b border-gray-100 px-4 h-16 flex items-center justify-between shrink-0 z-40">
	<div className="flex items-center gap-2 min-w-0">
	<button
	onClick={() => setIsMobileSidebarOpen(true)}
	className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 shrink-0"
	>
	<Menu className="w-5 h-5" />
	</button>
	<img
	src="./maranics_logo_dark.png"
	alt="Maranics"
	className="h-6 sm:h-8 min-w-0 max-w-[120px] sm:max-w-none object-contain"
	/>
	</div>
	
	<div className="flex items-center gap-2 shrink-0">
	<div className="hidden lg:flex items-center border border-gray-200 rounded-lg overflow-hidden">
	<button
	onClick={() => setViewMode("table")}
	className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors border-r border-gray-200 ${
		viewMode === "table"
		? "bg-maranics-primary/10 text-maranics-primary"
		: "bg-white text-gray-400 hover:text-gray-600"
	}`}
	>
	<Table2 className="w-3.5 h-3.5" />
	Table
	</button>
	<button
	onClick={() => setViewMode("card")}
	className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
		viewMode === "card"
		? "bg-maranics-primary/10 text-maranics-primary"
		: "bg-white text-gray-400 hover:text-gray-600"
	}`}
	>
	<LayoutGrid className="w-3.5 h-3.5" />
	Cards
	</button>
	</div>
	
	<button
	onClick={openAddForm}
	className="flex items-center gap-1 px-3 py-2 bg-maranics-primary text-white text-sm font-medium rounded-lg hover:bg-maranics-dark shrink-0 whitespace-nowrap"
	>
	+ Add Item
	</button>
	</div>
	</header>
	
	{/* Body */}
	<div className="flex flex-1 overflow-hidden">
	<Sidebar
	collections={collections}
	currentCollectionId={currentCollectionId}
	onCollectionChange={handleCollectionChange}
	isOpen={sidebarOpen}
	onToggle={() => setSidebarOpen(!sidebarOpen)}
	isMobileOpen={isMobileSidebarOpen}
	onMobileClose={() => setIsMobileSidebarOpen(false)}
	/>
	
	<main className="flex-1 flex flex-col overflow-hidden min-w-0">
	<div className="px-6 pt-6 pb-4 shrink-0 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
	<h2 className="text-xl font-bold text-gray-900">
	{currentCollection.name}
	</h2>
	
	<FilterBar
	searchText={searchText}
	onSearchChange={handleSearchChange}
	activeFilterCount={activeFilterCount}
	onOpenFilters={() => setIsFilterPanelOpen(true)}
	/>
	</div>
	
	<div className="flex-1 overflow-auto px-6 pb-2">
	{viewMode === "table" && !isMobile ? (
		<TableView
		collection={currentCollection}
		items={paginatedItems}
		visibleFieldIds={visibleFieldIds[currentCollectionId] || []}
		onToggleColumn={handleToggleColumn}
		onUpdateItem={handleUpdateCell}
		/>
	) : (
		<CardView
		collection={currentCollection}
		items={paginatedItems}
		onEdit={openEditForm}
		/>
	)}
	</div>
	
	<div className="shrink-0 px-6 py-3">
	<Pagination
	totalItems={filteredItems.length}
	itemsPerPage={itemsPerPage}
	currentPage={currentPage}
	onPageChange={setCurrentPage}
	/>
	</div>
	</main>
	</div>
	
	<FilterPanel
	collection={currentCollection}
	activeFilters={activeFilters}
	onFilterChange={(fieldId, value) =>
		setActiveFilters((prev) => ({ ...prev, [fieldId]: value }))
	}
	onClear={() => setActiveFilters({})}
	isOpen={isFilterPanelOpen}
	onClose={() => setIsFilterPanelOpen(false)}
	/>
	
	{isFormOpen && (
		<ItemForm
		collection={currentCollection}
		item={editingItem}
		onSave={handleSave}
		onClose={() => setIsFormOpen(false)}
		/>
	)}
	</div>
);
}

export default App;
