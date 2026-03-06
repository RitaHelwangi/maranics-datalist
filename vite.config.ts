import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	base: process.env.NODE_ENV === "production" ? "/maranics-datalist/" : "/",
	plugins: [react()],
	server: {
		port: 3000,
		proxy: {
			"/api": {
				target: "https://flow-manager.cloud.preprod.maranics-staging.com",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, "/api"),
			},
		},
	},
});
