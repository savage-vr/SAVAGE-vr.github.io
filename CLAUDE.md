# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a Next.js 15 application using React 19 with TypeScript and Tailwind CSS v4. The project is configured for static export (`output: 'export'` in `next.config.ts`).

### Key Architecture:

- **App Router**: Uses Next.js App Router with `src/app/` directory structure
- **Styling**: Tailwind CSS v4 with PostCSS integration, custom CSS variables for theming
- **Fonts**: Geist and Geist Mono fonts from Google Fonts with CSS variable integration
- **Path Mapping**: `#/*` alias maps to `./src/*` for imports

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production (static export)
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## Project Configuration

- **TypeScript**: Strict mode enabled with Next.js plugin integration
- **ESLint**: Uses Next.js core-web-vitals and TypeScript presets
- **Static Export**: Configured for static site generation
- **Styling**: Dark/light theme support via CSS variables and `prefers-color-scheme`

## Key Files

- `src/app/layout.tsx`: Root layout with font configuration and metadata
- `src/app/page.tsx`: Main page component (currently minimal)
- `src/app/globals.css`: Global styles with Tailwind imports and theme variables
- `next.config.ts`: Next.js configuration with static export setting
