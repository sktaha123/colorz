import { useState, useRef, useCallback } from 'react';

// Simple SVG icons (no dependency)
const SearchIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
    </svg>
);

const MenuIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);

export default function Navbar({ search, onSearch, totalCount, onToggleSidebar }) {
    const inputRef = useRef(null);

    const handleClear = useCallback(() => {
        onSearch('');
        inputRef.current?.focus();
    }, [onSearch]);

    return (
        <nav className="navbar" role="banner">
            <button
                className="btn btn-ghost btn-icon menu-toggle-mobile"
                onClick={onToggleSidebar}
                aria-label="Toggle navigation menu"
            >
                <MenuIcon />
            </button>
            <a className="navbar-brand" href="/" aria-label="ColorzPallete home">
                <div className="brand-logo" aria-hidden="true">
                    <span className="brand-logo-dot" style={{ background: '#FF6B6B' }} />
                    <span className="brand-logo-dot" style={{ background: '#FECA57' }} />
                    <span className="brand-logo-dot" style={{ background: '#48DBFB' }} />
                    <span className="brand-logo-dot" style={{ background: '#A29BFE' }} />
                </div>
                <span className="brand-name">Colorz<span>Pallete</span></span>
            </a>

            <div className="navbar-search" role="search">
                <span className="search-icon" aria-hidden="true">
                    <SearchIcon />
                </span>
                <input
                    ref={inputRef}
                    id="palette-search"
                    type="search"
                    className="search-input"
                    placeholder="Search palettes..."
                    value={search}
                    onChange={e => onSearch(e.target.value)}
                    aria-label="Search color palettes"
                    autoComplete="off"
                    spellCheck="false"
                />
                {search && (
                    <button
                        className="btn btn-ghost btn-icon-sm"
                        style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', height: 22, width: 22 }}
                        onClick={handleClear}
                        aria-label="Clear search"
                    >
                        <XIcon />
                    </button>
                )}
            </div>

            <div className="navbar-actions">
                <span className="nav-count" aria-live="polite" aria-atomic="true">
                    {totalCount.toLocaleString()} palettes
                </span>
            </div>
        </nav>
    );
}
