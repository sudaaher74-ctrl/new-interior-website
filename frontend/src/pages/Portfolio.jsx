import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';

const projectsData = [
  { id: 1, title: 'Bombay Barbeque', category: 'Restaurants', meta: 'Restaurant · Malad', img: '/images/bombayB1.jpeg' },
  { id: 2, title: 'NETWIN Ventures', category: 'Offices', meta: 'Corporate office · CBD Belapur', img: '/images/BelapurC2.jpeg' },
  { id: 3, title: '99 Wok Street', category: 'Restaurants', meta: 'Restaurant · Kandivali', img: '/images/Kandivali!.jpeg' },
  { id: 4, title: 'Juice Crush', category: 'Retail', meta: 'QSR outlets · Kandivali & Kurla', img: '/images/juice1.jpeg' },
  { id: 5, title: 'RadhaKrishna Cuisine', category: 'Restaurants', meta: 'Restaurant · Bhayandar', img: '/images/caffe.jpeg' },
  { id: 6, title: 'Boomerang Park', category: 'Hospitality', meta: 'Hospitality · Sakinaka', img: '/images/IMG_2698.JPG' },
  { id: 7, title: 'La Loco Grill', category: 'Restaurants', meta: 'Restaurant · Thane', img: '/images/bombayB2.jpeg' },
  { id: 8, title: 'Caravan Menu', category: 'Restaurants', meta: 'Restaurant · Thane', img: '/images/caravab1.jpeg' },
  { id: 9, title: 'Exterior & Facade Work', category: 'Exteriors', meta: 'ACP cladding & elevation · Mumbai', img: '/images/IMG_2696.JPG' },
];

const Portfolio = () => {
  useScrollReveal();
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Restaurants', 'Offices', 'Retail', 'Healthcare', 'Hospitality', 'Exteriors'];
  
  const filteredProjects = activeFilter === 'All' 
    ? projectsData 
    : projectsData.filter(p => p.category === activeFilter);

  return (
    <main>
      <section className="container mt-8 mb-12 reveal">
        <div className="eyebrow mb-4">PORTFOLIO</div>
        <h1 className="h1-page mb-8">Our portfolio of pioneering design</h1>
        
        <div className="flex gap-2 flex-wrap mb-12">
          {filters.map(filter => (
            <button 
              key={filter} 
              onClick={() => setActiveFilter(filter)}
              className={activeFilter === filter ? "chip" : "chip-outline"}
              style={activeFilter === filter ? { backgroundColor: '#1a1a18', color: '#fff' } : {}}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid-3">
          {filteredProjects.map(project => (
            <Link to={`/portfolio/${project.id}`} key={project.id} className="reveal" style={{ display: 'block' }}>
              <div style={{ height: '300px', marginBottom: '16px', position: 'relative' }}>
                <img src={project.img} alt={project.title} className="img-rounded" style={{ height: '100%' }} />
              </div>
              <h4 className="h4-card mb-1">{project.title}</h4>
              <div className="body-text" style={{ fontSize: '14px', color: 'var(--text-meta)' }}>{project.meta}</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Portfolio;
