import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Photo from '../components/Photo';
import { getProject } from '../data/projects';

const SpecRow = ({ label, value }) => (
  <div className="spec-row">
    <span className="eyebrow" style={{ color: 'var(--text-primary)' }}>{label}</span>
    <span style={{ fontWeight: 500, color: 'var(--text-primary)', textAlign: 'right' }}>{value}</span>
  </div>
);

const ProjectDetail = () => {
  const { id } = useParams();
  const project = getProject(id);
  useScrollReveal([id]);
  // Called before the not-found return so the hook order stays stable.
  useDocumentTitle(
    project ? `${project.title}, ${project.location}` : 'Project not found',
    project
      ? `${project.sector} project in ${project.location} — delivered as a ${project.scope.toLowerCase()} contract by OS Interiors.`
      : undefined
  );

  if (!project) {
    return (
      <main>
        <section className="container mt-8 mb-12">
          <h1 className="h1-page mb-4">Project not found</h1>
          <p className="body-large mb-8">That project isn’t in our portfolio.</p>
          <Link to="/portfolio" className="btn-primary">Back to portfolio</Link>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="container mt-8 mb-8">
        <Link
          to="/portfolio"
          className="link-arrow" style={{ marginBottom: '32px', display: 'inline-block' }}
        >
          ← Back to portfolio
        </Link>

        <Photo
          src={project.img}
          alt={`${project.title} — ${project.sector}, ${project.location}`}
          ratio="16 / 9"
          className="reveal"
          priority
          style={{ marginBottom: '64px', borderRadius: 'var(--radius-lg)' }}
        />

        <div className="grid-2 mb-12">
          <div className="reveal">
            <h1 className="h1-page mb-6">
              {project.title}, {project.location}
            </h1>
            {project.body ? (
              project.body.map((para, i) => (
                <p key={i} className="body-large mb-4">{para}</p>
              ))
            ) : (
              <p className="body-large mb-4">
                {project.sector} project in {project.location}, delivered as a {project.scope.toLowerCase()} contract —
                design, engineering and execution handled by one accountable team.
              </p>
            )}
          </div>

          <div className="reveal" style={{ backgroundColor: 'var(--surface-block)', borderRadius: 'var(--radius-lg)', padding: '48px' }}>
            <SpecRow label="Sector" value={project.sector} />
            <SpecRow label="Scope" value={project.scope} />
            <SpecRow label="Location" value={`${project.location}, Mumbai`} />
            <SpecRow label="Status" value={project.status} />

            <div className="eyebrow mb-4 mt-8" style={{ color: 'var(--text-primary)' }}>Delivered</div>
            <div className="flex gap-2 flex-wrap">
              {project.delivered.map((item) => (
                <span key={item} className="chip chip-light">{item}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid-2 mb-8">
          {project.gallery.map((src, i) => (
            <div key={src + i} className="tile reveal" style={{ height: '420px' }}>
              <img src={src} alt={`${project.title} interior view ${i + 1}`} loading="lazy" />
            </div>
          ))}
        </div>

        <div className="tile reveal" style={{ height: '520px', borderRadius: 'var(--radius-lg)' }}>
          <img src={project.galleryWide} alt={`${project.title} — wide view`} loading="lazy" />
        </div>
      </section>
    </main>
  );
};

export default ProjectDetail;
