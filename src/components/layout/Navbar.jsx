import { useState, useRef, useCallback, memo } from 'react';

// Additional icons specific to Navbar
const SearchIcon = ({ width = 14, height = 14 }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
    </svg>
);

const MenuIcon = ({ width = 20, height = 20 }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);

const XIcon = ({ width = 14, height = 14 }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

/**
 * BrandLogo - Colorz Pallete logo with colored dots
 */
const BrandLogo = memo(function BrandLogo() {
    return (
        <a className="navbar-brand" href="/" aria-label="ColorzPallete home, go to dashboard">
            <div className="brand-logo" aria-hidden="true">
                <span className="brand-logo-dot" style={{ background: '#0D1B2A' }} />
                <span className="brand-logo-dot" style={{ background: '#1B263B' }} />
                <span className="brand-logo-dot" style={{ background: '#415A77' }} />
                <span className="brand-logo-dot" style={{ background: '#B0B0AD' }} />
            </div>
            <span className="brand-name">Colorz<span>Pallete</span></span>
        </a>
    );
});

/**
 * SearchInput - Search field for palette queries
 */
const SearchInput = memo(function SearchInput({ value, onSearch, onClear }) {
    const inputRef = useRef(null);

    const handleClear = useCallback(() => {
        onSearch('');
        inputRef.current?.focus();
    }, [onSearch]);

    return (
        <div className="navbar-search" role="search">
            <span className="search-icon" aria-hidden="true">
                <SearchIcon />
            </span>
            <input
                ref={inputRef}
                id="palette-search"
                type="search"
                className="search-input"
                placeholder="Search by color, tag, or ID..."
                value={value}
                onChange={e => onSearch(e.target.value)}
                aria-label="Search color palettes"
                autoComplete="off"
                spellCheck="false"
            />
            {value && (
                <button
                    className="btn btn-ghost btn-icon-sm"
                    style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', height: 22, width: 22 }}
                    onClick={handleClear}
                    aria-label="Clear search"
                    title="Clear search"
                >
                    <XIcon />
                </button>
            )}
        </div>
    );
});

/**
 * Navbar - Main navigation bar
 */
export default function Navbar({ search, onSearch, totalCount, onToggleSidebar }) {
    const [isMenuOpen] = useState(false);

    const handleToggleSidebar = useCallback(() => {
        onToggleSidebar?.();
    }, [onToggleSidebar]);

    return (
        <nav className="navbar" role="banner" aria-label="Main navigation">
            {/* Mobile menu toggle */}
            <button
                className="btn btn-ghost btn-icon menu-toggle-mobile"
                onClick={handleToggleSidebar}
                aria-label="Toggle navigation menu"
                aria-expanded={isMenuOpen}
            >
                <MenuIcon />
            </button>

            {/* Brand logo */}
            <BrandLogo />

            {/* Search input */}
            <SearchInput value={search} onSearch={onSearch} />

            {/* Navbar actions */}
            <div className="navbar-actions">
                <span
                    className="nav-count"
                    aria-live="polite"
                    aria-atomic="true"
                    title={`Total palettes and UI systems in database`}
                >
                    {totalCount.toLocaleString()} total
                </span>
            </div>
        </nav>
    );
}
