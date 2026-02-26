export interface Field {
	id: string; 
	label: string; 
	type: "text" | "date" | "select"; 
	required: boolean; 
	options?: Option[]; 
}

export interface Option {
	value: string; 
	label: string; 
	color: string; 
}

export interface Collection {
	id: string; 
	name: string; 
	icon: string; 
	fields: Field[]; 
}

export interface Item {
	id: string; 
	[key: string]: unknown; 
}

export interface Filters {
	search?: string; 
	[key: string]: unknown; 
}
