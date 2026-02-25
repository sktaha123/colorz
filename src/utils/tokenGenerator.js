/**
 * UI System Token Generator
 * Derives a complete set of UI color tokens from a base brand color + mode
 */

// Hex <-> HSL conversion utilities
function hexToHSL(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const toHex = x => Math.round(x * 255).toString(16).padStart(2, '0');
    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

function derive(h, s, l) {
    const clamped_s = Math.max(0, Math.min(100, s));
    const clamped_l = Math.max(0, Math.min(100, l));
    return hslToHex(h, clamped_s, clamped_l);
}

function rgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}

export function generateTokens(baseColor, mode) {
    const { h, s, l } = hexToHSL(baseColor);
    const isDark = mode === 'dark';

    // Derived color scale
    const lighter = (amount) => derive(h, s, Math.min(l + amount, 95));
    const darker = (amount) => derive(h, s, Math.max(l - amount, 5));
    const desaturated = (amount) => derive(h, Math.max(s - amount, 0), l);
    const mid = derive(h, s, l);

    // Background scale
    const bg = isDark
        ? { base: derive(h, Math.max(s - 70, 5), 5), surface: derive(h, Math.max(s - 60, 5), 10), elevated: derive(h, Math.max(s - 50, 5), 15), border: derive(h, Math.max(s - 40, 5), 18) }
        : { base: '#FFFFFF', surface: derive(h, Math.max(s - 70, 3), 97), elevated: derive(h, Math.max(s - 60, 3), 95), border: derive(h, Math.max(s - 50, 5), 88) };

    // Accent scale
    const accent = mid;
    const accentLight = lighter(12);
    const accentLighter = lighter(25);

    // Track color (muted background for inputs)
    const track = isDark ? bg.elevated : bg.border;

    // Error color (fixed)
    const error = '#EF4444';
    const errorGlow = isDark ? 'rgba(239,68,68,0.5)' : 'rgba(239,68,68,0.3)';

    return {
        // Interactive & Form
        checkboxFill: accent,
        radioIndicator: accentLight,
        sliderThumb: accent,
        sliderTrack: track,
        switchHandle: isDark ? bg.elevated : '#FFFFFF',
        switchTrack: accent,
        fileUploadButton: bg.surface,
        autocompleteHighlight: isDark ? darker(10) : lighter(35),
        invalidFieldGlow: errorGlow,
        focusedInputBorder: accent,

        // Layout & Structural
        backdropTint: isDark ? rgba(bg.base, 0.8) : rgba('#FFFFFF', 0.85),
        columnDivider: bg.border,
        tableRowStripe: isDark ? bg.base : bg.surface,
        tableHeaderBg: bg.surface,
        tableCellBorder: bg.border,
        stickyHeaderShadow: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.08)',
        sidebarBorder: bg.border,
        cardFooterBg: bg.base,

        // Animation & Visual FX
        gradientStop1: accent,
        gradientStop2: derive(h + 30, s, l),
        skeletonBase: bg.border,
        skeletonHighlight: bg.elevated,
        buttonRipple: rgba(accent, isDark ? 0.3 : 0.15),
        insetBoxShadow: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)',
        dropShadow: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.08)',
        glowEffect: rgba(accent, 0.5),

        // System & Browser
        mobileAddressBar: isDark ? bg.base : '#FFFFFF',
        tapHighlight: rgba(accent, 0.15),
        scrollbarCorner: bg.base,
        caretColor: accent,
        progressBarFill: accent,
        progressBarTrack: track,
    };
}

