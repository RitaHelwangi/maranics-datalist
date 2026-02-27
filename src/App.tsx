import { useState } from "react";
import { collections, sampleData } from "./data";
import type { Collection,Item} from "./types";
import TableView from "./components/TableView";
import CardView from "./components/CardView";
import FilterBar from "./components/FilterBar";

function App() {
	const [currentCollectionId, setCurrentCollectionId] = useState("voyages");
	const [viewMode, setViewMode] = useState<"table" | "card">("table");
	const [searchText, setSearchText] = useState("");
	const currentCollection = collections.find(
		(c: Collection) => c.id === currentCollectionId,
	)!;
	
	// Get items for current collection
	const allItems = sampleData[currentCollectionId] || [];
	
	// Filter items by search text
	const filteredItems = allItems.filter((item: Item) =>
		currentCollection.fields.some((field) =>
			String(item[field.id] ?? "")
	.toLowerCase()
	.includes(searchText.toLowerCase()),
),
);

// Reset search when switching collections
function handleCollectionChange(id: string) {
	setCurrentCollectionId(id);
	setSearchText("");
}

return (
	<div className="min-h-screen bg-gray-50">
	<header className="bg-white shadow-sm p-4 flex items-center justify-between">
	<h1 className="text-2xl font-bold text-gray-900">Maranics</h1>
	
	{/* View toggle buttons */}
	<div className="flex gap-2">
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
	</div>
	</header>
	
	<div className="flex min-h-screen ">
	<aside className="w-64 bg-white shadow-sm p-4">
	<h2 className="text-sm font-semibold text-gray-500 mb-3">
	COLLECTIONS
	</h2>
	
	{collections.map((collection: Collection) => (
		<button
		key={collection.id}
		onClick={() => handleCollectionChange(collection.id)}
		className={`
                w-full text-left px-4 py-2 rounded mb-1
                ${
			collection.id === currentCollectionId
			? "bg-maranics-primary text-white"
			: "text-gray-700 hover:bg-gray-100"
		}
            `}
		>
		{collection.name}
		</button>
	))}
	</aside>
	
	{/* Main content */}
	<main className="flex-1 p-6">
	<h2 className="text-xl font-bold mb-4">{currentCollection.name}</h2>
	
	<FilterBar searchText={searchText} onSearchChange={setSearchText} />
	
	{viewMode === "table" ? (
		<TableView collection={currentCollection} items={filteredItems} />
	) : (
		<CardView collection={currentCollection} items={filteredItems} />
	)}
	</main>
	</div>
	</div>
);
}

export default App;
