import { useState, useMemo, useCallback, useEffect, lazy, Suspense, useDeferredValue } from 'react';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import PaletteCard from './components/features/PaletteCard';
import UISystemCard from './components/features/UISystemCard';
import Pagination, { ITEMS_PER_PAGE } from './components/features/Pagination';
import Toast, { useToasts } from './components/features/Toast';

const UISystemDrawer = lazy(() => import('./components/features/UISystemDrawer'));
const UIGenerator = lazy(() => import('./components/systems/UIGenerator'));
import { STANDARD_PALETTES } from './data/standardPalettes';
import { UI_SYSTEM_PALETTES } from './data/uiSystemPalettes';
import './index.css';

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'likes', label: 'Most Liked' },
];

export default function App() {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('standard'); // 'standard' | 'ui-system' | 'generator'
  const [sort, setSort] = useState('popular');
  const [page, setPage] = useState(1);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Saved state (persisted in localStorage)
  const [savedPalettes, setSavedPalettes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('colorz_saved_palettes') || '[]');
    } catch { return []; }
  });
  const [savedUISystems, setSavedUISystems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('colorz_saved_ui_systems') || '[]');
    } catch { return []; }
  });

  const { toasts, addToast } = useToasts();

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('colorz_saved_palettes', JSON.stringify(savedPalettes));
  }, [savedPalettes]);

  useEffect(() => {
    localStorage.setItem('colorz_saved_ui_systems', JSON.stringify(savedUISystems));
  }, [savedUISystems]);

  // Reset page and close sidebar on filter change
  useEffect(() => {
    setPage(1);
    setIsSidebarOpen(false);
  }, [search, activeCategory, sort, activeTab]);

  const togglePaletteSave = useCallback((id) => {
    const isSaved = savedPalettes.includes(id);
    addToast(isSaved ? 'Palette removed from collection' : 'Palette saved to collection');
    setSavedPalettes(prev => isSaved ? prev.filter(i => i !== id) : [...prev, id]);
  }, [addToast, savedPalettes]);

  const toggleUISystemSave = useCallback((id) => {
    const isSaved = savedUISystems.includes(id);
    addToast(isSaved ? 'UI System removed from collection' : 'UI System saved to collection');
    setSavedUISystems(prev => isSaved ? prev.filter(i => i !== id) : [...prev, id]);
  }, [addToast, savedUISystems]);

  const handleCategoryChange = useCallback((category, tab) => {
    setActiveCategory(category);
    setActiveTab(tab);
    setPage(1);
    setIsSidebarOpen(false);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    if (activeTab === 'generator') {
      setActiveTab('standard');
      setActiveCategory('all');
    }
  }, [activeTab]);

  // Filtered + sorted standard palettes
  const filteredPalettes = useMemo(() => {
    let data = STANDARD_PALETTES;

    // Filter by category
    if (activeCategory === 'saved') {
      data = data.filter(p => savedPalettes.includes(p.id));
    } else if (activeCategory !== 'all' && activeCategory !== 'ui-system' && activeCategory !== 'generator' && activeCategory !== 'saved-ui') {
      data = data.filter(p => p.tags.includes(activeCategory));
    }

    // Filter by search (match hex colors or tags)
    if (deferredSearch.trim()) {
      const q = deferredSearch.trim().toLowerCase();
      data = data.filter(p =>
        p.colors.some(c => c.toLowerCase().includes(q)) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.id.toString().includes(q)
      );
    }

    // Sort
    switch (sort) {
      case 'likes': data = [...data].sort((a, b) => b.likes - a.likes); break;
      case 'newest': data = [...data].sort((a, b) => b.id - a.id); break;
      case 'popular': default: data = [...data].sort((a, b) => b.likes - a.likes); break;
    }

    return data;
  }, [activeCategory, deferredSearch, sort, savedPalettes]);

  // Filtered UI system palettes
  const filteredUISystems = useMemo(() => {
    let data = UI_SYSTEM_PALETTES;

    if (activeCategory === 'saved-ui') {
      data = data.filter(s => savedUISystems.includes(s.id));
    }

    if (deferredSearch.trim()) {
      const q = deferredSearch.trim().toLowerCase();
      data = data.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.mode.includes(q)
      );
    }
    return data;
  }, [deferredSearch, activeCategory, savedUISystems]);

  // Paginated palettes
  const pagedPalettes = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredPalettes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPalettes, page]);

  const handleCopy = useCallback((color, message) => {
    addToast(message || `Copied ${color}`, color);
  }, [addToast]);

  const handleOpenSystem = useCallback((system) => {
    setSelectedSystem(system);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setSelectedSystem(null);
  }, []);

  // Total count for navbar
  const totalCount = STANDARD_PALETTES.length + UI_SYSTEM_PALETTES.length;

  // Determine content
  const isUISystem = activeTab === 'ui-system' || activeCategory === 'saved-ui';
  const isGenerator = activeTab === 'generator';
  const isStandard = activeTab === 'standard' || activeCategory === 'saved';

  // Content header text
  const getHeaderText = () => {
    if (isGenerator) return { title: 'UI System Generator', subtitle: 'Generate complete design token systems from any brand color' };
    if (activeCategory === 'saved-ui') return { title: 'Saved UI Systems', subtitle: `${filteredUISystems.length} saved layouts in your collection` };
    if (activeCategory === 'saved') return { title: 'Saved Palettes', subtitle: `${filteredPalettes.length} palettes in your collection` };
    if (isUISystem) return { title: 'UI System Palettes', subtitle: `${filteredUISystems.length} pre-built system token sets` };
    const cat = activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);
    return { title: `${cat === 'All' ? 'All' : cat} Palettes`, subtitle: `${filteredPalettes.length} color palettes` };
  };

  const headerText = getHeaderText();

  return (
    <>
      <Navbar
        search={search}
        onSearch={handleSearchChange}
        totalCount={totalCount}
        onToggleSidebar={toggleSidebar}
      />

      <div className="app-layout">
        <Sidebar
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          activeTab={activeTab}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          savedPaletteCount={savedPalettes.length}
          savedUISystemCount={savedUISystems.length}
        />

        <main className="main-content" id="main-content" tabIndex={-1}>
          {/* Content header */}
          <div className="content-header">
            <div>
              <h1 className="content-title">{headerText.title}</h1>
              <p className="content-subtitle">{headerText.subtitle}</p>
            </div>
          </div>

          {/* Filter bar — only for standard palettes */}
          {isStandard && (
            <div className="filter-bar" role="toolbar" aria-label="Sort and filter options">
              <label htmlFor="sort-select" className="sr-only">Sort by</label>
              <select
                id="sort-select"
                className="filter-select"
                value={sort}
                onChange={e => setSort(e.target.value)}
                aria-label="Sort palettes"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                {filteredPalettes.length} results
              </span>
            </div>
          )}

          {/* Generator Tab */}
          {isGenerator && (
            <div style={{ padding: '0 var(--space-6)' }}>
              <Suspense fallback={<div className="loading-shimmer" style={{ height: 400, borderRadius: 'var(--radius-lg)' }} />}>
                <UIGenerator />
              </Suspense>
            </div>
          )}

          {/* UI System Tab */}
          {isUISystem && (
            <>
              {filteredUISystems.length > 0 ? (
                <div className="palette-grid ui-systems-grid">
                  {filteredUISystems.map(system => (
                    <UISystemCard
                      key={system.id}
                      system={system}
                      onOpen={handleOpenSystem}
                      onCopy={handleCopy}
                      isSaved={savedUISystems.includes(system.id)}
                      onSave={() => toggleUISystemSave(system.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-title">No systems found</div>
                  <p className="empty-state-desc">Try a different search term or save some systems</p>
                </div>
              )}
            </>
          )}

          {/* Standard Palettes Tab */}
          {isStandard && (
            <>
              {pagedPalettes.length > 0 ? (
                <>
                  <div className="palette-grid">
                    {pagedPalettes.map(palette => (
                      <PaletteCard
                        key={palette.id}
                        palette={palette}
                        onCopy={handleCopy}
                        isSaved={savedPalettes.includes(palette.id)}
                        onSave={() => togglePaletteSave(palette.id)}
                      />
                    ))}
                  </div>
                  <Pagination
                    total={filteredPalettes.length}
                    page={page}
                    onPageChange={setPage}
                  />
                </>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-title">No palettes found</div>
                  <p className="empty-state-desc">
                    Try a different search term or save some palettes
                  </p>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* UI System Drawer */}
      {selectedSystem && (
        <Suspense fallback={null}>
          <UISystemDrawer
            system={selectedSystem}
            onClose={handleCloseDrawer}
          />
        </Suspense>
      )}

      {/* Toast notifications */}
      <Toast toasts={toasts} />
    </>
  );
}
