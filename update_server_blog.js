const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'backend/server.js');
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes('/api/v2/blog')) {
  content = content.replace(
    "const portfolioRouter = require('./routes/portfolio');",
    "const portfolioRouter = require('./routes/portfolio');\nconst blogRouter = require('./routes/blog');"
  );
  content = content.replace(
    "app.use('/api/v2/portfolio', portfolioRouter);",
    "app.use('/api/v2/portfolio', portfolioRouter);\napp.use('/api/v2/blog', blogRouter);"
  );
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('server.js updated.');
} else {
  console.log('server.js already updated.');
}
