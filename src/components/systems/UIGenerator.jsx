import { useState, useCallback, useMemo, useRef, memo } from 'react';
import { RefreshIcon, CopyIcon, CheckIcon } from '../shared/Icons';
import { generateTokens, TOKEN_METADATA, TOKEN_CATEGORIES } from '../../utils/tokenGenerator';
import { EXPORT_FORMATS } from '../../utils/exportUtils';

// Preset brand colors library
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

/**
 * TokenTableRow - Individual token row
 */
const TokenTableRow = memo(function TokenTableRow({ tokenKey, value, metadata, copiedKey, onCopy }) {
    const isColor = value && (value.startsWith('#') || value.startsWith('rgb'));

    const handleCopy = useCallback(() => {
        onCopy(tokenKey, value);
    }, [tokenKey, value, onCopy]);

    return (
        <tr>
            <td>
                <div className="token-swatch-cell">
                    <div
                        className="token-swatch"
                        style={{
                            background: isColor ? value : 'transparent',
                            border: isColor ? '1px solid #B0B0AD' : '1px dashed #E0E1DD',
                        }}
                        aria-hidden="true"
                    />
                    <span className="token-name">{tokenKey}</span>
                </div>
            </td>
            <td>
                <button
                    className="btn btn-ghost btn-sm font-mono text-xs"
                    style={{ padding: '0 6px', height: 22 }}
                    onClick={handleCopy}
                    aria-label={`Copy token value: ${value}`}
                    title={value}
                >
                    {copiedKey === tokenKey ? '✓' : value.length > 18 ? value.slice(0, 17) + '…' : value}
                </button>
            </td>
            <td>
                <span className="token-description">{metadata?.description}</span>
            </td>
        </tr>
    );
});

/**
 * TokenTableSection - Grouped token table section
 */
