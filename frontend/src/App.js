import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useCallback, useMemo, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import * as d3 from 'd3';
async function analyze(code) {
    const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: 'javascript', code, sessionId: 'local-dev' })
    });
    if (!res.ok)
        throw new Error('Analyze failed');
    return res.json();
}
export function App() {
    const [code, setCode] = useState(`function add(a, b) {\n  return a + b;\n}\n\nconst x = add(2, 5);\nconsole.log(x);`);
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const svgRef = useRef(null);
    const onChange = useCallback((value) => {
        setCode(value ?? '');
    }, []);
    const onAnalyze = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const out = await analyze(code);
            setResponse(out);
        }
        catch (e) {
            setError(e?.message || 'Error');
        }
        finally {
            setLoading(false);
        }
    }, [code]);
    const stdoutLines = useMemo(() => response?.finalState?.stdout ?? [], [response]);
    React.useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        const g = svg.append('g').attr('transform', 'translate(16,24)');
        g.append('text').text('Stdout:').attr('font-size', 16).attr('fill', 'white');
        g.selectAll('t').data(stdoutLines).enter().append('text')
            .text((d) => String(d))
            .attr('y', (_, i) => 24 + i * 18)
            .attr('fill', 'lime');
    }, [stdoutLines]);
    return (_jsxs("div", { className: "h-full grid grid-cols-2", children: [_jsxs("div", { className: "h-full flex flex-col", children: [_jsxs("div", { className: "p-2 border-b border-slate-800 flex items-center gap-2", children: [_jsx("button", { className: "px-3 py-1 bg-indigo-600 rounded disabled:opacity-50", onClick: onAnalyze, disabled: loading, children: loading ? 'Analyzing…' : 'Analyze' }), _jsx("span", { className: "text-slate-400 text-sm", children: "AI Pseudo Compiler" })] }), _jsx("div", { className: "flex-1", children: _jsx(Editor, { height: "100%", defaultLanguage: "javascript", theme: "vs-dark", value: code, onChange: onChange }) }), error && _jsx("div", { className: "p-2 text-red-400 text-sm", children: error })] }), _jsxs("div", { className: "h-full flex flex-col", children: [_jsx("div", { className: "p-2 border-b border-slate-800", children: "Visualization" }), _jsx("svg", { ref: svgRef, className: "flex-1 w-full bg-slate-900" }), _jsx("div", { className: "p-2 text-xs text-slate-400 overflow-auto h-40 border-t border-slate-800", children: _jsx("pre", { children: JSON.stringify(response, null, 2) }) })] })] }));
}
//# sourceMappingURL=App.js.map