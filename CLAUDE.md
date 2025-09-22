# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.5.3 application with TypeScript and Tailwind CSS v4, bootstrapped with `create-next-app`. The project uses the App Router architecture with React 19 and is optimized with Turbopack for faster builds.

## Development Commands

- **Start development server**: `npm run dev` (runs with Turbopack for faster builds)
- **Build for production**: `npm run build` (uses Turbopack)
- **Start production server**: `npm run start`
- **Run linting**: `npm run lint` (ESLint with Next.js rules)

## Architecture

- **Framework**: Next.js 15 with App Router
- **UI**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4 with PostCSS
- **Fonts**: Geist and Geist Mono via `next/font/google`
- **Path aliases**: `@/*` maps to `./src/*`

## Code Structure

- `src/app/` - App Router pages and layouts
- `src/app/layout.tsx` - Root layout with font configuration
- `src/app/page.tsx` - Homepage component
- `src/app/globals.css` - Global Tailwind styles
- `public/` - Static assets

## Key Configuration

- **TypeScript**: Strict mode enabled with ES2017 target
- **ESLint**: Next.js core web vitals and TypeScript rules
- **Next.js**: Uses App Router, ignores `.next/`, `out/`, `build/` directories
- **Tailwind**: v4 with PostCSS integration