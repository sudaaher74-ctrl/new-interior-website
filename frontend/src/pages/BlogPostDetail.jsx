import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { API_URL } from '../api/config';
import StructuredData from '../components/StructuredData';

const BlogPostDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useScrollReveal([post]);
  
  // Dynamic SEO
  useDocumentTitle(
    post ? \`\${post.title} | OS Interiors Blog\` : 'Loading Post...',
    post ? post.content.substring(0, 150) + '...' : ''
  );

  useEffect(() => {
    axios.get(\`\${API_URL}/v2/blog/\${slug}\`)
      .then(res => {
        setPost(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load blog post', err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <main style={{padding: '120px 20px', textAlign: 'center'}}>Loading article...</main>;
  
  if (!post) return (
    <main style={{padding: '120px 20px', textAlign: 'center'}}>
      <h1>Article not found</h1>
      <Link to="/blog" style={{ color: 'var(--accent-deep)', textDecoration: 'underline' }}>Back to Blog</Link>
    </main>
  );

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.coverImage ? [post.coverImage] : [],
    "datePublished": new Date(post.createdAt).toISOString(),
    "dateModified": new Date(post.updatedAt).toISOString(),
    "author": [{
        "@type": "Person",
        "name": post.author
    }]
  };

  return (
    <main>
      <StructuredData id="ld-article" data={articleSchema} />
      <article className="container mt-8 mb-12" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="reveal-stagger" style={{ textAlign: 'center' }}>
          <div className="eyebrow mb-4">
            <Link to="/blog" style={{ color: 'var(--text-meta)' }}>← Back to Blog</Link>
          </div>
          <h1 className="h1-page mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>{post.title}</h1>
          <div style={{ color: 'var(--text-meta)', marginBottom: '2rem' }}>
            By {post.author} · {new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>

        {post.coverImage && (
          <div className="reveal" style={{ width: '100%', height: '400px', marginBottom: '3rem', borderRadius: '12px', overflow: 'hidden' }}>
            <img src={post.coverImage} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        <div className="reveal body-text" style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>
          {/* We use ReactMarkdown to render the content, since the admin writes markdown */}
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
        
        {post.tags && post.tags.length > 0 && (
          <div className="reveal mt-8 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
            <h4 style={{ marginBottom: '1rem' }}>Tags:</h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {post.tags.map(tag => (
                <span key={tag} style={{ background: 'var(--surface-sunken)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.85rem' }}>{tag}</span>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  );
};

export default BlogPostDetail;
