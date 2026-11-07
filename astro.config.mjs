import { defineConfig } from 'astro/config';

// GitHub Actions supplies the real origin and base path for either repository type.
const site = process.env.SITE_URL;
const base = process.env.BASE_PATH || '/';
if (site && !/^https?:\/\//.test(site)) throw new Error('SITE_URL must be an http(s) origin.');
export default defineConfig({
  ...(site ? { site } : {}),
  base,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' }
});
