interface BadgeProps {
	label: string; 
	color: string; 
}

function Badge({ label, color }: BadgeProps) {
	return (
		<span
		style={{
			backgroundColor: color + "20", 
			color: color,
			borderColor: color + "40", 
		}}
		className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
		>
		{label}
		</span>
	);
}

export default Badge;
