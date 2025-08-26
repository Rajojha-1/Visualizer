export type VariableValue = string | number | boolean | null | object | Array<unknown>;
export interface VariableState {
    name: string;
    value: VariableValue;
    scope: string;
}
export interface StackFrame {
    id: string;
    functionName: string;
    locals: Record<string, VariableValue>;
    returnAddress?: string;
}
export interface HeapObject {
    id: string;
    type: string;
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
    calls?: Array<{
        functionName: string;
        args: Array<unknown>;
    }>;
    controlFlow?: {
        branch?: string;
        loop?: {
            type: 'for' | 'while' | 'do-while';
            iteration: number;
        } | null;
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
    previousSummary?: string;
}
export declare const EXAMPLE_RESPONSE: AiResponse;
//# sourceMappingURL=index.d.ts.map