import { useMemo, memo, useCallback } from 'react';
import { GridIcon, LayersIcon, BookmarkIcon } from '../shared/Icons';
import { PALETTE_CATEGORIES } from '../../data/standardPalettes';
import { STANDARD_PALETTES } from '../../data/standardPalettes';
import { UI_SYSTEM_PALETTES } from '../../data/uiSystemPalettes';

/**
 * SidebarSection - Reusable section component
 */
const SidebarSection = memo(function SidebarSection({ children, divider = false, label, icon: Icon }) {
    return (
        <div className="sidebar-section" style={divider ? { borderTop: '1px solid #B0B0AD', paddingTop: '16px' } : {}}>
            {label && (
                <div className="sidebar-label" role="heading" aria-level="3">
                    {Icon && <Icon />} &nbsp;{label}
                </div>
            )}
            {children}
        </div>
    );
});

/**
 * SidebarButton - Individual sidebar item button
 */
const SidebarButton = memo(function SidebarButton({ active, onClick, label, count, badge }) {
    return (
        <button
            className={`sidebar-item ${active ? 'active' : ''}`}
            onClick={onClick}
            aria-pressed={active}
        >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {label}
                {badge && <span className="sidebar-badge">{badge}</span>}
            </span>
            <span className="sidebar-item-count">{count}</span>
        </button>
    );
});

/**
 * CategoryButtons - Standard palettes category list
 */
const CategoryButtons = memo(function CategoryButtons({ categories, activeCategory, activeTab, counts, onSelect }) {
    return (
        <>
            {categories.map(cat => (
                <SidebarButton
                    key={cat.id}
                    label={cat.label}
                    count={counts[cat.id] || 0}
                    active={activeCategory === cat.id && activeTab === 'standard'}
                    onClick={() => onSelect(cat.id, 'standard')}
                />
            ))}
        </>
    );
});

/**
 * Sidebar - Main navigation component
 */
export default function Sidebar({
    activeCategory,
    onCategoryChange,
    activeTab,
    isOpen,
    onClose,
    savedPaletteCount,
    savedUISystemCount
}) {
    // Calculate category counts - memoized with proper dependencies
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

    // Memoize category list
    const standardCategories = useMemo(
        () => PALETTE_CATEGORIES.filter(c => c.id !== 'ui-system'),
        []
    );

    // Handle category selection with cleanup
    const handleSelect = useCallback((category, tab) => {
        onCategoryChange(category, tab);
        if (onClose) onClose();
    }, [onCategoryChange, onClose]);

    const handleOverlayClick = useCallback(() => {
        if (onClose) onClose();
    }, [onClose]);

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`sidebar-overlay ${isOpen ? 'show' : ''}`}
                onClick={handleOverlayClick}
                aria-hidden="true"
            />

            {/* Sidebar Navigation */}
            <aside
                className={`sidebar ${isOpen ? 'open' : ''}`}
                role="navigation"
                aria-label="Palette and system navigation"
            >
                {/* Standard Palettes Section */}
                <SidebarSection label="Standard" icon={GridIcon}>
                    <CategoryButtons
                        categories={standardCategories}
                        activeCategory={activeCategory}
                        activeTab={activeTab}
                        counts={categoryCounts}
                        onSelect={handleSelect}
                    />
                </SidebarSection>

                {/* My Collection Section */}
                <SidebarSection label="My Collection" icon={BookmarkIcon} divider>
                    <SidebarButton
                        label="Saved Palettes"
                        count={savedPaletteCount}
                        active={activeCategory === 'saved'}
                        onClick={() => handleSelect('saved', 'standard')}
                    />
                    <SidebarButton
                        label="Saved UI Systems"
                        count={savedUISystemCount}
                        active={activeCategory === 'saved-ui'}
                        onClick={() => handleSelect('saved-ui', 'ui-system')}
                    />
                </SidebarSection>

                {/* UI System Tools Section */}
                <SidebarSection label="UI System" icon={LayersIcon} divider>
                    <SidebarButton
                        label="UI System"
                        badge="New"
                        count={UI_SYSTEM_PALETTES.length}
                        active={activeTab === 'ui-system'}
                        onClick={() => handleSelect('ui-system', 'ui-system')}
                    />
                    <SidebarButton
                        label="Generator"
                        badge="Tool"
                        count=""
                        active={activeTab === 'generator'}
                        onClick={() => handleSelect('generator', 'generator')}
                    />
                </SidebarSection>
            </aside>
        </>
    );
}
