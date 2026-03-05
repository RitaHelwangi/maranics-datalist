export interface Option {
	value: string;
	label: string;
	color: string;
}

export interface Field {
	id: string;
	label: string;
	type: "text" | "date" | "select";
	required?: boolean;
	options?: Option[];
	group?: string;
	showInCard?: boolean;
	filterable?: boolean; 
	routeFrom?: boolean;
	routeTo?: boolean;
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

