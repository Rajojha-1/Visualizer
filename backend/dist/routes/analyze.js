import { Router } from 'express';
import { z } from 'zod';
import { getAiResponse } from '../services/ai.js';
export const analyzeRouter = Router();
const AnalyzeSchema = z.object({
    language: z.enum(['javascript', 'python', 'typescript', 'c', 'java', 'pseudo']),
    code: z.string(),
    sessionId: z.string(),
    previousSummary: z.string().optional()
});
analyzeRouter.post('/', async (req, res) => {
    const parsed = AnalyzeSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
    }
    try {
        const data = await getAiResponse(parsed.data);
        res.json(data);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'AI processing failed' });
    }
});
//# sourceMappingURL=analyze.js.map