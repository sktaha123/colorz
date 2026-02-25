import { useState, useCallback, memo } from 'react';
import { EyeIcon, ExportIcon, HeartIcon, BookmarkIcon } from '../shared/Icons';

/**
 * UISystemCardActions - Action buttons for UI System Card
 */
const UISystemCardActions = memo(function UISystemCardActions({ system, liked, onLikeChange, isSaved, onSave, onOpen }) {
    const handleExportClick = useCallback((e) => {
        e.stopPropagation();
        onOpen?.(system);
    }, [system, onOpen]);

    const handleLike = useCallback((e) => {
        e.stopPropagation();
        onLikeChange();
    }, [onLikeChange]);

    const handleSave = useCallback((e) => {
        e.stopPropagation();
        onSave?.();
    }, [onSave]);

    return (
        <div className="ui-card-actions">
            <button
                className="btn btn-primary btn-sm"
                id={`view-system-${system.id}`}
                onClick={handleExportClick}
                aria-label={`View and export ${system.name} design tokens`}
            >
                <EyeIcon /> View &amp; Export
            </button>
            <button
                className="btn btn-secondary btn-sm"
                onClick={handleExportClick}
                aria-label={`Export ${system.name} to different formats`}
                title="View export formats"
            >
                <ExportIcon /> Export
            </button>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button
                    className={`btn btn-ghost btn-icon-sm ${liked ? 'text-error' : ''}`}
                    onClick={handleLike}
                    aria-label={liked ? 'Unlike this UI system' : 'Like this UI system'}
                    aria-pressed={liked}
                >
                    <HeartIcon filled={liked} />
                </button>
                <span className="font-mono text-xs text-text-tertiary mr-1" aria-label={`${system.likes + (liked ? 1 : 0)} likes`}>
                    {(system.likes + (liked ? 1 : 0)).toLocaleString()}
                </span>

                <button
                    className={`btn btn-ghost btn-icon-sm ${isSaved ? 'text-accent' : ''}`}
                    onClick={handleSave}
                    aria-label={isSaved ? 'Remove from collection' : 'Save to collection'}
                    aria-pressed={isSaved}
                >
                    <BookmarkIcon filled={isSaved} />
                </button>
            </div>
        </div>
    );
});

/**
 * UISystemCardMeta - Metadata section of the card
 */
const UISystemCardMeta = memo(function UISystemCardMeta({ system }) {
    return (
        <div className="ui-card-meta">
            <span className={`mode-badge ${system.mode}`} aria-label={`${system.mode} mode`}>
                {system.mode === 'dark' ? '◐ Dark' : '◑ Light'}
            </span>
            <span className="text-xs font-mono text-text-tertiary" title={`Total design tokens: ${Object.keys(system.tokens).length}`}>
                {Object.keys(system.tokens).length} tokens
            </span>
        </div>
    );
});

/**
 * UISystemCard - Design system preview card
 * Displays system name, description, preview colors, and action buttons
 */
const UISystemCard = memo(function UISystemCard({ system, onOpen, isSaved, onSave }) {
    const [liked, setLiked] = useState(false);

    const handleLikeChange = useCallback(() => {
        setLiked(prev => !prev);
    }, []);

    if (!system) return null;

    return (
        <article
            className="ui-system-card"
            aria-label={`UI System: ${system.name}`}
        >
            {/* Header with title, description, and preview */}
            <div className="ui-card-header">
                <div>
                    <h3 className="ui-card-name">{system.name}</h3>
                    <p className="ui-card-description">{system.description}</p>
                    <UISystemCardMeta system={system} />
                </div>

                {/* Color preview swatches */}
                <div className="ui-card-preview" aria-label={`Preview colors for ${system.name}`} role="list">
                    {system.preview.map((color, idx) => (
                        <div
                            key={`${system.id}-color-${idx}`}
                            className="ui-card-preview-swatch"
                            style={{ backgroundColor: color }}
                            role="listitem"
                            aria-label={`Color ${idx + 1}: ${color}`}
                        />
                    ))}
                </div>
            </div>

            {/* Action buttons */}
            <UISystemCardActions
                system={system}
                liked={liked}
                onLikeChange={handleLikeChange}
                isSaved={isSaved}
                onSave={onSave}
                onOpen={onOpen}
            />
        </article>
    );
});

export default UISystemCard;
