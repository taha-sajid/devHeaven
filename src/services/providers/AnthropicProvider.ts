
// src/services/providers/AnthropicProvider.ts
import Anthropic from '@anthropic-ai/sdk';
import { BaseLLMProvider, LLMMessage, LLMGenerateOptions, LLMResponse } from './BaseLLMProvider';

export class AnthropicProvider extends BaseLLMProvider {
    private client: Anthropic;

    constructor(config: any) {
        super(config);
        this.client = new Anthropic({ apiKey: this.apiKey });
    }

    async generate(
        messages: LLMMessage[],
        options: LLMGenerateOptions = {}
    ): Promise<LLMResponse> {
        const model = this.getModel(options.model);

        // Separate system message
        const systemMessage = messages.find(m => m.role === 'system');
        const userMessages = messages.filter(m => m.role !== 'system');

        const response = await this.client.messages.create({
            model,
            max_tokens: options.maxTokens || 4096,
            system: systemMessage?.content,
            messages: userMessages as any,
        });

        const content = response.content[0];
        if (content.type !== 'text') {
            throw new Error('Unexpected response type from Anthropic');
        }

        return {
            content: content.text,
            model: response.model,
            usage: {
                inputTokens: response.usage.input_tokens,
                outputTokens: response.usage.output_tokens,
            },
        };
    }

    async *generateStream(
        messages: LLMMessage[],
        options: LLMGenerateOptions = {}
    ): AsyncGenerator<string, void, unknown> {
        const model = this.getModel(options.model);

        const systemMessage = messages.find(m => m.role === 'system');
        const userMessages = messages.filter(m => m.role !== 'system');

        const stream = await this.client.messages.stream({
            model,
            max_tokens: options.maxTokens || 4096,
            system: systemMessage?.content,
            messages: userMessages as any,
        });

        for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
                yield chunk.delta.text;
            }
        }
    }
}