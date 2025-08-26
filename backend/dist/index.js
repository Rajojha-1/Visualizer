import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { json } from 'express';
import { analyzeRouter } from './routes/analyze.js';
const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);
app.use(cors({ origin: true }));
app.use(json({ limit: '1mb' }));
app.get('/health', (_req, res) => {
    res.json({ ok: true });
});
app.use('/api/analyze', analyzeRouter);
app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map