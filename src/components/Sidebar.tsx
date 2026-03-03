import {
	X,
	PanelLeftClose,
	PanelLeftOpen,
	Anchor,
	Users,
	Activity,
	Database,
} from "lucide-react";
import type { Collection } from "../types";

interface SidebarProps {
	collections: Collection[];
	currentCollectionId: string;
	onCollectionChange: (id: string) => void;
	isOpen: boolean; 
	onToggle: () => void; 
	isMobileOpen: boolean; 
	onMobileClose: () => void; 
}

function CollectionIcon({ name }: { name: string }) {
	if (name === "Anchor") return <Anchor className="w-4 h-4 shrink-0" />;
	if (name === "Users") return <Users className="w-4 h-4 shrink-0" />;
	if (name === "Activity") return <Activity className="w-4 h-4 shrink-0" />;
	return <Database className="w-4 h-4 shrink-0" />;
}

function SidebarContent({
	collections,
	currentCollectionId,
	onCollectionChange,
	isOpen,
	onToggle,
	onMobileClose,
	isMobile = false,
}: SidebarProps & { isMobile?: boolean }) {
	return (
		<div className="h-full flex flex-col bg-white">
		{/* Sidebar header */}
		<div className="flex items-center justify-between p-4 border-b border-gray-100">
		{(isOpen || isMobile) && (
			<span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
			Collections
			</span>
		)}
		{/* Desktop toggle button */}
		{!isMobile && (
			<button
			onClick={onToggle}
			className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
			>
			{isOpen ? (
				<PanelLeftClose className="w-4 h-4" />
			) : (
				<PanelLeftOpen className="w-4 h-4" />
			)}
			</button>
		)}
		{/* Mobile close button */}
		{isMobile && (
			<button
			onClick={onMobileClose}
			className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
			>
			<X className="w-4 h-4" />
			</button>
		)}
		</div>
		
		{/* Collection buttons */}
		<div className="flex-1 p-2 space-y-1">
		{collections.map((collection: Collection) => {
			const isActive = collection.id === currentCollectionId;
			return (
				<button
				key={collection.id}
				onClick={() => {
					onCollectionChange(collection.id);
					if (isMobile) onMobileClose();
				}}
				title={collection.name}
				className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
					isActive
					? "bg-maranics-primary text-white"
					: "text-gray-600 hover:bg-gray-100"
				}`}
				>
				<CollectionIcon name={collection.icon} />
				{(isOpen || isMobile) && (
					<span className="text-sm font-medium truncate">
					{collection.name}
					</span>
				)}
				</button>
			);
		})}
		</div>
		</div>
	);
}

function Sidebar(props: SidebarProps) {
	return (
		<>
		{/* Desktop sidebar */}
		<aside
		className={`hidden lg:flex flex-col flex-shrink-0 border-r border-gray-100 transition-all duration-300 ${
			props.isOpen ? "w-64" : "w-16"
		}`}
		>
		<SidebarContent {...props} />
		</aside>
		
		{/* Mobile drawer overlay */}
		{props.isMobileOpen && (
			<div className="fixed inset-0 z-50 lg:hidden">
			{/* Dark backdrop */}
			<div
			className="absolute inset-0 bg-black bg-opacity-40"
			onClick={props.onMobileClose}
			/>
			{/* Drawer */}
			<div className="absolute left-0 top-0 bottom-0 w-72 shadow-xl">
			<SidebarContent {...props} isMobile={true} />
			</div>
			</div>
		)}
		</>
	);
}

export default Sidebar;
