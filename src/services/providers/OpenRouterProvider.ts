import { BaseLLMProvider, LLMMessage, LLMGenerateOptions, LLMResponse } from './BaseLLMProvider';

// Add interface for API responses
interface OpenRouterErrorResponse {
    error?: {
        message?: string;
    };
}

interface OpenRouterResponse {
    choices: Array<{
        message: {
            content: string;
        };
        delta?: {
            content?: string;
        };
    }>;
    model: string;
    usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
    };
}

export class OpenRouterProvider extends BaseLLMProvider {
    async generate(
        messages: LLMMessage[],
        options: LLMGenerateOptions = {}
    ): Promise<LLMResponse> {
        const model = this.getModel(options.model);

        const response = await fetch(`${this.baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
                'X-Title': process.env.APP_NAME || 'AI Code Generator',
            },
            body: JSON.stringify({
                model,
                messages,
                max_tokens: options.maxTokens || 4096,
                temperature: options.temperature || 0.7,
                stream: false,
            }),
        });

        if (!response.ok) {
            const error = await response.json() as OpenRouterErrorResponse;
            throw new Error(`OpenRouter API error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json() as OpenRouterResponse;

        return {
            content: data.choices[0].message.content,
            model: data.model,
            usage: {
                inputTokens: data.usage?.prompt_tokens || 0,
                outputTokens: data.usage?.completion_tokens || 0,
            },
        };
    }

    async *generateStream(
        messages: LLMMessage[],
        options: LLMGenerateOptions = {}
    ): AsyncGenerator<string, void, unknown> {
        const model = this.getModel(options.model);

        const response = await fetch(`${this.baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
                'X-Title': process.env.APP_NAME || 'AI Code Generator',
            },
            body: JSON.stringify({
                model,
                messages,
                max_tokens: options.maxTokens || 4096,
                temperature: options.temperature || 0.7,
                stream: true,
            }),
        });

        if (!response.ok) {
            const error = await response.json() as OpenRouterErrorResponse;
            throw new Error(`OpenRouter API error: ${error.error?.message || response.statusText}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
            throw new Error('No response body reader available');
        }

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n').filter(line => line.trim() !== '');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;

                        try {
                            const parsed = JSON.parse(data) as OpenRouterResponse;
                            const content = parsed.choices[0]?.delta?.content;
                            if (content) {
                                yield content;
                            }
                        } catch (e) {
                            // Skip invalid JSON
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }
    }
}