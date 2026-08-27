const fs = require('fs');
const path = require('path');

const portfolioPath = path.join(__dirname, 'frontend/src/pages/Portfolio.jsx');
let portfolioContent = fs.readFileSync(portfolioPath, 'utf8');

portfolioContent = portfolioContent.replace(
  "import { projects, FILTERS } from '../data/projects';",
  `import { FILTERS } from '../data/projects';\nimport axios from 'axios';\nimport { useEffect } from 'react';\nimport { API_URL } from '../api/config';`
);

portfolioContent = portfolioContent.replace(
  "const [activeFilter, setActiveFilter] = useState('All');",
  `const [activeFilter, setActiveFilter] = useState('All');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(\`\${API_URL}/v2/portfolio\`)
      .then(res => { setProjects(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);`
);

portfolioContent = portfolioContent.replace(
  "<div className=\"flex gap-2 flex-wrap mb-12 reveal-stagger\" role=\"group\" aria-label=\"Filter projects by sector\">",
  `{loading ? <p>Loading portfolio...</p> : null}
        <div className="flex gap-2 flex-wrap mb-12 reveal-stagger" role="group" aria-label="Filter projects by sector">`
);

fs.writeFileSync(portfolioPath, portfolioContent, 'utf8');


const detailPath = path.join(__dirname, 'frontend/src/pages/ProjectDetail.jsx');
let detailContent = fs.readFileSync(detailPath, 'utf8');

detailContent = detailContent.replace(
  "import { getProject } from '../data/projects';",
  `import axios from 'axios';\nimport { useEffect, useState } from 'react';\nimport { API_URL } from '../api/config';`
);

detailContent = detailContent.replace(
  "const project = getProject(slug);",
  `const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(\`\${API_URL}/v2/portfolio/\${slug}\`)
      .then(res => { setProject(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [slug]);`
);

detailContent = detailContent.replace(
  "if (!project) {",
  `if (loading) return <main style={{padding: '120px 20px', textAlign: 'center'}}>Loading project details...</main>;
  if (!project) {`
);


fs.writeFileSync(detailPath, detailContent, 'utf8');
console.log('Portfolio pages updated.');
