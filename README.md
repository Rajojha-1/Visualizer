# AI Pseudo-Compiler & Code Visualizer

Monorepo with `frontend` (React + Tailwind + D3 + Monaco), `backend` (Express + OpenAI), and `shared` (TypeScript types).

## Structure
- frontend: Vite React app with Monaco editor and basic D3 visualization
- backend: Express API `/api/analyze` that calls OpenAI (or mock if no key)
- shared: TypeScript schemas used by backend/frontend

## Quick start

1. Install deps and build shared
```bash
npm install
```

2. Configure backend env (optional for real AI)
```bash
cp backend/.env.example backend/.env
# Edit backend/.env and set OPENAI_API_KEY
```

3. Development
```bash
# Terminal 1
npm run dev:backend
# Terminal 2
npm run dev:frontend
```
Or run both:
```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001/health

## API
POST `/api/analyze`
```json
{
  "language": "javascript",
  "code": "const x = 2+5; console.log(x);",
  "sessionId": "abc",
  "previousSummary": "...optional summary..."
}
```
Response (shape from `shared`):
```json
{
  "version": "1.0",
  "steps": [],
  "finalState": {
    "variables": {},
    "stack": [],
    "heap": [],
    "stdout": [],
    "errors": []
  }
}
```

## Notes
- If `OPENAI_API_KEY` is not set, backend returns a deterministic mock response, so the UI still works.
- The frontend currently visualizes only stdout using D3; extend it to animate variables/stack/heap.
- Monaco editor is configured for JavaScript by default; you can adapt language sending.
