export interface LLMProviderConfig {
    name: string;
    apiKey: string;
    baseURL?: string;
    defaultModel: string;
    models: string[];
}

export interface LLMConfig {
    defaultProvider: string;
    providers: {
        [key: string]: LLMProviderConfig;
    };
}

// Configuration for all LLM providers
export const llmConfig: LLMConfig = {
    defaultProvider: 'openrouter',
    providers: {
        openrouter: {
            name: 'OpenRouter',
            apiKey: process.env.OPENROUTER_API_KEY || '',
            baseURL: 'https://openrouter.ai/api/v1',
            defaultModel: 'anthropic/claude-3.5-sonnet',
            models: [
                'anthropic/claude-3.5-sonnet',
                'anthropic/claude-3-haiku',
                'openai/gpt-4-turbo',
                'openai/gpt-3.5-turbo',
                'meta-llama/llama-3.1-70b-instruct',
            ],
        },
        anthropic: {
            name: 'Anthropic',
            apiKey: process.env.ANTHROPIC_API_KEY || '',
            baseURL: 'https://api.anthropic.com/v1',
            defaultModel: 'claude-sonnet-4-20250514',
            models: [
                'claude-sonnet-4-20250514',
                'claude-haiku-4-5-20251001',
                'claude-opus-4-20250514',
            ],
        },
        openai: {
            name: 'OpenAI',
            apiKey: process.env.OPENAI_API_KEY || '',
            baseURL: 'https://api.openai.com/v1',
            defaultModel: 'gpt-4-turbo-preview',
            models: [
                'gpt-4-turbo-preview',
                'gpt-4',
                'gpt-3.5-turbo',
            ],
        },
    },
};