const TokenTableSection = memo(function TokenTableSection({ category, tokens, copiedKey, onCopy }) {
    if (!tokens.length) return null;

    return (
        <div className="token-table-section">
            <div className="token-section-title" role="heading" aria-level="3">
                {category}
            </div>
            <table className="token-table" aria-label={`${category} design tokens`}>
                <thead>
                    <tr>
                        <th style={{ width: '32%' }}>Token</th>
                        <th style={{ width: '22%' }}>Value</th>
                        <th style={{ width: '46%' }}>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {tokens.map(({ key, value }) => (
                        <TokenTableRow
                            key={key}
                            tokenKey={key}
                            value={value}
                            metadata={TOKEN_METADATA[key]}
                            copiedKey={copiedKey}
                            onCopy={onCopy}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
});

/**
 * TokenTable - Complete token table with grouping
 */
const TokenTable = memo(function TokenTable({ tokens, copiedKey, onCopy }) {
    // Group tokens by category
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

    return (
        <div role="region" aria-label="Design tokens table">
            {TOKEN_CATEGORIES.map(cat => (
                <TokenTableSection
                    key={cat}
                    category={cat}
                    tokens={groupedTokens[cat] || []}
                    copiedKey={copiedKey}
                    onCopy={onCopy}
                />
            ))}
        </div>
    );
});

/**
 * ExportPanel - Export code in multiple formats
 */
const ExportPanel = memo(function ExportPanel({ tokens, name }) {
    const [activeFormat, setActiveFormat] = useState('css');
    const [copied, setCopied] = useState(false);

    // Generate code content
    const codeContent = useMemo(() => {
        const fmt = EXPORT_FORMATS.find(f => f.id === activeFormat);
        return fmt?.fn(tokens, name) || '';
    }, [activeFormat, tokens, name]);

    // Copy to clipboard
    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(codeContent);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }, [codeContent]);

    const langMap = { css: 'CSS', tailwind: 'JS', json: 'JSON', scss: 'SCSS', 'design-tokens': 'JSON', 'style-object': 'JS' };

    return (
        <div className="export-panel" role="region" aria-label="Export tokens">
            <div className="export-panel-header">
                <div className="export-panel-title">Export Design Tokens</div>
            </div>

            {/* Format tabs */}
            <div className="export-format-tabs" role="tablist">
                {EXPORT_FORMATS.map(fmt => (
                    <button
                        key={fmt.id}
                        id={`gen-export-btn-${fmt.id}`}
                        className={`export-format-btn ${activeFormat === fmt.id ? 'active' : ''}`}
                        onClick={() => setActiveFormat(fmt.id)}
                        role="tab"
                        aria-selected={activeFormat === fmt.id}
                        aria-controls={`gen-export-code-${fmt.id}`}
                        title={fmt.description}
                    >
                        {fmt.label}
                    </button>
                ))}
            </div>

            {/* Code block */}
            <div className="export-code-block">
                <div className="code-block-header">
                    <span className="code-block-lang">{langMap[activeFormat] || 'TEXT'}</span>
                    <button
                        id="gen-export-copy-btn"
                        className={`btn btn-sm ${copied ? 'btn-copied' : 'btn-secondary'}`}
                        onClick={handleCopy}
                        aria-label={copied ? 'Code copied to clipboard' : 'Copy code to clipboard'}
                    >
                        {copied ? <CheckIcon /> : <CopyIcon />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                </div>
                <pre className="code-block-content" id={`gen-export-code-${activeFormat}`} aria-label="Export code">
                    <code>{codeContent}</code>
                </pre>
            </div>
        </div>
    );
});

/**
 * ColorPresetButton - Individual color preset button
 */
const ColorPresetButton = memo(function ColorPresetButton({ color, name, isActive, onSelect }) {
    return (
        <button
            className="btn btn-icon-sm"
            style={{
                background: color,
                border: isActive ? '2px solid #0D1B2A' : '2px solid transparent',
                borderRadius: '4px',
                height: 22,
                width: 22,
                padding: 0,
                boxShadow: isActive ? '0 0 0 3px rgba(33, 56, 33, 0.15)' : undefined,
            }}
            onClick={onSelect}
            aria-label={`Select ${name} as base color`}
            aria-pressed={isActive}
            title={`${name} ${color}`}
        />
    );
});

/**
 * ColorPresetsRow - Row of color preset buttons
 */
const ColorPresetsRow = memo(function ColorPresetsRow({ baseColor, onColorSelect }) {
    return (
        <div className="flex gap-1 flex-wrap" role="group" aria-label="Color presets">
            {PRESET_COLORS.map(preset => (
                <ColorPresetButton
                    key={preset.color}
                    color={preset.color}
                    name={preset.name}
                    isActive={baseColor.toLowerCase() === preset.color.toLowerCase()}
                    onSelect={() => onColorSelect(preset.color)}
                />
            ))}
        </div>
    );
});

/**
 * ColorPicker - Custom color input field
 */
const ColorPicker = memo(function ColorPicker({ baseColor, onColorChange }) {
    const colorInputRef = useRef(null);

    const handleClick = useCallback(() => {
        colorInputRef.current?.click();
    }, []);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            colorInputRef.current?.click();
        }
    }, []);

    return (
        <div
            className="color-pick-wrapper"
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label="Pick custom base color"
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
                onChange={e => onColorChange(e.target.value)}
                aria-label="Custom base color picker"
                id="generator-color-input"
            />
        </div>
    );
});

/**
 * ModeToggle - Dark/Light mode selector
 */
const ModeToggle = memo(function ModeToggle({ mode, onModeChange }) {
    return (
        <div className="mode-toggle" role="group" aria-label="Color mode">
            <button
                className={`mode-toggle-btn ${mode === 'dark' ? 'active' : ''}`}
                onClick={() => onModeChange('dark')}
                aria-pressed={mode === 'dark'}
                title="Generate dark mode tokens"
            >
                ◐ Dark
            </button>
            <button
                className={`mode-toggle-btn ${mode === 'light' ? 'active' : ''}`}
                onClick={() => onModeChange('light')}
                aria-pressed={mode === 'light'}
                title="Generate light mode tokens"
            >
                ◑ Light
            </button>
        </div>
    );
});

