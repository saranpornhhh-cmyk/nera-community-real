# NÉRA — Community Connect

Premium editorial-style community development demo, built with React, Vite and a lightweight Three.js village scene.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## GitHub Pages

This project is configured for a repository named `nera-community`:

- Vite base path: `/nera-community/`
- GitHub Actions workflow: `.github/workflows/deploy.yml`

1. Create a **Public** repository named `nera-community`.
2. Upload the contents of this folder to the repository root (not the enclosing ZIP).
3. Commit to the `main` branch.
4. In **Settings → Pages**, set **Build and deployment → Source** to **GitHub Actions**.
5. Open the **Actions** tab and wait for the deployment workflow to finish.
6. Your site will be available at `https://YOUR-USERNAME.github.io/nera-community/`.

## Demo data

All people, locations, prices, project budgets and statistics are fictional demonstration content. Replace the data in `src/main.jsx` before using this site for a real community.

## Notes

- The 3D scene is intentionally lightweight and uses procedural Three.js geometry.
- Google Fonts and the Unsplash hero image require an internet connection.
- No API keys or private credentials are required.
