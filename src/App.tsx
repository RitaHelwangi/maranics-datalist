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
      <aside className="w-64 bg-white shadow-sm p-4">
        <h2 className="text-sm font-semibold text-gray-500 mb-3">
          COLLECTIONS
        </h2>
        {collections.map((collection: Collection) => (
          <button
            key={collection.id}
            onClick={() => handleCollectionChange(collection.id)}
            className={`w-full text-left px-4 py-2 rounded mb-1 ${
              collection.id === currentCollectionId
                ? "bg-maranics-primary text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {collection.name}
          </button>
        ))}
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
