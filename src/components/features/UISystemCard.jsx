import { useState, useCallback, memo } from 'react';
import { TOKEN_METADATA } from '../../utils/tokenGenerator';

const EyeIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
);

const ExportIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

const HeartIcon = ({ filled }) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

const BookmarkIcon = ({ filled }) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
);

const UISystemCard = memo(function UISystemCard({ system, onOpen, isSaved, onSave }) {
    const [liked, setLiked] = useState(false);

    const handleExportClick = useCallback((e) => {
        e.stopPropagation();
        onOpen?.(system);
    }, [system, onOpen]);

    const previewTokens = [
        'checkboxFill', 'sliderThumb', 'switchTrack',
        'focusedInputBorder', 'gradientStop1', 'gradientStop2',
        'skeletonBase', 'caretColor',
    ];

    return (
        <article className="ui-system-card" aria-label={`UI System: ${system.name}`}>
            <div className="ui-card-header">
                <div>
                    <div className="ui-card-name">{system.name}</div>
                    <div className="ui-card-description">{system.description}</div>
                    <div className="ui-card-meta">
                        <span className={`mode-badge ${system.mode}`}>
                            {system.mode === 'dark' ? '◐ Dark' : '◑ Light'}
                        </span>
                        <span className="sidebar-item-count" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>
                            {Object.keys(system.tokens).length} tokens
                        </span>
                    </div>
                </div>
                <div className="ui-card-preview" aria-label="Color preview">
                    {system.preview.map((color, i) => (
                        <div key={i} className="ui-card-preview-swatch" style={{ backgroundColor: color }} />
                    ))}
                </div>
            </div>

            <div className="ui-card-tokens-preview" aria-label="Token preview">
                {previewTokens.map(key => {
                    const value = system.tokens[key];
                    if (!value || value.startsWith('rgba') || value.startsWith('rgb')) {
                        return null;
                    }
                    return (
                        <div key={key} className="token-dot-row" title={`${TOKEN_METADATA[key]?.label}: ${value}`}>
                            <div className="token-dot" style={{ background: value }} aria-hidden="true" />
                            <span className="truncate" style={{ maxWidth: 80 }}>{TOKEN_METADATA[key]?.label?.split(' ')[0]}</span>
                        </div>
                    );
                })}
            </div>

            <div className="ui-card-actions">
                <button
                    className="btn btn-primary btn-sm"
                    id={`view-system-${system.id}`}
                    onClick={handleExportClick}
                    aria-label={`View and export ${system.name} tokens`}
                >
                    <EyeIcon /> View &amp; Export
                </button>
                <button
                    className="btn btn-secondary btn-sm"
                    onClick={handleExportClick}
                    aria-label={`Export ${system.name}`}
                >
                    <ExportIcon /> Export
                </button>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                        className="btn btn-ghost btn-icon-sm"
                        style={{ color: liked ? 'var(--error)' : undefined, height: 22, width: 22 }}
                        onClick={e => { e.stopPropagation(); setLiked(l => !l); }}
                        aria-label={liked ? 'Unlike' : 'Like'}
                        aria-pressed={liked}
                    >
                        <HeartIcon filled={liked} />
                    </button>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)', marginRight: 4 }}>
                        {(system.likes + (liked ? 1 : 0)).toLocaleString()}
                    </span>

                    <button
                        className="btn btn-ghost btn-icon-sm"
                        style={{ color: isSaved ? 'var(--accent)' : undefined, height: 22, width: 22 }}
                        onClick={e => { e.stopPropagation(); onSave?.(); }}
                        aria-label={isSaved ? 'Remove from collection' : 'Save to collection'}
                        aria-pressed={isSaved}
                    >
                        <BookmarkIcon filled={isSaved} />
                    </button>
                </div>
            </div>
        </article>
    );
});

export default UISystemCard;
