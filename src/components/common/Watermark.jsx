import React, { useMemo } from 'react';

/**
 * Watermark — CSS-only identity stamp for secure document surfaces.
 *
 * How it works (pure CSS, no canvas / no per-frame JS):
 *  1. A repeating diagonal tile pattern is rendered as an inline SVG
 *     `data:image/svg+xml` background-image. The browser paints it as a
 *     repeating background — cheap, crisp at any DPI, and unaffected by
 *     the underlying content.
 *  2. A single large centered diagonal stamp adds the primary label.
 *  3. Hardening properties:
 *       - pointer-events: none  -> overlay can never block clicks
 *       - user-select: none     -> watermark text can't be selected/copied
 *       - aria-hidden="true"    -> invisible to screen readers (noise text)
 *       - high z-index          -> sits above content, below modals' chrome
 *
 * NOTE: a CSS watermark is a *deterrent + traceability* control, not a
 * cryptographic one — it identifies the viewer on screen and in screenshots,
 * it does not encrypt the asset (that is the backend's job).
 */

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildTileDataUri(primary, secondary, fontSize, color, opacity, step) {
  // Rotated repeating text tile, encoded as an SVG data URI.
  // NOTE: primary/secondary are XML-escaped — the identity line contains
  // literal < > around the email, which would otherwise break the SVG.
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + step + '" height="' + step + '">' +
    '<text x="50%" y="50%" fill="' + color + '" fill-opacity="' + opacity + '" ' +
    'font-family="monospace" font-size="' + fontSize + '" text-anchor="middle" ' +
    'transform="rotate(-30 50 50)" dominant-baseline="middle">' +
    escapeXml(primary) +
    (secondary
      ? '<tspan x="50%" dy="' + (fontSize + 4) + '">' + escapeXml(secondary) + '</tspan>'
      : '') +
    '</text></svg>';
  return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
}

export const Watermark = ({
  text,
  subText,
  stampLabel = 'CONFIDENTIAL',
  opacity = 0.07,
  stampOpacity = 0.08,
  tileStep = 190,
  fontSize = 12,
  color = '#8ea6c8',
  stampColor = '#f5b726',
}) => {
  // Memoize the data URI so re-renders of the parent don't re-encode the SVG.
  const tileImage = useMemo(
    () => buildTileDataUri(text || 'DIGILEGAL VAULT', subText, fontSize, color, opacity, tileStep),
    [text, subText, fontSize, color, opacity, tileStep]
  );

  if (!text) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        pointerEvents: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        overflow: 'hidden',
        backgroundImage: tileImage,
        backgroundRepeat: 'repeat',
      }}
    >
      {/* Large centered diagonal stamp */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(-30deg)',
          whiteSpace: 'nowrap',
          fontFamily: 'var(--font-mono, monospace)',
          fontWeight: 800,
          fontSize: '2rem',
          letterSpacing: '0.18em',
          color: stampColor,
          opacity: stampOpacity,
          textShadow: '0 0 1px rgba(0,0,0,0.4)',
          border: '3px solid ' + stampColor,
          borderRadius: '10px',
          padding: '8px 28px',
        }}
      >
        {stampLabel}
      </div>
    </div>
  );
};

/**
 * Convenience hook-style helper: composes the two watermark lines from the
 * authenticated user + the document being inspected, with an access
 * timestamp. Kept next to the component so every viewer stamps identically.
 */
export function buildWatermarkText(user, doc, accessedAt = new Date()) {
  const who = user
    ? [user.name, user.email].filter(Boolean).join(' <') + (user.email ? '>' : '')
    : 'ANONYMOUS';
  const role = user?.role ? ' [' + String(user.role).toUpperCase() + ']' : '';
  const docRef = doc ? ' • ' + (doc.caseId || 'case?') + ' / ' + (doc.id || 'doc?') : '';
  const when = ' • ' + accessedAt.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
  return { primary: who + role, secondary: docRef + when };
}
