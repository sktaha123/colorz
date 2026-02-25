import { TOKEN_METADATA } from './tokenGenerator';

/**
 * Export utilities — generates code strings for various formats
 */

// CSS camelCase to kebab-case
function toKebab(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

// Token key to Tailwind key (camelCase, same)
function toTailwindKey(str) {
    return str;
}

// Token key to SCSS variable
function toScssVar(str) {
    return `$${toKebab(str)}`;
}

// Token key to CSS variable
function toCssVar(str) {
    return `--${toKebab(str)}`;
}

/**
 * Export as CSS :root variables
 */
export function exportCSS(tokens, paletteName = 'UI Theme') {
    const lines = [`/* ${paletteName} — CSS Custom Properties */`, `:root {`];
    for (const [key, value] of Object.entries(tokens)) {
        lines.push(`  ${toCssVar(key)}: ${value};`);
    }
    lines.push('}');
    return lines.join('\n');
}

/**
 * Export as Tailwind config (theme.extend.colors)
 */
export function exportTailwind(tokens, paletteName = 'UI Theme') {
    const colorEntries = Object.entries(tokens)
        .map(([key, value]) => `      ${toTailwindKey(key)}: '${value}',`)
        .join('\n');

    return `// ${paletteName} — Tailwind CSS Config
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
${colorEntries}
      },
    },
  },
};`;
}

/**
 * Export as JSON theme file
 */
export function exportJSON(tokens, paletteName = 'UI Theme') {
    const obj = { name: paletteName, tokens: {} };
    for (const [key, value] of Object.entries(tokens)) {
        const meta = TOKEN_METADATA[key];
        obj.tokens[key] = {
            value,
            cssVar: toCssVar(key),
            category: meta?.category || 'Other',
            description: meta?.description || '',
        };
    }
    return JSON.stringify(obj, null, 2);
}

/**
 * Export as SCSS variables
 */
export function exportSCSS(tokens, paletteName = 'UI Theme') {
    const lines = [`// ${paletteName} — SCSS Variables`, ``];

    // Group by category
    const byCategory = {};
    for (const [key, value] of Object.entries(tokens)) {
        const cat = TOKEN_METADATA[key]?.category || 'Other';
        if (!byCategory[cat]) byCategory[cat] = [];
        byCategory[cat].push([key, value]);
    }

    for (const [cat, entries] of Object.entries(byCategory)) {
        lines.push(`// ${cat}`);
        for (const [key, value] of entries) {
            lines.push(`${toScssVar(key)}: ${value};`);
        }
        lines.push('');
    }
    return lines.join('\n');
}

/**
 * Export as Design Tokens (W3C Draft format)
 */
export function exportDesignTokens(tokens, paletteName = 'UI Theme') {
    const byCategory = {};
    for (const [key, value] of Object.entries(tokens)) {
        const meta = TOKEN_METADATA[key];
        const cat = meta?.category || 'Other';
        if (!byCategory[cat]) byCategory[cat] = {};
        byCategory[cat][key] = {
            $value: value,
            $type: 'color',
            $description: meta?.description || '',
        };
    }

    return JSON.stringify({
        [paletteName]: byCategory,
    }, null, 2);
}

/**
 * Export as a flat style object (for use in JS/TS)
 */
export function exportStyleObject(tokens, paletteName = 'UI Theme') {
    const entries = Object.entries(tokens)
        .map(([key, value]) => `  ${key}: '${value}',`)
        .join('\n');

    return `// ${paletteName} — Style Object
export const theme = {
${entries}
};`;
}

export const EXPORT_FORMATS = [
    { id: 'css', label: 'CSS Variables', description: ':root { --var: value; }', fn: exportCSS },
    { id: 'tailwind', label: 'Tailwind Config', description: 'theme.extend.colors', fn: exportTailwind },
    { id: 'json', label: 'JSON Theme', description: 'Structured token file', fn: exportJSON },
    { id: 'scss', label: 'SCSS Variables', description: '$var: value;', fn: exportSCSS },
    { id: 'design-tokens', label: 'Design Tokens', description: 'W3C draft format', fn: exportDesignTokens },
    { id: 'style-object', label: 'JS Style Object', description: 'export const theme = {}', fn: exportStyleObject },
];
