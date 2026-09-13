import { useEffect } from 'react';

/**
 * useSecureView — Step 14 interaction lockdown for secure document surfaces.
 *
 * While `active`, blocks at the document level:
 *   - contextmenu  -> right-click / long-press menu (Save image as, Copy, Inspect)
 *   - dblclick     -> double-click word/paragraph selection
 *   - selectstart  -> click-and-drag text selection
 *   - dragstart    -> dragging images/content out of the viewer
 *   - copy / cut   -> clipboard capture of vault content
 *   - Ctrl/Cmd + C, X, S, P, U -> copy/cut/save/print/view-source shortcuts
 *
 * Scoping: attach while the secure modal is open (active=true) and it
 * automatically releases everything on close/unmount — normal pages keep
 * full interactivity.
 *
 * NOTE: this is a front-end *deterrent* (raises the effort bar for casual
 * capture). It cannot stop a determined user with DevTools, screenshots, or
 * the browser's own PDF viewer toolbar — that layer is the backend's job
 * (PoLP + signed URLs + audit trail).
 */
export const useSecureView = (active = true) => {
  useEffect(() => {
    if (!active) return undefined;

    const blockEvent = (e) => e.preventDefault();
    const blockShortcut = (e) => {
      const key = (e.key || '').toLowerCase();
      if ((e.ctrlKey || e.metaKey) && ['c', 'x', 's', 'p', 'u'].includes(key)) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', blockEvent);
    document.addEventListener('dblclick', blockEvent);
    document.addEventListener('selectstart', blockEvent);
    document.addEventListener('dragstart', blockEvent);
    document.addEventListener('copy', blockEvent);
    document.addEventListener('cut', blockEvent);
    document.addEventListener('keydown', blockShortcut);

    return () => {
      document.removeEventListener('contextmenu', blockEvent);
      document.removeEventListener('dblclick', blockEvent);
      document.removeEventListener('selectstart', blockEvent);
      document.removeEventListener('dragstart', blockEvent);
      document.removeEventListener('copy', blockEvent);
      document.removeEventListener('cut', blockEvent);
      document.removeEventListener('keydown', blockShortcut);
    };
  }, [active]);
};
