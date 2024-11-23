import { defineConfig, loadEnv } from 'vite'
import viteReact from '@vitejs/plugin-react-swc'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, path.resolve(__dirname, '..'))
    process.env = { ...process.env, ...env }
    return {
        plugins: [TanStackRouterVite(), viteReact()],
        resolve: {
            alias: {
                '@frontend': path.resolve(__dirname, './src'),
                '@shared': path.resolve(__dirname, '../shared'),
                '@backend': path.resolve(__dirname, '../backend'),
            },
        },
        server: {
            host: true,
            proxy: {
                '/api': { target: `http://${env.VITE_BACKEND_HOST}:${env.VITE_BACKEND_PORT}` },
            },
        },
    }
})