/**
 * ColorStrip - Visual preview of token colors
 */
const ColorStrip = memo(function ColorStrip({ tokens }) {
    const colorEntries = useMemo(
        () => Object.entries(tokens)
            .filter(([, v]) => v && (v.startsWith('#') || v.startsWith('rgb')))
            .slice(0, 30),
        [tokens]
    );

    return (
        <div style={{ display: 'flex', height: 6, overflow: 'hidden' }} aria-hidden="true">
            {colorEntries.map(([key, color]) => (
                <div key={key} style={{ flex: 1, background: color }} />
            ))}
        </div>
    );
});

/**
 * UIGenerator - Main token generator component
 */
export default function UIGenerator() {
    const [baseColor, setBaseColor] = useState('#1B263B');
    const [mode, setMode] = useState('dark');
    const [activeView, setActiveView] = useState('tokens');
    const [copiedKey, setCopiedKey] = useState(null);

    // Generate tokens when color or mode changes
    const tokens = useMemo(
        () => generateTokens(baseColor, mode),
        [baseColor, mode]
    );

    // Generate theme name
    const themeName = useMemo(() => {
        const preset = PRESET_COLORS.find(p => p.color.toLowerCase() === baseColor.toLowerCase());
        return `${preset?.name || 'Custom'} ${mode === 'dark' ? 'Dark' : 'Light'} Theme`;
    }, [baseColor, mode]);

    // Handle token copy
    const handleCopy = useCallback((key, value) => {
        navigator.clipboard.writeText(value)
            .then(() => {
                setCopiedKey(key);
                setTimeout(() => setCopiedKey(null), 1500);
            })
            .catch(err => console.error('Copy failed:', err));
    }, []);

    return (
        <div role="main" aria-label="Design token generator">
            {/* Generator Panel */}
            <div className="generator-panel">

                {/* Header Section */}
                <div className="generator-header">
                    <div>
                        <h2 className="generator-title">Design Token Generator</h2>
                        <div className="text-sm text-text-tertiary mt-0.5">
                            Generate a complete set of {Object.keys(tokens).length} design tokens from a brand color
                        </div>
                    </div>

                    {/* Control Panel */}
                    <div className="generator-controls">
                        <ColorPresetsRow baseColor={baseColor} onColorSelect={setBaseColor} />
                        <ColorPicker baseColor={baseColor} onColorChange={setBaseColor} />
                        <ModeToggle mode={mode} onModeChange={setMode} />
                    </div>
                </div>

                {/* Color Strip Preview */}
                <ColorStrip tokens={tokens} />

                {/* View Tabs */}
                <div className="tabs" style={{ borderBottom: '1px solid #B0B0AD' }} role="tablist">
                    <button
                        className={`tab ${activeView === 'tokens' ? 'active' : ''}`}
                        onClick={() => setActiveView('tokens')}
                        role="tab"
                        aria-selected={activeView === 'tokens'}
                        aria-controls="token-table-panel"
                    >
                        Token Table
                        <span className="tab-badge">{Object.keys(tokens).length}</span>
                    </button>
                    <button
                        className={`tab ${activeView === 'export' ? 'active' : ''}`}
                        onClick={() => setActiveView('export')}
                        role="tab"
                        aria-selected={activeView === 'export'}
                        aria-controls="export-panel"
                    >
                        Export
                        <span className="tab-badge">{EXPORT_FORMATS.length} formats</span>
                    </button>
                </div>

                {/* Tab Content */}
                {activeView === 'tokens' && (
                    <div id="token-table-panel">
                        <TokenTable tokens={tokens} copiedKey={copiedKey} onCopy={handleCopy} />
                    </div>
                )}
                {activeView === 'export' && (
                    <div id="export-panel">
                        <ExportPanel tokens={tokens} name={themeName} />
                    </div>
                )}
            </div>
        </div>
    );
}
