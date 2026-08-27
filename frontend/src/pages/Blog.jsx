import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { API_URL } from '../api/config';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useScrollReveal([posts]);
  useDocumentTitle(
    'Blog | Insights & Trends',
    'Read the latest insights, interior design trends, and company news from OS Interiors.'
  );

  useEffect(() => {
    axios.get(`${API_URL}/v2/blog`)
      .then(res => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load blog posts', err);
        setLoading(false);
      });
  }, []);

  return (
    <main>
      <section className="container mt-8 mb-12">
        <div className="reveal-stagger">
          <div className="eyebrow mb-4">Our Blog</div>
          <h1 className="h1-page mb-8">Insights & Perspectives</h1>
        </div>

        {loading ? (
          <p className="body-text reveal">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="body-text reveal">No articles published yet. Check back soon!</p>
        ) : (
          <div className="grid-3">
            {posts.map((post) => (
              <Link
                to={`/blog/${post.slug}`}
                key={post._id}
                className="reveal-stagger"
                style={{ display: 'block' }}
              >
                <div className="tile" style={{ aspectRatio: '16 / 9', marginBottom: '16px', background: 'var(--surface-sunken)' }}>
                  {post.coverImage ? (
                    <img src={post.coverImage} alt={post.title} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-meta)' }}>No Image</div>
                  )}
                </div>
                <h2 className="h4-card mb-1">{post.title}</h2>
                <div style={{ fontSize: '14px', color: 'var(--text-meta)' }}>
                  {new Date(post.createdAt).toLocaleDateString()} · By {post.author}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Blog;
