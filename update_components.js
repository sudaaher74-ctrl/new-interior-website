const fs = require('fs');
const path = require('path');

// 1. Update Portfolio.jsx
const portfolioPath = path.join(__dirname, 'frontend/src/pages/Portfolio.jsx');
if (fs.existsSync(portfolioPath)) {
  let content = fs.readFileSync(portfolioPath, 'utf8');
  content = content.replace(
    /alt=\{project\.title\}/g,
    "alt={project.altText || project.title}"
  );
  fs.writeFileSync(portfolioPath, content, 'utf8');
  console.log('Portfolio.jsx updated.');
}

// 2. Update ProjectDetail.jsx
const projectDetailPath = path.join(__dirname, 'frontend/src/pages/ProjectDetail.jsx');
if (fs.existsSync(projectDetailPath)) {
  let content = fs.readFileSync(projectDetailPath, 'utf8');
  content = content.replace(
    /alt=\{project\.title\}/g,
    "alt={project.altText || project.title}"
  );
  
  // also pass image to useDocumentTitle
  content = content.replace(
    "useDocumentTitle(`${project.title} | Portfolio`, `View our turnkey interior project: ${project.title} located in ${project.location}.`);",
    "useDocumentTitle(`${project.title} | Portfolio`, `View our turnkey interior project: ${project.title} located in ${project.location}.`, project.img);"
  );

  fs.writeFileSync(projectDetailPath, content, 'utf8');
  console.log('ProjectDetail.jsx updated.');
}
