# PA Halal Butcher & Grocer

A full-stack e-commerce storefront for a halal butcher and grocery shop, built with **TanStack Start**. Customers can browse meat and grocery products, manage a cart and wishlist, sign in, redeem loyalty points at checkout, and receive a receipt with a QR code. Admins can manage products, customers, and orders — including scanning receipt QR codes to update order status in-store.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Fonts & Color Scheme](#fonts--color-scheme)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Admin Access](#admin-access)
- [Route Map](#route-map)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [TanStack Start](https://tanstack.com/start) (React 19 + Vite 8 + file-based routing) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 4 with native CSS theme variables |
| UI Components | shadcn/ui primitives built on Radix UI |
| State Management | Zustand (persisted to localStorage) |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| QR Code | `qrcode.react` (receipts) + `html5-qrcode` (admin scanner) |
| Charts | Recharts |
| Date Utilities | date-fns |
| Carousel | Embla Carousel |
| Build Tool | Vite 8 with `@lovable.dev/vite-tanstack-config` |
| Package Manager | Bun |

### Key Libraries

- `@tanstack/react-start` — full-stack React framework with server functions
- `@tanstack/react-router` — type-safe file-based routing
- `@tanstack/react-query` — server-state/data fetching
- `tailwindcss` + `tw-animate-css` — utility-first styling and animations
- `zustand` — lightweight global state
- `lucide-react` — icon set
- `qrcode.react` / `html5-qrcode` — QR generation and scanning
- `recharts` — dashboard charts
- `sonner` — toast notifications
- `embla-carousel-react` — product carousels
- `react-hook-form` + `zod` — form handling and validation

---

## Project Structure

```text
.
├── src/
│   ├── assets/                 # Static images (product photos, etc.)
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components (button, card, dialog, etc.)
│   │   ├── AccentHeading.tsx   # Branded display heading
│   │   ├── Footer.tsx          # Site footer
│   │   ├── Navbar.tsx          # Top navigation
│   │   └── ProductCard.tsx     # Product grid card
│   ├── hooks/
│   │   └── use-mobile.tsx      # Mobile breakpoint hook
│   ├── lib/
│   │   ├── error-capture.ts    # Error capture utilities
│   │   ├── error-page.ts       # Error page helpers
│   │   ├── lovable-error-reporting.ts
│   │   ├── products.ts         # Product catalog data and types
│   │   ├── store.ts            # Zustand shop state (cart, user, orders, admin)
│   │   └── utils.ts            # Tailwind / clsx / cn helpers
│   ├── routes/                 # TanStack file-based routes
│   │   ├── __root.tsx          # Root layout, head metadata, providers
│   │   ├── index.tsx           # Home page
│   │   ├── shop-meat.tsx       # Meat shop catalog
│   │   ├── grocery.tsx         # Grocery shop catalog
│   │   ├── wishlist.tsx        # User wishlist
│   │   ├── signin.tsx          # Customer sign in
│   │   ├── signup.tsx          # Customer sign up
│   │   ├── checkout.tsx        # Checkout + points redemption
│   │   ├── success.tsx         # Order success + receipt QR code
│   │   ├── admin.tsx           # Admin auth gate (claymorphism login)
│   │   ├── admin.index.tsx     # Admin dashboard overview
│   │   ├── admin.orders.tsx    # Orders list + QR scanner + status updates
│   │   ├── admin.products.tsx  # Product management
│   │   └── admin.customers.tsx # Customer list
│   ├── router.tsx              # Router configuration
│   ├── routeTree.gen.ts        # Auto-generated route tree
│   ├── server.ts               # SSR server entry wrapper
│   ├── start.ts                # App start configuration
│   └── styles.css              # Global styles, theme tokens, claymorphism utilities
├── package.json
├── vite.config.ts
├── tsconfig.json
├── components.json             # shadcn/ui config
├── bun.lock
└── README.md
```

---

## Fonts & Color Scheme

### Fonts

The app loads **Mona Sans** from Google Fonts and uses it for both body and display text.

```css
--font-sans: "Mona Sans", "Helvetica Neue", Helvetica, sans-serif;
--font-display: "Mona Sans", "Helvetica Neue", Helvetica, sans-serif;
```

### Color Palette

Colors are defined as CSS custom properties in `src/styles.css` and mapped to Tailwind theme tokens.

| Token | Value | Usage |
|-------|-------|-------|
| `--meat` | `oklch(0.52 0.21 27)` | Primary brand red |
| `--meat-dark` | `oklch(0.43 0.20 27)` | Hover / dark primary |
| `--ink` | `oklch(0.13 0.02 270)` | Primary text |
| `--ash` | `oklch(0.70 0.03 250)` | Muted text |
| `--background` | `oklch(0.985 0.003 250)` | Page background (slate-50) |
| `--card` | `white` | Card surfaces |
| `--secondary` | `oklch(0.96 0.005 250)` | Secondary backgrounds |
| `--accent` | `oklch(0.95 0.02 27)` | Accent backgrounds |
| `--destructive` | `oklch(0.55 0.22 25)` | Error / destructive actions |
| `--border` | `oklch(0.91 0.01 250)` | Borders and dividers |
| `--ring` | `--meat` | Focus rings |

### Design Style

- **Primary aesthetic**: Clean, modern, meat-shop brand with warm reds and cool slate neutrals.
- **Claymorphism**: Used only on the admin authentication form (`/admin`). It provides soft, puffy, tactile surfaces with multi-layer shadows and rounded forms.
- **Patterns**: Subtle cattle/farm dot pattern (`bg-cattle-pattern`) and meat-grain gradients (`bg-meat-grain`) for texture.

---

## Installation

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine
- Node.js-compatible environment (Bun handles Node APIs)

### Steps

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd tanstack_start_ts
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Run the development server**

   ```bash
   bun dev
   ```

   The app will be available at `http://localhost:8080`.

4. **Build for production**

   ```bash
   bun run build
   ```

5. **Preview the production build**

   ```bash
   bun run preview
   ```

---

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `bun dev` | Start the Vite dev server |
| `build` | `bun run build` | Build for production |
| `build:dev` | `bun run build:dev` | Build in development mode |
| `preview` | `bun run preview` | Preview the production build |
| `lint` | `bun run lint` | Run ESLint |
| `format` | `bun run format` | Format code with Prettier |

---

## Admin Access

The admin panel is available at `/admin`. For local development, use the default credentials defined in `src/lib/store.ts`:

- **Email**: `admin@pahalal.com`
- **Password**: `admin123`

> ⚠️ **Security note**: These are hardcoded demo credentials. Replace them with a proper authentication system before deploying to production.

---

## Route Map

| URL | File | Purpose |
|-----|------|---------|
| `/` | `src/routes/index.tsx` | Home page |
| `/shop-meat` | `src/routes/shop-meat.tsx` | Meat catalog |
| `/grocery` | `src/routes/grocery.tsx` | Grocery catalog |
| `/wishlist` | `src/routes/wishlist.tsx` | Saved items |
| `/signin` | `src/routes/signin.tsx` | Customer sign in |
| `/signup` | `src/routes/signup.tsx` | Customer sign up |
| `/checkout` | `src/routes/checkout.tsx` | Checkout + points |
| `/success` | `src/routes/success.tsx` | Receipt with QR code |
| `/admin` | `src/routes/admin.tsx` | Admin login gate |
| `/admin/` | `src/routes/admin.index.tsx` | Admin dashboard |
| `/admin/orders` | `src/routes/admin.orders.tsx` | Orders + QR scanner |
| `/admin/products` | `src/routes/admin.products.tsx` | Product management |
| `/admin/customers` | `src/routes/admin.customers.tsx` | Customer list |

---

Built with Lovable + TanStack Start.
