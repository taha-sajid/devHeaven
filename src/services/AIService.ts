
// src/services/AIService.ts (Updated)
import { GenerateCodeRequest, GenerateCodeResponse } from '../types';
import { parseGeneratedCode } from '../utils/helpers';
import { ProviderFactory } from './providers/ProviderFactory';
import { LLMMessage } from './providers/BaseLLMProvider';

const SYSTEM_PROMPT = `You are an expert web developer. Generate clean, modern, and functional code based on user requirements.

Rules:
1. Always provide complete, working code
2. Use modern best practices
3. Include proper HTML structure with DOCTYPE
4. Use semantic HTML5 elements
5. Include responsive CSS
6. Write clean, commented JavaScript
7. Format code blocks with language tags and filenames like: \`\`\`html // index.html
8. For web apps, always start with HTML structure
9. Make the UI visually appealing with good UX

Return code in markdown code blocks with filenames.`;

export const generateCode = async (request: GenerateCodeRequest): Promise<GenerateCodeResponse> => {
  const startTime = Date.now();

  const messages: LLMMessage[] = [
    { role: 'system', content: request.prompt },
    {
      role: 'user',
      content: request.context
        ? `${request.prompt}\n\nContext:\n${request.context}`
        : request.prompt,
    },
  ];

  try {
    const provider = ProviderFactory.getProvider(request.provider);
    const response = await provider.generate(messages, {
      model: request.model,
      maxTokens: 500,
    });

    const generationTime = Date.now() - startTime;
    const code = response.content;
    const parsedFiles = parseGeneratedCode(code); 

    // Map filename to name to match the expected type
    const files = parsedFiles.map(f => ({
      name: f.filename,
      content: f.content,
      language: f.language,
    }));

    // Extract explanation if present
    const explanationMatch = code.match(/^(.*?)```/s);
    const explanation = explanationMatch ? explanationMatch[1].trim() : undefined;

    return {
      code,
      files,
      explanation,
      metadata: {
        model: response.model,
        provider: request.provider,
        usage: response.usage,
        generationTime,
      },
    };
  } catch (error: any) {
    throw new Error(`AI generation failed: ${error.message}`);
  }
};

export async function* generateCodeStream(
  request: GenerateCodeRequest
): AsyncGenerator<string, void, unknown> {
  const messages: LLMMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'user',
      content: request.context
        ? `${request.prompt}\n\nContext:\n${request.context}`
        : request.prompt,
    },
  ];

  try {
    const provider = ProviderFactory.getProvider(request.provider);

    for await (const chunk of provider.generateStream(messages, {
      model: request.model,
      maxTokens: 500,
    })) {
      yield chunk;
    }
  } catch (error: any) {
    throw new Error(`AI generation stream failed: ${error.message}`);
  }
}

// Helper to get available providers and models
export const getAvailableConfig = () => { 
  return {
    providers: ProviderFactory.getAvailableProviders(),
    modelsByProvider: Object.fromEntries(
      ProviderFactory.getAvailableProviders().map(provider => [
        provider,
        ProviderFactory.getProviderModels(provider),
      ])
    ),
  };
};