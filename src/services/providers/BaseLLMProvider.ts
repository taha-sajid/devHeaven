
// src/services/providers/BaseLLMProvider.ts
export interface LLMProviderConfig {
  name: string;
  apiKey: string;
  baseURL?: string;
  defaultModel: string;
  models: string[];
}

export interface LLMMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface LLMGenerateOptions {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    stream?: boolean;
}

export interface LLMResponse {
    content: string;
    model: string;
    usage?: {
        inputTokens: number;
        outputTokens: number;
    };
}

export abstract class BaseLLMProvider {
    protected apiKey: string;
    protected baseURL: string;
    protected defaultModel: string;

    constructor(config: LLMProviderConfig) {
        this.apiKey = config.apiKey;
        this.baseURL = config.baseURL || '';
        this.defaultModel = config.defaultModel;
    }

    abstract generate(
        messages: LLMMessage[],
        options?: LLMGenerateOptions
    ): Promise<LLMResponse>;

    abstract generateStream(
        messages: LLMMessage[],
        options?: LLMGenerateOptions
    ): AsyncGenerator<string, void, unknown>;

    protected getModel(requestedModel?: string): string {
        return requestedModel || this.defaultModel;
    }
}
