import { useEffect } from 'react';

/**
 * Injects a JSON-LD block for the page and removes it on unmount.
 *
 * Search engines use this to render rich results — for a local contractor the
 * LocalBusiness record (address, phone, hours, service area) and the FAQ block
 * are the two that actually show up in listings.
 */
const StructuredData = ({ id, data }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    return () => script.remove();
  }, [id, data]);

  return null;
};

export default StructuredData;
