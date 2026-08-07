# NAPCO official web page 

## Folder structure

```txt
presvila-clone/
├─ frontend/
│  ├─ public/
│  │  └─ assets/
│  │     ├─ images/
│  │     ├─ videos/
│  │     └─ models/
│  └─ src/
│     ├─ components/
│     │  ├─ common/
│     │  └─ home/
│     ├─ pages/
│     ├─ styles/
│     │  ├─ common/
│     │  └─ pages/
│     ├─ data/
│     ├─ App.tsx
│     └─ main.tsx
├─ backend/
│  └─ src/
│     ├─ routes/
│     ├─ controllers/
│     ├─ middleware/
│     ├─ app.ts
│     └─ server.ts
└─ README.md
```

## Run backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```txt
http://localhost:5000
```

Health check:

```txt
http://localhost:5000/api/health
```

## Run frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

## Main frontend rules

- `src/pages/` contains only main page files such as `Home.tsx`.
- `src/components/home/` contains Home page section components.
- `src/components/common/` contains reusable common components such as navigation, footer, custom cursor, logo, drawer, and floating buttons.
- `src/styles/` contains all CSS.
- `src/styles/pages/home.css` contains the Home page styling.
- `src/styles/global.css` contains global resets, fonts, variables, body styles, and scrollbar styles.

## Included libraries

- React
- Vite
- TypeScript
- GSAP `3.11.4`
- Framer Motion
- Lucide React
- Swiper
- Three.js
- Font Awesome
- Express backend without database
