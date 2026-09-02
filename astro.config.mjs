// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sidebar from './src/sidebar.generated.mjs';
import { rehypeImageWidth } from './scripts/lib/rehype-image-width.mjs';
import { rehypeFigures } from './scripts/lib/rehype-figures.mjs';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { pinLightTheme } from './scripts/lib/light-theme.mjs';

/**
 * Rewrites the colour scheme Starlight hard-codes into every emitted page.
 *
 * @type {import('astro').AstroIntegration}
 */
const pinLightThemeIntegration = {
	name: 'pin-light-theme',
	hooks: {
		'astro:build:done': ({ dir, logger }) => {
			const out = fileURLToPath(dir);
			const pages = readdirSync(out, { recursive: true }).filter((f) => String(f).endsWith('.html'));
			if (!pages.length) throw new Error('pin-light-theme: no HTML pages in the build output');
			for (const page of pages) {
				const path = `${out}/${page}`;
				writeFileSync(path, pinLightTheme(readFileSync(path, 'utf8')));
			}
			logger.info(`pinned data-theme="light" on ${pages.length} pages`);
		},
	},
};

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.opendialog.ai',
	// GitBook serves every URL without a trailing slash. Generating internal links
	// and canonical URLs in the same shape keeps navigation free of redirect hops
	// and keeps the canonical URL identical to the one indexed today.
	trailingSlash: 'never',
	// Applies the per-image widths GitBook authored, which convert.mjs carries through
	// the markdown title slot. Astro's MDX integration extends this config by default,
	// so .mdx pages get it too.
	markdown: {
		rehypePlugins: [rehypeImageWidth, rehypeFigures],
	},
	integrations: [
		starlight({
			title: 'OpenDialog Docs',
			logo: { src: './src/assets/opendialog-logo.png', alt: 'OpenDialog' },
			favicon: '/favicon.png',
			customCss: ['./src/styles/custom.css'],
			components: {
				// Renders the frontmatter description under the title, as GitBook does.
				PageTitle: './src/components/PageTitle.astro',
				// Orders the header as GitBook does and carries its opendialog.ai link
				// and "Talk to an expert" call to action.
				Header: './src/components/Header.astro',
				// The site ships light-only, as GitBook does: no switcher, theme pinned.
				ThemeSelect: './src/components/ThemeSelect.astro',
				ThemeProvider: './src/components/ThemeProvider.astro',
				// Would otherwise leave an empty bordered strip in the mobile menu.
				MobileMenuFooter: './src/components/MobileMenuFooter.astro',
				// Renders a parent page as one clickable, expandable row rather than
				// repeating it as the first child of its own group. Must be wired through
				// Sidebar: SidebarSublist is not an overridable component, and naming it
				// here is accepted silently and does nothing.
				Sidebar: './src/components/Sidebar.astro',
			},
			// No `social`: GitBook carries no social icons, and Starlight renders them in
			// the header and the mobile menu whenever the key is present.
			sidebar,
		}),
		pinLightThemeIntegration,
	],
});
