// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.opendialog.ai',
	// GitBook serves every URL without a trailing slash. Generating internal links
	// and canonical URLs in the same shape keeps navigation free of redirect hops
	// and keeps the canonical URL identical to the one indexed today.
	trailingSlash: 'never',
	integrations: [
		starlight({
			title: 'OpenDialog',
			logo: { src: './src/assets/opendialog-logo.png', alt: 'OpenDialog' },
			favicon: '/favicon.png',
			customCss: ['./src/styles/custom.css'],
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/opendialogai' },
				{ icon: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/opendialogai/' },
				{ icon: 'x.com', label: 'X', href: 'https://twitter.com/opendialogai' },
			],
			// Phase 1 placeholder. scripts/sidebar.mjs generates this from source/SUMMARY.md
			// in Phase 2, preserving GitBook's group order and labels.
			sidebar: [
				{
					label: 'GETTING STARTED',
					items: [
						{ label: 'Introduction', slug: '' },
						{ label: 'Getting ready', slug: 'getting-started-1/getting-ready' },
					],
				},
				{
					label: 'STEP BY STEP GUIDES',
					items: [{ label: 'AI Agent Creation Overview', slug: 'tutorials/ai-agent-creation-overview' }],
				},
				{
					label: 'CORE CONCEPTS',
					items: [{ label: 'OpenDialog Approach', slug: 'core-concepts/the-opendialog-model' }],
				},
			],
		}),
	],
});
