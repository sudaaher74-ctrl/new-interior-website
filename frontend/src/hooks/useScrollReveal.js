import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Fade-and-rise scroll reveals for any element carrying `.reveal`.
 *
 * Re-runs on route change, and on any extra dependencies passed in — pass the
 * things that add or replace `.reveal` nodes (e.g. an active filter) so newly
 * mounted cards get observed rather than staying invisible.
 */
export function useScrollReveal(deps = []) {
  const { pathname } = useLocation();

  useEffect(() => {
    const nodes = () => Array.from(document.querySelectorAll('.reveal:not(.is-visible)'));

    // Honour the OS "reduce motion" setting: show everything, skip the animation.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      nodes().forEach((el) => el.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Reveal is one-way — stop watching once it has played.
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    // Let the incoming page paint before we measure it.
    const timer = setTimeout(() => nodes().forEach((el) => observer.observe(el)), 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, ...deps]);
}
