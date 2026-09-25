# NAPCO official web page 

## Folder structure

```txt
napco/
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
