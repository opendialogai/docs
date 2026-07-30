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
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/opendialogai' },
				{ icon: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/opendialogai/' },
				{ icon: 'x.com', label: 'X', href: 'https://twitter.com/opendialogai' },
			],
			sidebar,
		}),
	],
});
