import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	base: "/maranics-datalist/",
	plugins: [react()],
	server: {
		port: 3000,
	},
});
