import { useCallback, useState, memo } from 'react';

const CopyIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
);

const HeartIcon = ({ filled }) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

const BookmarkIcon = ({ filled }) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
);

const PaletteCard = memo(function PaletteCard({ palette, onCopy, isSaved, onSave }) {
    const [liked, setLiked] = useState(false);
    const [copiedIdx, setCopiedIdx] = useState(null);

    const handleSwatchCopy = useCallback((color, idx, e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(color).then(() => {
            setCopiedIdx(idx);
            onCopy?.(color);
            setTimeout(() => setCopiedIdx(null), 1500);
        });
    }, [onCopy]);

    const handleCopyAll = useCallback((e) => {
        e.stopPropagation();
        const text = palette.colors.join(', ');
        navigator.clipboard.writeText(text).then(() => {
            onCopy?.(palette.colors[0], 'All colors copied');
        });
    }, [palette, onCopy]);

    return (
        <article className="palette-card" aria-label={`Palette ${palette.id}`}>
            <div className="palette-swatch-row" role="list">
                {palette.colors.map((color, idx) => (
                    <div
                        key={idx}
                        className="palette-swatch"
                        style={{ backgroundColor: color }}
                        role="listitem"
                        aria-label={`Color ${color}`}
                        onClick={e => handleSwatchCopy(color, idx, e)}
                        tabIndex={0}
                        onKeyDown={e => e.key === 'Enter' && handleSwatchCopy(color, idx, e)}
                    >
                        <div className="swatch-copy" aria-hidden="true">
                            <span className="swatch-copy-icon"><CopyIcon /></span>
                        </div>
                        <span className="swatch-hex" aria-hidden="true">
                            {copiedIdx === idx ? '✓' : color.toUpperCase()}
                        </span>
                    </div>
                ))}
            </div>
            <div className="palette-card-footer">
                <div className="palette-tags" role="list">
                    {palette.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="palette-tag" role="listitem">{tag}</span>
                    ))}
                </div>
                <div className="flex gap-1 items-center">
                    <div className="palette-likes" aria-label={`${palette.likes + (liked ? 1 : 0)} likes`}>
                        <button
                            className={`btn btn-ghost btn-icon-sm ${liked ? 'text-error' : ''}`}
                            onClick={e => { e.stopPropagation(); setLiked(l => !l); }}
                            aria-label={liked ? 'Unlike palette' : 'Like palette'}
                            aria-pressed={liked}
                        >
                            <HeartIcon filled={liked} />
                        </button>
                        <span>{(palette.likes + (liked ? 1 : 0)).toLocaleString()}</span>
                    </div>
                    <button
                        className={`btn btn-ghost btn-icon-sm ${isSaved ? 'text-accent' : ''}`}
                        onClick={e => { e.stopPropagation(); onSave?.(); }}
                        aria-label={isSaved ? 'Remove from collection' : 'Save to collection'}
                        aria-pressed={isSaved}
                    >
                        <BookmarkIcon filled={isSaved} />
                    </button>
                    <button
                        className="btn btn-ghost btn-icon-sm"
                        onClick={handleCopyAll}
                        aria-label="Copy all colors"
                        title="Copy all hex values"
                    >
                        <CopyIcon />
                    </button>
                </div>
            </div>
        </article>
    );
});

export default PaletteCard;
