import React from 'react';

interface LiveAnnouncerProps {
  politeMessage: string;
  assertiveMessage: string;
}

export const LiveAnnouncer: React.FC<LiveAnnouncerProps> = ({
  politeMessage,
  assertiveMessage,
}) => {
  return (
    <div className="sr-only" aria-hidden="false">
      {/* Polite live region for standard feedback (filters, saved items, scale updates) */}
      <div
        id="aria-live-polite"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {politeMessage}
      </div>

      {/* Assertive live region for critical errors and network warnings */}
      <div
        id="aria-live-assertive"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        {assertiveMessage}
      </div>
    </div>
  );
};
