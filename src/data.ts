import type { Collection, Item } from "./types";

export const collections: Collection[] = [
	{
		id: "voyages",
		name: "Voyage Event Reporting",
		icon: "Anchor",
		fields: [
			{
				id: "title",
				label: "Event Title",
				type: "text",
				required: true,
			},
			{
				id: "eventType",
				label: "Event Type",
				type: "select",
				required: true,
				options: [
					{ value: "arrival", label: "Arrival", color: "#A855F7" },
					{ value: "departure", label: "Departure", color: "#F59E0B" },
					{ value: "bunkering", label: "Bunkering", color: "#10B981" },
				],
			},
			{
				id: "eventTime",
				label: "Event Time",
				type: "date",
				required: true,
			},
			{
				id: "voyageNumber",
				label: "Voyage Number",
				type: "text",
				required: false,
			},
			{
				id: "fromPort",
				label: "From Port",
				type: "text",
				required: false,
			},
			{
				id: "toPort",
				label: "To Port",
				type: "text",
				required: false,
			},
		],
	},
	
	{
		id: "employees",
		name: "Employee Directory",
		icon: "Users",
		fields: [
			{
				id: "name",
				label: "Full Name",
				type: "text",
				required: true,
			},
			{
				id: "email",
				label: "Email",
				type: "text",
				required: true,
			},
			{
				id: "department",
				label: "Department",
				type: "select",
				required: true,
				options: [
					{ value: "engineering", label: "Engineering", color: "#3B82F6" },
					{ value: "operations", label: "Operations", color: "#8FB63E" },
					{ value: "sales", label: "Sales", color: "#10B981" },
				],
			},
			{
				id: "hireDate",
				label: "Hire Date",
				type: "date",
				required: false,
			},
		],
	},
	
	{
		id: "inventory",
		name: "Inventory Items",
		icon: "Package",
		fields: [
			{
				id: "itemName",
				label: "Item Name",
				type: "text",
				required: true,
			},
			{
				id: "quantity",
				label: "Quantity",
				type: "text",
				required: true,
			},
			{
				id: "status",
				label: "Status",
				type: "select",
				required: true,
				options: [
					{ value: "in-stock", label: "In Stock", color: "#10B981" },
					{ value: "low", label: "Low Stock", color: "#F59E0B" },
					{ value: "out", label: "Out of Stock", color: "#EF4444" },
				],
			},
		],
	},
];

// Mock data for testing // 

export const sampleData: Record<string, Item[]> = {
	// Voyage events data
	voyages: [
		{
			id: "1",
			title: "Color Magic - Report #1001",
			eventType: "departure",
			eventTime: "2026-02-11T09:00",
			voyageNumber: "VOY-1001",
			fromPort: "Hirtshals",
			toPort: "Larvik",
		},
		{
			id: "2",
			title: "Color Hybrid - Report #1002",
			eventType: "bunkering",
			eventTime: "2026-02-12T10:00",
			voyageNumber: "VOY-1002",
			fromPort: "Hirtshals",
			toPort: "Kiel",
		},
		{
			id: "3",
			title: "SuperSpeed 1 - Report #1003",
			eventType: "arrival",
			eventTime: "2026-02-13T11:00",
			voyageNumber: "VOY-1003",
			fromPort: "Larvik",
			toPort: "Kristiansand",
		},
		{
			id: "4",
			title: "SuperSpeed 2 - Report #1004",
			eventType: "departure",
			eventTime: "2026-02-14T12:00",
			voyageNumber: "VOY-1004",
			fromPort: "Kristiansand",
			toPort: "Larvik",
		},
	],
	
	// Employee data
	employees: [
		{
			id: "1",
			name: "John Smith",
			email: "john.smith@company.com",
			department: "engineering",
			hireDate: "2024-01-15",
		},
		{
			id: "2",
			name: "Sarah Connor",
			email: "sarah.connor@company.com",
			department: "operations",
			hireDate: "2023-06-20",
		},
		{
			id: "3",
			name: "Mike Johnson",
			email: "mike.johnson@company.com",
			department: "sales",
			hireDate: "2025-03-10",
		},
	],
	
	// Inventory data
	inventory: [
		{
			id: "1",
			itemName: "Hydraulic Pump",
			quantity: "45",
			status: "in-stock",
		},
		{
			id: "2",
			itemName: "Safety Valve",
			quantity: "8",
			status: "low",
		},
		{
			id: "3",
			itemName: "Engine Filter",
			quantity: "0",
			status: "out",
		},
	],
};
