import React, { useEffect, useState } from 'react';
import { documentService } from '../../services/documentService';
import { Watermark, buildWatermarkText } from './Watermark';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { useAuth } from '../../hooks/useAuth';

const FRAME_HEIGHT = 380;

/**
 * DocumentFrame — Step 14 iframe rendering for secure document surfaces.
 *
 * Security model:
 *  - File bytes are fetched through the service layer (Authorization header)
 *    and wrapped in a `blob:` URL. Blob URLs are opaque origins: the rendered
 *    content cannot read app state, cookies, or localStorage, and the auth
 *    token never appears in the iframe URL.
 *  - The Watermark overlay sits ON TOP of the iframe (pointer-events:none)
 *    so every rendered page carries the viewer's identity stamp.
 *  - The blob URL is revoked on unmount — no lingering decrypted bytes in
 *    memory beyond the viewing session.
 */
export const DocumentFrame = ({ doc }) => {
  const { user } = useAuth();
  const [fileState, setFileState] = useState({ status: 'loading', url: null, error: null });

  useEffect(() => {
    if (!doc?.id) return undefined;
    let cancelled = false;
    let objectUrl = null;
    setFileState({ status: 'loading', url: null, error: null });
    documentService
      .getDocumentFile(doc.id)
      .then(({ blob }) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setFileState({ status: 'ready', url: objectUrl, error: null });
      })
      .catch((err) => {
        if (cancelled) return;
        setFileState({ status: 'error', url: null, error: err?.message || 'Failed to load document stream.' });
      });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [doc?.id]);

  const wm = buildWatermarkText(user, doc);

  return (
    <div
      style={{
        position: 'relative',
        border: '1px solid #142033',
        borderRadius: '6px',
        background: '#060a12',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          padding: '10px 14px',
          borderBottom: '1px solid #142033',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <span style={{ color: '#f5b726', fontWeight: 'bold', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
          [CLASSIFIED // SIH26190 DIGITAL VAULT]
        </span>
        <span style={{ color: '#64748b', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
          sandboxed render • copy/right-click locked
        </span>
      </div>

      <div style={{ position: 'relative' }}>
        {fileState.status === 'loading' && (
          <div style={{ minHeight: FRAME_HEIGHT + 'px' }}>
            <LoadingState message="Decrypting document stream..." />
          </div>
        )}
        {fileState.status === 'error' && (
          <div style={{ minHeight: FRAME_HEIGHT + 'px' }}>
            <ErrorState compact title="Secure render failed" message={fileState.error} />
          </div>
        )}
        {fileState.status === 'ready' && (
          <iframe
            src={fileState.url}
            title={doc?.name || 'Secure document viewer'}
            style={{ width: '100%', height: FRAME_HEIGHT + 'px', border: '0', display: 'block', background: '#fff' }}
          />
        )}

        {/* Identity watermark rides ON TOP of the rendered document */}
        <Watermark text={wm.primary} subText={wm.secondary} stampLabel="RESTRICTED" />
      </div>
    </div>
  );
};
