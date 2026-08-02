import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { projects, FILTERS } from '../data/projects';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  useScrollReveal([activeFilter]);
  useDocumentTitle(
    'Portfolio',
    'Trading spaces we designed, engineered and built across dining, workplace, retail and care in Mumbai.'
  );

  const filtered =
    activeFilter === 'All'
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <main>
      <section className="container mt-8 mb-12">
        <div className="reveal">
          <div className="eyebrow mb-4">Portfolio</div>
          <h1 className="h1-page mb-8">Our portfolio of pioneering design</h1>
        </div>

        <div className="flex gap-2 flex-wrap mb-12 reveal" role="group" aria-label="Filter projects by sector">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                aria-pressed={isActive}
                className={isActive ? 'chip chip-active' : 'chip-outline'}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <p className="body-text reveal">
            No projects listed under {activeFilter} yet.{' '}
            <button
              type="button"
              onClick={() => setActiveFilter('All')}
              style={{ fontWeight: 700, color: 'var(--accent-deep)', textDecoration: 'underline' }}
            >
              Show all projects
            </button>
          </p>
        ) : (
          <div className="grid-3">
            {filtered.map((project) => (
              <Link
                to={`/portfolio/${project.slug}`}
                key={project.slug}
                className="reveal"
                style={{ display: 'block' }}
              >
                <div className="tile" style={{ aspectRatio: '4 / 3', marginBottom: '16px' }}>
                  <img src={project.img} alt={project.title} loading="lazy" decoding="async" />
                </div>
                <h2 className="h4-card mb-1">{project.title}</h2>
                <div style={{ fontSize: '14px', color: 'var(--text-meta)' }}>{project.meta}</div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Portfolio;
