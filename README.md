# ACME

A web application for working with files and folders: browsing contents, navigation, upload, rename, and delete.

## Tech Stack

**Next.js** was chosen as the main framework — it provides the App Router, server and client components, built-in optimizations, and a clear project structure. This makes future scaling straightforward: adding API routes, server-side rendering, authentication, and backend integration without changing the stack.

Also used:

- **React** — UI
- **TypeScript** — type safety
- **Tailwind CSS** — styling

## Third-Party Libraries

| Library | Purpose |
|---|---|
| [Font Awesome](https://fontawesome.com/) (`@fortawesome/react-fontawesome`) | UI icons |
| [react-hot-toast](https://react-hot-toast.com/) | File upload notifications |
| [clsx](https://github.com/lukeed/clsx) | Conditional CSS class merging |

## Getting Started

Install dependencies:

```bash
npm install
```

Development mode (app available at [http://localhost:3000](http://localhost:3000)):

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Run the production build:

```bash
npm run start
```

Lint the codebase:

```bash
npm run lint
```

## Project Structure

```
app/           — pages and layout (Next.js App Router)
components/    — React components
shared/        — shared types and utilities
public/        — static assets
```
