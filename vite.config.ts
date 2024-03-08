import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import eslintPlugin from 'vite-plugin-eslint';
import Components from 'unplugin-vue-components/vite';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080,
    host: true,
  },
  plugins: [
    eslintPlugin(),
    Components({
      dts: 'src/components.d.ts', // generate `components.d.ts` global declarations
    }),
    uni(),
  ],
});
