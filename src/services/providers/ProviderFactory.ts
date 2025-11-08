
// src/services/providers/ProviderFactory.ts
import { BaseLLMProvider } from './BaseLLMProvider';
import { OpenRouterProvider } from './OpenRouterProvider';
import { AnthropicProvider } from './AnthropicProvider';
import { OpenAIProvider } from './OpenAIProvider';
import { llmConfig, LLMProviderConfig } from '../../config/llm.config';

export class ProviderFactory {
    private static providers: Map<string, BaseLLMProvider> = new Map();

    static getProvider(providerName?: string): BaseLLMProvider {
        const name = providerName || llmConfig.defaultProvider;

        // Return cached provider if exists
        if (this.providers.has(name)) {
            return this.providers.get(name)!;
        }

        // Get provider config
        const config = llmConfig.providers[name];
        if (!config) {
            throw new Error(`Provider '${name}' not found in configuration`);
        }

        if (!config.apiKey) {
            throw new Error(`API key not configured for provider '${name}'`);
        }

        // Create new provider instance
        let provider: BaseLLMProvider;

        switch (name) {
            case 'openrouter':
                provider = new OpenRouterProvider(config);
                break;
            case 'anthropic':
                provider = new AnthropicProvider(config);
                break;
            case 'openai':
                provider = new OpenAIProvider(config);
                break;
            default:
                throw new Error(`Unsupported provider: ${name}`);
        }

        // Cache the provider
        this.providers.set(name, provider);
        return provider;
    }

    static getAvailableProviders(): string[] {
        return Object.keys(llmConfig.providers).filter(
            name => llmConfig.providers[name].apiKey
        );
    }

    static getProviderModels(providerName: string): string[] {
        const config = llmConfig.providers[providerName];
        return config ? config.models : [];
    }
}