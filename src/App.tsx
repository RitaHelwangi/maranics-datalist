import {
	PanelLeftClose,
	PanelLeftOpen,
	Anchor,
	Users,
	Package,
	Database,
} from "lucide-react";
import { useState } from "react";
import { collections, sampleData } from "./data";
import type { Collection, Item } from "./types";
import TableView from "./components/TableView";
import CardView from "./components/CardView";
import FilterBar from "./components/FilterBar";
import ItemForm from "./components/ItemForm";
import Pagination from "./components/Pagination";

function App() {
	const [currentCollectionId, setCurrentCollectionId] = useState("voyages");
	const [viewMode, setViewMode] = useState<"table" | "card">("table");
	const [searchText, setSearchText] = useState("");
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<Item | null>(null);
	const [data, setData] = useState(sampleData);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5; // can make this dynamic later
	const [sidebarOpen, setSidebarOpen] = useState(true);
	
	const [visibleFieldIds, setVisibleFieldIds] = useState<
	Record<string, string[]>
	>(() => {
		// change this logic to hide some fields by default later
		const defaults: Record<string, string[]> = {};
		collections.forEach((c) => {
			defaults[c.id] = c.fields.slice(0, 6).map((f) => f.id);
		});
		return defaults;
	});
	
	const currentCollection = collections.find(
		(c: Collection) => c.id === currentCollectionId,
	)!;
	
	const allItems = data[currentCollectionId] || [];
	
	// Filter search
	const filteredItems = allItems.filter((item: Item) =>
		currentCollection.fields.some((field) =>
			String(item[field.id] ?? "")
	.toLowerCase()
	.includes(searchText.toLowerCase()),
),
);

// Slice filtered items for current page
const paginatedItems = filteredItems.slice(
	(currentPage - 1) * itemsPerPage,
	currentPage * itemsPerPage,
);

// Switch collection and reset search
function handleCollectionChange(id: string) {
	setCurrentCollectionId(id);
	setSearchText("");
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

// update: inline editing
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

// Add/edit item form submission
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
	// Add new item
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

function CollectionIcon({ name }: { name: string }) {
	if (name === "Anchor") return <Anchor className="w-4 h-4 shrink-0" />;
	if (name === "Users") return <Users className="w-4 h-4 shrink-0" />;
	if (name === "Package") return <Package className="w-4 h-4 shrink-0" />;
	return <Database className="w-4 h-4 shrink-0" />;
}

return (
	<div className="min-h-screen bg-gray-50">
	{/* Header */}
	<header className="bg-white shadow-sm p-4 flex items-center justify-between">
	<img
	src="/src/assets/maranics_logo_dark.png"
	alt="Maranics"
	className="h-8"
	/>
	
	<div className="flex items-center gap-3">
	{/* View toggle */}
	<button
	onClick={() => setViewMode("table")}
	className={`px-4 py-2 rounded text-sm font-medium ${
		viewMode === "table"
		? "bg-maranics-primary text-white"
		: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
	}`}
	>
	Table
	</button>
	<button
	onClick={() => setViewMode("card")}
	className={`px-4 py-2 rounded text-sm font-medium ${
		viewMode === "card"
		? "bg-maranics-primary text-white"
		: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
	}`}
	>
	Cards
	</button>
	
	{/* Add item */}
	<button
	onClick={openAddForm}
	className="px-4 py-2 bg-maranics-primary text-white text-sm font-medium rounded-lg hover:bg-maranics-dark"
	>
	+ Add Item
	</button>
	</div>
	</header>
	
	{/* Body */}
	<div className="flex min-h-screen">
	{/* Sidebar */}
	<aside
	className={`bg-white shadow-sm flex flex-col transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"}`}
	>
	{/* Sidebar header */}
	<div className="flex items-center justify-between p-4 border-b border-gray-100">
	{sidebarOpen && (
		<span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
		Collections
		</span>
	)}
	<button
	onClick={() => setSidebarOpen(!sidebarOpen)}
	className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
	>
	{sidebarOpen ? (
		<PanelLeftClose className="w-4 h-4" />
	) : (
		<PanelLeftOpen className="w-4 h-4" />
	)}
	</button>
	</div>
	
	{/* Collection buttons */}
	<div className="flex-1 p-2 space-y-1">
	{collections.map((collection: Collection) => {
		const isActive = collection.id === currentCollectionId;
		return (
			<button
			key={collection.id}
			onClick={() => handleCollectionChange(collection.id)}
			title={collection.name}
			className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
				isActive
				? "bg-maranics-primary text-white"
				: "text-gray-600 hover:bg-gray-100"
			}`}
			>
			<CollectionIcon name={collection.icon} />
			{sidebarOpen && (
				<span className="text-sm font-medium truncate">
				{collection.name}
				</span>
			)}
			</button>
		);
	})}
	</div>
	</aside>
	
	{/* Main content */}
	<main className="flex-1 p-6">
	<h2 className="text-xl font-bold mb-4">{currentCollection.name}</h2>
	
	<FilterBar
	searchText={searchText}
	onSearchChange={handleSearchChange}
	/>
	
	{viewMode === "table" ? (
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
	
	{/* Pagination below the table/cards */}
	<Pagination
	totalItems={filteredItems.length}
	itemsPerPage={itemsPerPage}
	currentPage={currentPage}
	onPageChange={setCurrentPage}
	/>
	</main>
	</div>
	
	{/* Modal form for adding/editing items */}
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
