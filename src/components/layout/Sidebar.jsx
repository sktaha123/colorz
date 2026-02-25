import { useMemo } from 'react';
import { PALETTE_CATEGORIES } from '../../data/standardPalettes';
import { STANDARD_PALETTES } from '../../data/standardPalettes';
import { UI_SYSTEM_PALETTES } from '../../data/uiSystemPalettes';

const GridIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
);

const LayersIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
    </svg>
);

const BookmarkIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
);

export default function Sidebar({ activeCategory, onCategoryChange, activeTab, isOpen, onClose, savedPaletteCount, savedUISystemCount }) {
    // Count palettes per category
    const categoryCounts = useMemo(() => {
        const counts = {};
        PALETTE_CATEGORIES.forEach(cat => {
            if (cat.id === 'all') {
                counts[cat.id] = STANDARD_PALETTES.length + UI_SYSTEM_PALETTES.length;
            } else if (cat.id === 'ui-system') {
                counts[cat.id] = UI_SYSTEM_PALETTES.length;
            } else {
                counts[cat.id] = STANDARD_PALETTES.filter(p => p.tags.includes(cat.id)).length;
            }
        });
        return counts;
    }, []);

    const handleSelect = (category, tab) => {
        onCategoryChange(category, tab);
        if (onClose) onClose();
    };

    return (
        <>
            <div
                className={`sidebar-overlay ${isOpen ? 'show' : ''}`}
                onClick={onClose}
                aria-hidden="true"
            />
            <aside className={`sidebar ${isOpen ? 'open' : ''}`} role="navigation" aria-label="Palette categories">
                {/* Standard Palettes */}
                <div className="sidebar-section">
                    <div className="sidebar-label">
                        <GridIcon /> &nbsp;Standard
                    </div>
                    {PALETTE_CATEGORIES.filter(c => c.id !== 'ui-system').map(cat => (
                        <button
                            key={cat.id}
                            className={`sidebar-item ${activeCategory === cat.id && activeTab === 'standard' ? 'active' : ''}`}
                            onClick={() => handleSelect(cat.id, 'standard')}
                            aria-pressed={activeCategory === cat.id && activeTab === 'standard'}
                        >
                            <span>{cat.label}</span>
                            <span className="sidebar-item-count">{categoryCounts[cat.id] || 0}</span>
                        </button>
                    ))}
                </div>

                {/* My Collection */}
                <div className="sidebar-section pt-4" style={{ borderTop: '1px solid #1F1F26' }}>
                    <div className="sidebar-label">
                        <BookmarkIcon /> &nbsp;My Collection
                    </div>
                    <button
                        className={`sidebar-item ${activeCategory === 'saved' ? 'active' : ''}`}
                        onClick={() => handleSelect('saved', 'standard')}
                        aria-pressed={activeCategory === 'saved'}
                    >
                        <span>Saved Palettes</span>
                        <span className="sidebar-item-count">{savedPaletteCount}</span>
                    </button>
                    <button
                        className={`sidebar-item ${activeCategory === 'saved-ui' ? 'active' : ''}`}
                        onClick={() => handleSelect('saved-ui', 'ui-system')}
                        aria-pressed={activeCategory === 'saved-ui'}
                    >
                        <span>Saved UI Systems</span>
                        <span className="sidebar-item-count">{savedUISystemCount}</span>
                    </button>
                </div>

                {/* UI System Tools */}
                <div className="sidebar-section pt-4" style={{ borderTop: '1px solid #1F1F26' }}>
                    <div className="sidebar-label">
                        <LayersIcon /> &nbsp;UI System
                    </div>
                    <button
                        className={`sidebar-item ${activeTab === 'ui-system' ? 'active' : ''}`}
                        onClick={() => handleSelect('ui-system', 'ui-system')}
                        aria-pressed={activeTab === 'ui-system'}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            UI System
                            <span className="sidebar-badge">New</span>
                        </span>
                        <span className="sidebar-item-count">{UI_SYSTEM_PALETTES.length}</span>
                    </button>
                    <button
                        className={`sidebar-item ${activeTab === 'generator' ? 'active' : ''}`}
                        onClick={() => handleSelect('generator', 'generator')}
                        aria-pressed={activeTab === 'generator'}
                    >
                        <span>Generator</span>
                        <span className="sidebar-badge">Tool</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
