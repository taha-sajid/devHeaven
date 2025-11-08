
// src/utils/helpers.ts
import { v4 as uuidv4 } from 'uuid';

export const generateShareUrl = (): string => {
    return uuidv4().split('-')[0] + uuidv4().split('-')[0];
};

export const parseGeneratedCode = (aiResponse: string): Array<{ filename: string; content: string; language: string }> => {
    const files: Array<{ filename: string; content: string; language: string }> = [];

    // Match code blocks with optional filename
    const codeBlockRegex = /```(?:(\w+))?\s*(?:\/\/\s*(.+?))?\n([\s\S]*?)```/g;
    let match;

    while ((match = codeBlockRegex.exec(aiResponse)) !== null) {
        const language = match[1] || 'javascript';
        const filename = match[2] || `file.${getExtension(language)}`;
        const content = match[3].trim();

        files.push({
            filename: filename.trim(),
            content,
            language,
        });
    }

    // If no code blocks found, treat entire response as code
    if (files.length === 0) {
        files.push({
            filename: 'index.html',
            content: aiResponse.trim(),
            language: 'html',
        });
    }

    return files;
};

const getExtension = (language: string): string => {
    const extensionMap: Record<string, string> = {
        javascript: 'js',
        typescript: 'ts',
        html: 'html',
        css: 'css',
        python: 'py',
        java: 'java',
        cpp: 'cpp',
        csharp: 'cs',
        ruby: 'rb',
        go: 'go',
        rust: 'rs',
        php: 'php',
    };

    return extensionMap[language.toLowerCase()] || 'txt';
};

export const sanitizeFilename = (filename: string): string => {
    return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
};