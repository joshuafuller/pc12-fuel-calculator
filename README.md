# PC-12 Fuel Calculator

[![Deploy to GitHub Pages](https://github.com/joshuafuller/pc12-fuel-calculator/actions/workflows/deploy.yml/badge.svg)](https://github.com/joshuafuller/pc12-fuel-calculator/actions/workflows/deploy.yml)

**🔗 Live App: [https://joshuafuller.github.io/pc12-fuel-calculator/](https://joshuafuller.github.io/pc12-fuel-calculator/)**

Quickly determine how much fuel to add or remove for your PC-12. Adjust for ambient temperature, switch between units, use presets, and more—all in a sleek, modern interface.

## Features

- **Real-Time Calculations:** Instantly see how many pounds of fuel to add or remove based on your current and desired loads.
- **Density & Temperature Adjustments:** Automatically adjusts density with temperature. Just input the current temperature and let the tool handle the rest.
- **Imperial/Metric Toggle:** Effortlessly switch between lbs/gal and liters.
- **Custom Presets:** Save a typical load scenario so you can set your desired fuel with a single click.
- **Dark/Light Mode:** Toggle between themes to match your environment.
- **PWA-Ready:** Install it on your device and use it offline, anytime.

## Tech Stack

- **Frontend:** React + TypeScript
- **Styling:** Tailwind CSS
- **Icons:** [Lucide Icons](https://lucide.dev/)
- **Build Tool:** Vite
- **PWA:** [Vite Plugin PWA](https://vite-pwa-org.netlify.app/)

## Getting Started

### Requirements

- Node.js 20.19+ (or 22.12+)
- [Corepack](https://nodejs.org/api/corepack.html) enabled (bundled with Node) to use the pinned Yarn version

### Installation

```bash
# Clone the repo
git clone https://github.com/joshuafuller/pc12-fuel-calculator.git
cd pc12-fuel-calculator

# Enable Corepack for Yarn
corepack enable

# Install dependencies
yarn install --frozen-lockfile
```

### Development

```bash
yarn dev
```

Access the app at [http://localhost:5173/pc12-fuel-calculator/](http://localhost:5173/pc12-fuel-calculator/). Changes appear instantly as you code.

### Build & Preview

```bash
yarn build
yarn preview
```

Pre-check your production build locally before deploying.

## Project Structure

- `index.html`: Entry point for the app.
- `src/App.tsx`: Page layout; wires hooks to components.
- `src/components/`
  - `fuel/`: Calculator pieces (meter, inputs, receipt).
  - `ui/`: Generic UI (validated input, toggles, settings dialog).
  - `layout/`: Header.
  - `effects/`: Canvas particle effect.
- `src/context/`: Theme (dark/light) context, persisted to local storage.
- `src/hooks/`: `useFuelState` (calculator state, unit/temperature/density rules) and `useSettings`.
- `src/utils/`: Pure functions for unit conversion, temperature/density, meter scale, and storage.
- `tailwind.config.js`: Tailwind configuration, including the `xs` and `land` (landscape) breakpoints.
- `vite.config.ts`: Vite and PWA setup.

## Scripts

```bash
yarn dev        # dev server
yarn build      # type-check (tsc -b) + production build
yarn typecheck  # type-check only
yarn lint       # ESLint
yarn test       # Vitest (watch mode; add --run for a single pass)
```

## Deployment to GitHub Pages

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys the app to GitHub Pages.

**The app is currently deployed at:** [https://joshuafuller.github.io/pc12-fuel-calculator/](https://joshuafuller.github.io/pc12-fuel-calculator/)

### Setting up GitHub Pages for your fork:

1. Enable GitHub Pages in your repository settings, selecting **GitHub Actions** as the source.
2. Ensure the `VITE_BASE_PATH` matches your Pages site (defaults to `/pc12-fuel-calculator/`). You can override it in the Actions workflow `env` block if you use a custom path or a user/organization site.
3. Push to the `main` branch (or trigger the workflow manually). The workflow will build the Vite site, upload the `dist` artifact, and publish it to Pages.

## Contributing

1. Fork this repository.
2. Create a feature branch (`git checkout -b feature/my-idea`).
3. Commit your changes (`git commit -m "Add new feature"`).
4. Push to your branch (`git push origin feature/my-idea`).
5. Open a Pull Request for review.

## License

[MIT](LICENSE)
