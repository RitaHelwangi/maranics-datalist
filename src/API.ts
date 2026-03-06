import type { Collection, Item, Field } from "./types";

const API_BASE_URL =
"https://flow-manager.cloud.preprod.maranics-staging.com/api";

const API_TOKEN = import.meta.env.VITE_RITA_TOKEN;

interface ApiProperty {
	id: string;
	name: string;
	type: string;
}

interface ApiCollection {
	id: string;
	name: string;
	properties?: ApiProperty[];
}

// Successfully fetched real collections from the Maranics API
// The API returns "properties" which I map to "fields" to match the internal model
export async function fetchCollections(): Promise<Collection[]> {
	const response = await fetch(`${API_BASE_URL}/data-list/collections`, {
		headers: {
			Authorization: `Bearer ${API_TOKEN}`,
			"Content-Type": "application/json",
		},
	});
	
	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(
			`Failed to fetch collections: ${response.status} - ${errorText}`,
		);
	}
	
	const data: ApiCollection[] = await response.json();
	
	return data.map((collection) => ({
		id: collection.id,
		name: collection.name,
		icon: "Database",
		fields: (collection.properties ?? []).map(
			(property): Field => ({
				id: property.id,
				label: property.name,
				type: mapFieldType(property.type),
				required: false,
			}),
		),
	}));
}

// Item fetching was implemented but not fully tested before switching to mock data
// The mock data in data.ts is modeled directly from the real API response
// so connecting this function should work without changes to the rest of the app
export async function fetchItems(collectionId: string): Promise<Item[]> {
	const response = await fetch(
		`${API_BASE_URL}/data-list/items?collectionId=${collectionId}`,
		{
			headers: {
				Authorization: `Bearer ${API_TOKEN}`,
				"Content-Type": "application/json",
			},
		},
	);
	
	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to fetch items: ${response.status} - ${errorText}`);
	}
	
	const data: Item[] = await response.json();
	return data;
}

// Maps the API field types to the internal Field type used across the app
// The API uses types like "SingleTag" and "DateTime" which need to be normalized
function mapFieldType(apiType: string): Field["type"] {
	switch (apiType.toLowerCase()) {
		case "datetime":
		case "date":
		return "date";
		case "singletag":
		case "multitag":
		return "select";
		default:
		return "text";
	}
}
