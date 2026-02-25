import { useState, useCallback, useMemo, useRef } from 'react';
import { generateTokens, TOKEN_METADATA, TOKEN_CATEGORIES } from '../../utils/tokenGenerator';
import { EXPORT_FORMATS } from '../../utils/exportUtils';

const RefreshIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
);

const CopyIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect width="14" height="14" x="8" y="8" rx="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
);

const CheckIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

// Quick preset base colors
const PRESET_COLORS = [
    { color: '#6366F1', name: 'Indigo' },
    { color: '#8B5CF6', name: 'Violet' },
    { color: '#EC4899', name: 'Pink' },
    { color: '#F43F5E', name: 'Rose' },
    { color: '#EF4444', name: 'Red' },
    { color: '#F59E0B', name: 'Amber' },
    { color: '#10B981', name: 'Emerald' },
    { color: '#0EA5E9', name: 'Sky' },
    { color: '#3B82F6', name: 'Blue' },
    { color: '#14B8A6', name: 'Teal' },
    { color: '#84CC16', name: 'Lime' },
    { color: '#F97316', name: 'Orange' },
];

function TokenTable({ tokens, copiedKey, onCopy }) {
    const groupedTokens = useMemo(() => {
        const groups = {};
        TOKEN_CATEGORIES.forEach(cat => { groups[cat] = []; });
        Object.entries(tokens).forEach(([key, value]) => {
            const cat = TOKEN_METADATA[key]?.category || 'Other';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push({ key, value });
        });
        return groups;
    }, [tokens]);

    const isColorValue = (v) => v && (v.startsWith('#') || v.startsWith('rgb'));

    return (
        <div>
            {TOKEN_CATEGORIES.map(cat => {
                const entries = groupedTokens[cat] || [];
                if (!entries.length) return null;
                return (
                    <div key={cat} className="token-table-section">
                        <div className="token-section-title">{cat}</div>
                        <table className="token-table" aria-label={`${cat} tokens`}>
                            <thead>
                                <tr>
                                    <th style={{ width: '32%' }}>Token</th>
                                    <th style={{ width: '22%' }}>Value</th>
                                    <th style={{ width: '46%' }}>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entries.map(({ key, value }) => {
                                    const meta = TOKEN_METADATA[key];
                                    const isColor = isColorValue(value);
                                    return (
                                        <tr key={key}>
                                            <td>
                                                <div className="token-swatch-cell">
                                                    <div
                                                        className="token-swatch"
                                                        style={{
                                                            background: isColor ? value : 'transparent',
                                                            border: isColor ? '1px solid #1F1F26' : '1px dashed #2A2A34',
                                                        }}
                                                        aria-hidden="true"
                                                    />
                                                    <span className="token-name">{key}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-ghost btn-sm font-mono text-xs"
                                                    style={{ padding: '0 6px', height: 22 }}
                                                    onClick={() => onCopy(key, value)}
                                                    aria-label={`Copy value ${value}`}
                                                    title={value}
                                                >
                                                    {copiedKey === key ? '✓' : value.length > 18 ? value.slice(0, 17) + '…' : value}
                                                </button>
                                            </td>
                                            <td>
                                                <span className="token-description">{meta?.description}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                );
            })}
        </div>
    );
}

function ExportPanel({ tokens, name }) {
    const [activeFormat, setActiveFormat] = useState('css');
    const [copied, setCopied] = useState(false);

    const codeContent = useMemo(() => {
        const fmt = EXPORT_FORMATS.find(f => f.id === activeFormat);
        return fmt?.fn(tokens, name) || '';
    }, [activeFormat, tokens, name]);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(codeContent).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [codeContent]);

    const langMap = { css: 'CSS', tailwind: 'JS', json: 'JSON', scss: 'SCSS', 'design-tokens': 'JSON', 'style-object': 'JS' };

    return (
        <div className="export-panel">
            <div className="export-panel-header">
                <div className="export-panel-title">Export Color Tokens</div>
            </div>
            <div className="export-format-tabs" role="tablist">
                {EXPORT_FORMATS.map(fmt => (
                    <button
                        key={fmt.id}
                        id={`gen-export-btn-${fmt.id}`}
                        className={`export-format-btn ${activeFormat === fmt.id ? 'active' : ''}`}
                        onClick={() => setActiveFormat(fmt.id)}
                        role="tab"
                        aria-selected={activeFormat === fmt.id}
                        title={fmt.description}
                    >
                        {fmt.label}
                    </button>
                ))}
            </div>
            <div className="export-code-block">
                <div className="code-block-header">
                    <span className="code-block-lang">{langMap[activeFormat] || 'TEXT'}</span>
                    <button
                        id="gen-export-copy-btn"
                        className={`btn btn-sm ${copied ? 'btn-copied' : 'btn-secondary'}`}
                        onClick={handleCopy}
                    >
                        {copied ? <CheckIcon /> : <CopyIcon />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                </div>
                <pre className="code-block-content" aria-label="Export code">
                    <code>{codeContent}</code>
                </pre>
            </div>
        </div>
    );
}

export default function UIGenerator() {
    const [baseColor, setBaseColor] = useState('#6366F1');
    const [mode, setMode] = useState('dark');
    const [activeView, setActiveView] = useState('tokens');
    const [copiedKey, setCopiedKey] = useState(null);
    const colorInputRef = useRef(null);

    const tokens = useMemo(() => generateTokens(baseColor, mode), [baseColor, mode]);

    const handleCopy = useCallback((key, value) => {
        navigator.clipboard.writeText(value).then(() => {
            setCopiedKey(key);
            setTimeout(() => setCopiedKey(null), 1500);
        });
    }, []);

    const themeName = useMemo(() => {
        const preset = PRESET_COLORS.find(p => p.color.toLowerCase() === baseColor.toLowerCase());
        return `Custom ${preset?.name || 'Color'} ${mode === 'dark' ? 'Dark' : 'Light'}`;
    }, [baseColor, mode]);

    // Preview swatches derived from tokens
    const previewColors = [
        tokens.checkboxFill,
        tokens.gradientStop1,
        tokens.gradientStop2,
        tokens.progressBarFill,
    ];

    return (
        <div>
            {/* Generator Panel */}
            <div className="generator-panel">
                <div className="generator-header">
                    <div>
                    
                        <div className="text-sm text-text-tertiary mt-0.5">
                            Generate a complete set of {Object.keys(tokens).length} design tokens from a brand color
                        </div>
                    </div>
                    <div className="generator-controls">
                        {/* Color presets */}
                        <div className="flex gap-1 flex-wrap">
                            {PRESET_COLORS.map(p => (
                                <button
                                    key={p.color}
                                    className="btn btn-icon-sm"
                                    style={{
                                        background: p.color,
                                        border: baseColor.toLowerCase() === p.color.toLowerCase() ? '2px solid #EBEBF0' : '2px solid transparent',
                                        borderRadius: '4px',
                                        height: 22, width: 22,
                                        padding: 0,
                                        boxShadow: baseColor.toLowerCase() === p.color.toLowerCase() ? '0 0 0 3px rgba(255,255,255,0.1)' : undefined,
                                    }}
                                    onClick={() => setBaseColor(p.color)}
                                    aria-label={`Pick ${p.name} as base color`}
                                    title={`${p.name} ${p.color}`}
                                />
                            ))}
                        </div>

                        {/* Custom color picker */}
                        <div
                            className="color-pick-wrapper"
                            onClick={() => colorInputRef.current?.click()}
                            tabIndex={0}
                            onKeyDown={e => e.key === 'Enter' && colorInputRef.current?.click()}
                            role="button"
                            aria-label="Pick custom color"
                        >
                            <div
                                className="color-pick-swatch"
                                style={{ background: baseColor }}
                                aria-hidden="true"
                            />
                            <span className="color-pick-value">{baseColor.toUpperCase()}</span>
                            <input
                                ref={colorInputRef}
                                type="color"
                                className="hidden-color-input"
                                value={baseColor}
                                onChange={e => setBaseColor(e.target.value)}
                                aria-label="Custom base color picker"
                                id="generator-color-input"
                            />
                        </div>

                        {/* Mode toggle */}
                        <div className="mode-toggle" role="group" aria-label="Color mode">
                            <button
                                className={`mode-toggle-btn ${mode === 'dark' ? 'active' : ''}`}
                                onClick={() => setMode('dark')}
                                aria-pressed={mode === 'dark'}
                            >
                                ◐ Dark
                            </button>
                            <button
                                className={`mode-toggle-btn ${mode === 'light' ? 'active' : ''}`}
                                onClick={() => setMode('light')}
                                aria-pressed={mode === 'light'}
                            >
                                ◑ Light
                            </button>
                        </div>
                    </div>
                </div>

                {/* Preview color strip */}
                <div style={{ display: 'flex', height: 6, overflow: 'hidden' }}>
                    {Object.entries(tokens)
                        .filter(([, v]) => v.startsWith('#'))
                        .slice(0, 30)
                        .map(([k, v]) => (
                            <div key={k} style={{ flex: 1, background: v }} aria-hidden="true" />
                        ))}
                </div>

                {/* View tabs */}
                <div className="tabs" style={{ borderBottom: '1px solid #1F1F26' }}>
                    <button
                        className={`tab ${activeView === 'tokens' ? 'active' : ''}`}
                        onClick={() => setActiveView('tokens')}
                        role="tab"
                        aria-selected={activeView === 'tokens'}
                    >
                        Token Table
                        <span className="tab-badge">{Object.keys(tokens).length}</span>
                    </button>
                    <button
                        className={`tab ${activeView === 'export' ? 'active' : ''}`}
                        onClick={() => setActiveView('export')}
                        role="tab"
                        aria-selected={activeView === 'export'}
                    >
                        Export
                        <span className="tab-badge">6 formats</span>
                    </button>
                </div>

                {/* Content */}
                {activeView === 'tokens' && (
                    <TokenTable tokens={tokens} copiedKey={copiedKey} onCopy={handleCopy} />
                )}
                {activeView === 'export' && (
                    <ExportPanel tokens={tokens} name={themeName} />
                )}
            </div>
        </div>
    );
}
