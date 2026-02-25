import { useCallback, useState, memo } from 'react';
import { CopyIcon, HeartIcon, BookmarkIcon } from '../shared/Icons';

/**
 * PaletteColorSwatch - Individual color swatch with copy functionality
 */
const PaletteColorSwatch = memo(function PaletteColorSwatch({ color, index, isCopied, onCopy }) {
    const handleCopy = useCallback((e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(color)
            .then(() => {
                onCopy(index);
            })
            .catch(err => console.error('Copy failed:', err));
    }, [color, index, onCopy]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCopy(e);
        }
    }, [handleCopy]);

    return (
        <div
            className="palette-swatch"
            style={{ backgroundColor: color }}
            role="button"
            tabIndex={0}
            aria-label={`Color ${color}, click to copy`}
            onClick={handleCopy}
            onKeyDown={handleKeyDown}
        >
            {/* Copy overlay */}
            <div className="swatch-copy" aria-hidden="true">
                <span className="swatch-copy-icon">
                    <CopyIcon width={14} height={14} />
                </span>
            </div>
            {/* Hex value display */}
            <span className="swatch-hex" aria-hidden="true">
                {isCopied ? '✓' : color.toUpperCase()}
            </span>
        </div>
    );
});

/**
 * PaletteCardActions - Action buttons and metadata
 */
const PaletteCardActions = memo(function PaletteCardActions({ palette, liked, onLikeChange, isSaved, onSave, onCopyAll }) {
    return (
        <div className="palette-card-footer">
            {/* Tags */}
            <div className="palette-tags" role="list">
                {palette.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="palette-tag" role="listitem">
                        {tag}
                    </span>
                ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-1 items-center">
                {/* Like button */}
                <div className="palette-likes" aria-label={`${palette.likes + (liked ? 1 : 0)} likes`}>
                    <button
                        className={`btn btn-ghost btn-icon-sm ${liked ? 'text-error' : ''}`}
                        onClick={e => {
                            e.stopPropagation();
                            onLikeChange();
                        }}
                        aria-label={liked ? 'Unlike palette' : 'Like palette'}
                        aria-pressed={liked}
                        title={liked ? 'Unlike' : 'Like'}
                    >
                        <HeartIcon filled={liked} />
                    </button>
                    <span className="text-xs">{(palette.likes + (liked ? 1 : 0)).toLocaleString()}</span>
                </div>

                {/* Save button */}
                <button
                    className={`btn btn-ghost btn-icon-sm ${isSaved ? 'text-accent' : ''}`}
                    onClick={e => {
                        e.stopPropagation();
                        onSave?.();
                    }}
                    aria-label={isSaved ? 'Remove from collection' : 'Save to collection'}
                    aria-pressed={isSaved}
                    title={isSaved ? 'Remove from collection' : 'Save to collection'}
                >
                    <BookmarkIcon filled={isSaved} />
                </button>

                {/* Copy all button */}
                <button
                    className="btn btn-ghost btn-icon-sm"
                    onClick={onCopyAll}
                    aria-label="Copy all hex values"
                    title="Copy all colors as comma-separated list"
                >
                    <CopyIcon />
                </button>
            </div>
        </div>
    );
});

/**
 * PaletteCard - Color palette preview card
 * Displays color swatches and allows copying, liking, and saving
 */
const PaletteCard = memo(function PaletteCard({ palette, onCopy, isSaved, onSave }) {
    const [liked, setLiked] = useState(false);
    const [copiedIdx, setCopiedIdx] = useState(null);

    if (!palette || !palette.colors) return null;

    // Handle color swatch copy
    const handleSwatchCopy = useCallback((idx) => {
        setCopiedIdx(idx);
        onCopy?.(palette.colors[idx]);
        setTimeout(() => setCopiedIdx(null), 1500);
    }, [palette, onCopy]);

    // Handle copy all colors
    const handleCopyAll = useCallback((e) => {
        e.stopPropagation();
        const text = palette.colors.join(', ');
        navigator.clipboard.writeText(text)
            .then(() => {
                onCopy?.(palette.colors[0], 'All colors copied');
            })
            .catch(err => console.error('Copy failed:', err));
    }, [palette, onCopy]);

    // Handle like toggle
    const handleLikeChange = useCallback(() => {
        setLiked(prev => !prev);
    }, []);

    return (
        <article
            className="palette-card"
            aria-label={`Color palette ${palette.id}`}
        >
            {/* Color swatches row */}
            <div className="palette-swatch-row" role="list" aria-label={`${palette.colors.length} colors`}>
                {palette.colors.map((color, idx) => (
                    <PaletteColorSwatch
                        key={`${palette.id}-${idx}`}
                        color={color}
                        index={idx}
                        isCopied={copiedIdx === idx}
                        onCopy={handleSwatchCopy}
                    />
                ))}
            </div>

            {/* Action buttons and metadata */}
            <PaletteCardActions
                palette={palette}
                liked={liked}
                onLikeChange={handleLikeChange}
                isSaved={isSaved}
                onSave={onSave}
                onCopyAll={handleCopyAll}
            />
        </article>
    );
});

export default PaletteCard;
