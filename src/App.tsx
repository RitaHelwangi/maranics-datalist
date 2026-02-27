import { useState } from "react";
import { collections, sampleData } from "./data";
import type { Collection} from "./types";
import TableView from "./components/TableView";

function App() {
	const [currentCollectionId, setCurrentCollectionId] = useState("voyages");
	
	const currentCollection = collections.find(
		(c: Collection) => c.id === currentCollectionId,
	)!;
	
	const items = sampleData[currentCollectionId] || [];
	
	return (
		<div className="min-h-screen bg-gray-50">
		<header className="bg-white shadow-sm p-4">
		<h1 className="text-2xl font-bold text-gray-900">
		Maranics
		</h1>
		</header>
		
		<div className="flex">
		<aside className="w-64 bg-white shadow-sm p-4 min-h-screen">
		<h2 className="text-sm font-semibold text-gray-500 mb-3">
		COLLECTIONS
		</h2>
		
		{collections.map((collection: Collection) => (
			<button
			key={collection.id}
			onClick={() => setCurrentCollectionId(collection.id)}
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
		
		<TableView collection={currentCollection} items={items} />
		</main>
		</div>
		</div>
	);
}

export default App;