// Token metadata — name, description, category, CSS variable name
export const TOKEN_METADATA = {
    // Interactive & Form
    checkboxFill: { label: 'Checkbox Fill', category: 'Interactive & Form', cssVar: '--checkbox-fill', description: 'Background color of checked checkboxes' },
    radioIndicator: { label: 'Radio Indicator', category: 'Interactive & Form', cssVar: '--radio-indicator', description: 'Filled dot color for selected radio buttons' },
    sliderThumb: { label: 'Slider Thumb', category: 'Interactive & Form', cssVar: '--slider-thumb', description: 'Handle color of range input sliders' },
    sliderTrack: { label: 'Slider Track', category: 'Interactive & Form', cssVar: '--slider-track', description: 'Background track of range inputs' },
    switchHandle: { label: 'Switch Handle', category: 'Interactive & Form', cssVar: '--switch-handle', description: 'Sliding knob of toggle switches' },
    switchTrack: { label: 'Switch Track', category: 'Interactive & Form', cssVar: '--switch-track', description: 'Track background when switch is on' },
    fileUploadButton: { label: 'File Upload Button', category: 'Interactive & Form', cssVar: '--file-upload-button', description: 'Background of file input trigger button' },
    autocompleteHighlight: { label: 'Autocomplete Highlight', category: 'Interactive & Form', cssVar: '--autocomplete-highlight', description: 'Background of hovered autocomplete items' },
    invalidFieldGlow: { label: 'Invalid Field Glow', category: 'Interactive & Form', cssVar: '--invalid-field-glow', description: 'Box-shadow glow on validation-failed fields' },
    focusedInputBorder: { label: 'Focused Input Border', category: 'Interactive & Form', cssVar: '--focused-input-border', description: 'Border color of focused form inputs' },

    // Layout & Structural
    backdropTint: { label: 'Backdrop Tint', category: 'Layout & Structural', cssVar: '--backdrop-tint', description: 'Backdrop-filter overlay for modals/drawers' },
    columnDivider: { label: 'Column Divider', category: 'Layout & Structural', cssVar: '--column-divider', description: 'Border color between columns or sections' },
    tableRowStripe: { label: 'Table Row Stripe', category: 'Layout & Structural', cssVar: '--table-row-stripe', description: 'Alternating row background (zebra striping)' },
    tableHeaderBg: { label: 'Table Header Background', category: 'Layout & Structural', cssVar: '--table-header-bg', description: 'Background of table header cells' },
    tableCellBorder: { label: 'Table Cell Border', category: 'Layout & Structural', cssVar: '--table-cell-border', description: 'Border color between table cells' },
    stickyHeaderShadow: { label: 'Sticky Header Shadow', category: 'Layout & Structural', cssVar: '--sticky-header-shadow', description: 'Box-shadow cast by sticky headers when scrolled' },
    sidebarBorder: { label: 'Sidebar Border', category: 'Layout & Structural', cssVar: '--sidebar-border', description: 'Border separating sidebar from main content' },
    cardFooterBg: { label: 'Card Footer Background', category: 'Layout & Structural', cssVar: '--card-footer-bg', description: 'Background of card footer sections' },

    // Animation & Visual FX
    gradientStop1: { label: 'Gradient Stop 1', category: 'Animation & Visual FX', cssVar: '--gradient-stop-1', description: 'First color stop for UI gradients' },
    gradientStop2: { label: 'Gradient Stop 2', category: 'Animation & Visual FX', cssVar: '--gradient-stop-2', description: 'Second color stop for UI gradients' },
    skeletonBase: { label: 'Skeleton Base', category: 'Animation & Visual FX', cssVar: '--skeleton-base', description: 'Base color of loading skeleton elements' },
    skeletonHighlight: { label: 'Skeleton Highlight', category: 'Animation & Visual FX', cssVar: '--skeleton-highlight', description: 'Shimmer highlight for skeleton loaders' },
    buttonRipple: { label: 'Button Ripple', category: 'Animation & Visual FX', cssVar: '--button-ripple', description: 'Color of click ripple effects on buttons' },
    insetBoxShadow: { label: 'Inset Box Shadow', category: 'Animation & Visual FX', cssVar: '--inset-box-shadow', description: 'Inset shadow for pressed/sunken elements' },
    dropShadow: { label: 'Drop Shadow Filter', category: 'Animation & Visual FX', cssVar: '--drop-shadow', description: 'CSS filter drop-shadow color' },
    glowEffect: { label: 'Glow Effect', category: 'Animation & Visual FX', cssVar: '--glow-effect', description: 'Neon glow box-shadow for highlighted elements' },

    // System & Browser
    mobileAddressBar: { label: 'Mobile Address Bar', category: 'System & Browser', cssVar: '--mobile-address-bar', description: 'Browser chrome color (theme-color meta tag)' },
    tapHighlight: { label: 'Tap Highlight', category: 'System & Browser', cssVar: '--tap-highlight', description: '-webkit-tap-highlight-color for mobile taps' },
    scrollbarCorner: { label: 'Scrollbar Corner', category: 'System & Browser', cssVar: '--scrollbar-corner', description: 'Corner piece where scrollbars meet' },
    caretColor: { label: 'Caret Color', category: 'System & Browser', cssVar: '--caret-color', description: 'Text cursor color in input fields' },
    progressBarFill: { label: 'Progress Bar Fill', category: 'System & Browser', cssVar: '--progress-bar-fill', description: 'Filled portion of progress/meter elements' },
    progressBarTrack: { label: 'Progress Bar Track', category: 'System & Browser', cssVar: '--progress-bar-track', description: 'Empty track of progress elements' },
};

export const TOKEN_CATEGORIES = [
    'Interactive & Form',
    'Layout & Structural',
    'Animation & Visual FX',
    'System & Browser',
];
