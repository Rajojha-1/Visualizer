export type VariableValue = string | number | boolean | null | object | Array<unknown>;

export interface VariableState {
	name: string;
	value: VariableValue;
	scope: string; // e.g., global, function:foo
}

export interface StackFrame {
	id: string; // unique id for the frame instance
	functionName: string;
	locals: Record<string, VariableValue>;
	returnAddress?: string;
}

export interface HeapObject {
	id: string;
	type: string; // e.g., Array, Object, Function
	value: unknown;
}

export interface StepEvent {
	line?: number;
	code?: string;
	variables?: Record<string, VariableValue>;
	stack?: StackFrame[];
	heap?: HeapObject[];
	stdout?: string[];
	errors?: string[];
	calls?: Array<{ functionName: string; args: Array<unknown> }>;
	controlFlow?: {
		branch?: string; // e.g., if-true, if-false, loop-continue
		loop?: { type: 'for' | 'while' | 'do-while'; iteration: number } | null;
	};
}

export interface AiResponse {
	version: '1.0';
	steps: StepEvent[];
	finalState?: {
		variables: Record<string, VariableValue>;
		stack: StackFrame[];
		heap: HeapObject[];
		stdout: string[];
		errors: string[];
	};
}

export interface AnalyzeRequestBody {
	language: 'javascript' | 'python' | 'typescript' | 'c' | 'java' | 'pseudo';
	code: string;
	sessionId: string;
	previousSummary?: string; // optional compressed state summary
}

export const EXAMPLE_RESPONSE: AiResponse = {
	version: '1.0',
	steps: []
};
