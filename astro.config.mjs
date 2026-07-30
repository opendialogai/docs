// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sidebar from './src/sidebar.generated.mjs';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.opendialog.ai',
	// GitBook serves every URL without a trailing slash. Generating internal links
	// and canonical URLs in the same shape keeps navigation free of redirect hops
	// and keeps the canonical URL identical to the one indexed today.
	trailingSlash: 'never',
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
			},
			// No `social`: GitBook carries no social icons, and Starlight renders them in
			// the header and the mobile menu whenever the key is present.
			sidebar,
		}),
	],
});
