// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import { BASE_PATH } from './src/utils';

// https://astro.build/config
export default defineConfig({
  // Temporary values
  site: 'https://valekjo.github.io',
  base: BASE_PATH,
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [icon()]
});
