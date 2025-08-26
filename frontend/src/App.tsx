import React, { useCallback, useMemo, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import * as d3 from 'd3';

interface StepEvent {
	line?: number;
	code?: string;
	variables?: Record<string, unknown>;
	stack?: Array<any>;
	heap?: Array<any>;
	stdout?: string[];
	errors?: string[];
	calls?: Array<{ functionName: string; args: Array<unknown> }>;
	controlFlow?: {
		branch?: string;
		loop?: { type: 'for' | 'while' | 'do-while'; iteration: number } | null;
	};
}

interface AiResponse { version: '1.0'; steps: StepEvent[]; finalState?: any }

async function analyze(code: string): Promise<AiResponse> {
	const res = await fetch('/api/analyze', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ language: 'javascript', code, sessionId: 'local-dev' })
	});
	if (!res.ok) throw new Error('Analyze failed');
	return res.json();
}

export function App() {
	const [code, setCode] = useState<string>(`function add(a, b) {\n  return a + b;\n}\n\nconst x = add(2, 5);\nconsole.log(x);`);
	const [response, setResponse] = useState<AiResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const svgRef = useRef<SVGSVGElement | null>(null);

	const onChange = useCallback((value?: string) => {
		setCode(value ?? '');
	}, []);

	const onAnalyze = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const out = await analyze(code);
			setResponse(out);
		} catch (e: any) {
			setError(e?.message || 'Error');
		} finally {
			setLoading(false);
		}
	}, [code]);

	const stdoutLines = useMemo(() => response?.finalState?.stdout ?? [], [response]);

	React.useEffect(() => {
		const svg = d3.select(svgRef.current);
		svg.selectAll('*').remove();
		const g = svg.append('g').attr('transform', 'translate(16,24)');
		g.append('text').text('Stdout:').attr('font-size', 16).attr('fill', 'white');
		g.selectAll('t').data(stdoutLines as unknown[]).enter().append('text')
			.text((d: unknown) => String(d))
			.attr('y', (_: unknown, i: number) => 24 + i * 18)
			.attr('fill', 'lime');
	}, [stdoutLines]);

	return (
		<div className="h-full grid grid-cols-2">
			<div className="h-full flex flex-col">
				<div className="p-2 border-b border-slate-800 flex items-center gap-2">
					<button className="px-3 py-1 bg-indigo-600 rounded disabled:opacity-50" onClick={onAnalyze} disabled={loading}>
						{loading ? 'Analyzing…' : 'Analyze'}
					</button>
					<span className="text-slate-400 text-sm">AI Pseudo Compiler</span>
				</div>
				<div className="flex-1">
					<Editor
						height="100%"
						defaultLanguage="javascript"
						theme="vs-dark"
						value={code}
						onChange={onChange}
					/>
				</div>
				{error && <div className="p-2 text-red-400 text-sm">{error}</div>}
			</div>
			<div className="h-full flex flex-col">
				<div className="p-2 border-b border-slate-800">Visualization</div>
				<svg ref={svgRef} className="flex-1 w-full bg-slate-900"></svg>
				<div className="p-2 text-xs text-slate-400 overflow-auto h-40 border-t border-slate-800">
					<pre>{JSON.stringify(response, null, 2)}</pre>
				</div>
			</div>
		</div>
	);
}
