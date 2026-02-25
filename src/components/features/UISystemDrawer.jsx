import { useState, useCallback, useMemo } from 'react';
import { TOKEN_METADATA, TOKEN_CATEGORIES } from '../../utils/tokenGenerator';
import { EXPORT_FORMATS } from '../../utils/exportUtils';

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

const XIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 6 6 18M6 6l12 12" />
    </svg>
);

function ExportPanel({ tokens, name }) {
    const [activeFormat, setActiveFormat] = useState('css');
    const [copied, setCopied] = useState(false);

    const exportFn = useMemo(() => {
        const fmt = EXPORT_FORMATS.find(f => f.id === activeFormat);
        return fmt?.fn;
    }, [activeFormat]);

    const codeContent = useMemo(() => {
        if (!exportFn || !tokens) return '';
        return exportFn(tokens, name);
    }, [exportFn, tokens, name]);

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
                <div className="export-panel-title">Export Tokens</div>
            </div>
            <div className="export-format-tabs" role="tablist" aria-label="Export format">
                {EXPORT_FORMATS.map(fmt => (
                    <button
                        key={fmt.id}
                        id={`export-btn-${fmt.id}`}
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
            <div className="export-code-block" role="tabpanel">
                <div className="code-block-header">
                    <span className="code-block-lang">{langMap[activeFormat] || 'TEXT'}</span>
                    <button
                        id="export-copy-btn"
                        className={`btn btn-sm ${copied ? 'btn-copied' : 'btn-secondary'}`}
                        onClick={handleCopy}
                        aria-label="Copy code to clipboard"
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

function TokenTable({ tokens }) {
    const [copiedKey, setCopiedKey] = useState(null);

    const copyToken = useCallback((key, value) => {
        navigator.clipboard.writeText(value).then(() => {
            setCopiedKey(key);
            setTimeout(() => setCopiedKey(null), 1500);
        });
    }, []);

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
                                                    {isColor ? (
                                                        <div
                                                            className="token-swatch"
                                                            style={{ background: value }}
                                                            aria-hidden="true"
                                                        />
                                                    ) : (
                                                        <div
                                                            className="token-swatch"
                                                            style={{ background: value, border: '1px dashed #2A2A34', backdropFilter: 'blur(4px)' }}
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                    <span className="token-name">{key}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-ghost btn-sm font-mono text-xs"
                                                    style={{ padding: '0 6px', height: 22 }}
                                                    onClick={() => copyToken(key, value)}
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

export default function UISystemDrawer({ system, onClose }) {
    const [activeView, setActiveView] = useState('tokens');

    if (!system) return null;

    return (
        <div
            className="drawer-overlay"
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
            role="dialog"
            aria-modal="true"
            aria-label={`${system.name} — UI System`}
        >
            <div className="drawer">
                <div className="drawer-header">
                    <div>
                        <div className="drawer-title">{system.name}</div>
                        <div className="text-sm text-text-tertiary mt-0.5">
                            {system.description}
                        </div>
                    </div>
                    <button
                        id="drawer-close-btn"
                        className="btn btn-ghost btn-icon"
                        onClick={onClose}
                        aria-label="Close drawer"
                    >
                        <XIcon />
                    </button>
                </div>

                {/* Tabs */}
                <div className="tabs" style={{ borderBottom: '1px solid #1F1F26' }}>
                    <button
                        className={`tab ${activeView === 'tokens' ? 'active' : ''}`}
                        onClick={() => setActiveView('tokens')}
                        role="tab"
                        aria-selected={activeView === 'tokens'}
                    >
                        Token Table
                        <span className="tab-badge">{Object.keys(system.tokens).length}</span>
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
                    <TokenTable tokens={system.tokens} />
                )}
                {activeView === 'export' && (
                    <ExportPanel tokens={system.tokens} name={system.name} />
                )}
            </div>
        </div>
    );
}
