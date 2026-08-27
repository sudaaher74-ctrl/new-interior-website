const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'frontend/src/App.jsx');
let appContent = fs.readFileSync(appPath, 'utf8');

if (!appContent.includes("import Blog from './pages/Blog';")) {
  appContent = appContent.replace(
    "import ProjectDetail from './pages/ProjectDetail';",
    "import ProjectDetail from './pages/ProjectDetail';\nimport Blog from './pages/Blog';\nimport BlogPostDetail from './pages/BlogPostDetail';"
  );
  appContent = appContent.replace(
    "<Route path=\"/portfolio/:slug\" element={<ProjectDetail />} />",
    "<Route path=\"/portfolio/:slug\" element={<ProjectDetail />} />\n          <Route path=\"/blog\" element={<Blog />} />\n          <Route path=\"/blog/:slug\" element={<BlogPostDetail />} />"
  );
  fs.writeFileSync(appPath, appContent, 'utf8');
  console.log('App.jsx updated.');
}


const navPath = path.join(__dirname, 'frontend/src/components/Navbar.jsx');
let navContent = fs.readFileSync(navPath, 'utf8');

if (!navContent.includes('to="/blog"')) {
  navContent = navContent.replace(
    '<Link to="/portfolio" className={styles.navLink}>Portfolio</Link>',
    '<Link to="/portfolio" className={styles.navLink}>Portfolio</Link>\n          <Link to="/blog" className={styles.navLink}>Blog</Link>'
  );
  fs.writeFileSync(navPath, navContent, 'utf8');
  console.log('Navbar.jsx updated.');
}
