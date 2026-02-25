import { memo } from 'react';

const ChevronLeftIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="15 18 9 12 15 6" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const ITEMS_PER_PAGE = 20;

function Pagination({ total, page, onPageChange }) {
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    if (totalPages <= 1) return null;

    const pages = [];
    const delta = 2;
    const left = page - delta;
    const right = page + delta + 1;
    let l;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= left && i < right)) {
            pages.push(i);
        }
    }

    const result = [];
    for (const p of pages) {
        if (l) {
            if (p - l === 2) result.push(l + 1);
            else if (p - l > 2) result.push('...');
        }
        result.push(p);
        l = p;
    }

    return (
        <nav className="pagination" aria-label="Palette pagination" role="navigation">
            <button
                className="pagination-btn"
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                aria-label="Previous page"
            >
                <ChevronLeftIcon />
            </button>

            {result.map((p, i) =>
                p === '...' ? (
                    <span key={`ellipsis-${i}`} style={{ color: 'var(--text-tertiary)', padding: '0 4px', fontSize: 'var(--text-sm)' }}>…</span>
                ) : (
                    <button
                        key={p}
                        className={`pagination-btn ${page === p ? 'active' : ''}`}
                        onClick={() => onPageChange(p)}
                        aria-label={`Page ${p}`}
                        aria-current={page === p ? 'page' : undefined}
                    >
                        {p}
                    </button>
                )
            )}

            <button
                className="pagination-btn"
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                aria-label="Next page"
            >
                <ChevronRightIcon />
            </button>
        </nav>
    );
}

export { ITEMS_PER_PAGE };
export default memo(Pagination);
