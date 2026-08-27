const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'backend/server.js');
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes('/api/v2/portfolio')) {
  content = content.replace(
    "const projectsRouter = require('./routes/projects');",
    "const projectsRouter = require('./routes/projects');\nconst portfolioRouter = require('./routes/portfolio');"
  );
  content = content.replace(
    "app.use('/api/v2/projects', projectsRouter);",
    "app.use('/api/v2/projects', projectsRouter);\napp.use('/api/v2/portfolio', portfolioRouter);"
  );
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('server.js updated.');
} else {
  console.log('server.js already updated.');
}
