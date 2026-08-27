import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import StructuredData from '../components/StructuredData';
import { collectionSchema } from '../data/business';
import { FILTERS } from '../data/projects';
import axios from 'axios';
import { useEffect } from 'react';
import { API_URL } from '../api/config';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/v2/portfolio`)
      .then(res => { setProjects(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);
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
      <StructuredData id="ld-collection" data={collectionSchema(projects)} />
      <section className="container mt-8 mb-12">
        <div className="reveal-stagger">
          <div className="eyebrow mb-4">Portfolio</div>
          <h1 className="h1-page mb-8">Our portfolio of pioneering design</h1>
        </div>

        {loading ? <p>Loading portfolio...</p> : null}
        <div className="flex gap-2 flex-wrap mb-12 reveal-stagger" role="group" aria-label="Filter projects by sector">
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
                className="reveal-stagger"
                style={{ display: 'block' }}
              >
                <div className="tile" style={{ aspectRatio: '16 / 9', marginBottom: '16px' }}>
                  <img src={project.img} alt={project.altText || project.title} loading="lazy" decoding="async" />
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
