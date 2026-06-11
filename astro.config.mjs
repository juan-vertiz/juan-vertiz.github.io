// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://juan-vertiz.github.io',
  fonts: [{
    provider: fontProviders.local(),
    name: 'Quantico',
    cssVariable: '--font-quantico',
    options: {
      variants: [
        {
          src: ['./src/assets/fonts/Quantico-400-subset.woff2'],
          weight: 'normal',
          style: 'normal',
        },
        {
          src: ['./src/assets/fonts/Quantico-700-subset.woff2'],
          weight: 'bold',
          style: 'normal',
        }
      ],
    }
  }],
  vite: {
    plugins: [tailwindcss()],
  },
});
