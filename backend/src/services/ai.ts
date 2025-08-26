import OpenAI from 'openai';
import type { AiResponse, AnalyzeRequestBody } from '../../../shared/dist/index.js';

const hasKey = Boolean(process.env.OPENAI_API_KEY);
const client = hasKey ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : ({} as OpenAI);

export async function getAiResponse(body: AnalyzeRequestBody): Promise<AiResponse> {
	if (!hasKey) {
		return {
			version: '1.0',
			steps: [
				{
					code: body.code.split('\n')[0] || '',
					stdout: ['Mock mode: set OPENAI_API_KEY to enable real AI'],
				}
			],
			finalState: {
				variables: { x: 7 },
				stack: [],
				heap: [],
				stdout: ['7'],
				errors: []
			}
		};
	}

	const system = [
		"You are an AI acting as a compiler/VM for educational visualization.",
		"ALWAYS return strictly valid JSON matching the AiResponse schema.",
		"Infer likely behavior even for incomplete or buggy code.",
	].join(' ');

	const jsonSchemaHint = `Schema:\n{\n  "version": "1.0",\n  "steps": [ { ... } ],\n  "finalState": { ... }\n}`;

	const prompt = [
		`Language: ${body.language}`,
		body.previousSummary ? `Previous summary: ${body.previousSummary}` : undefined,
		"Code:",
		"" + body.code,
		"Respond ONLY with JSON. If uncertain, make the best educational guess.",
		jsonSchemaHint,
	].filter(Boolean).join('\n\n');

	const completion = await client.chat.completions.create({
		model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
		response_format: { type: 'json_object' },
		messages: [
			{ role: 'system', content: system },
			{ role: 'user', content: prompt }
		],
		temperature: 0.2,
		max_tokens: 800
	});

	const content = completion.choices[0]?.message?.content || '{}';
	try {
		const parsed = JSON.parse(content) as AiResponse;
		if (!parsed.version) parsed.version = '1.0' as const;
		if (!parsed.steps) parsed.steps = [];
		return parsed;
	} catch (err) {
		return { version: '1.0', steps: [], finalState: { variables: {}, stack: [], heap: [], stdout: [], errors: ['Invalid JSON from model'] } } as AiResponse;
	}
}