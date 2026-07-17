const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'routes');
const files = fs.readdirSync(routesDir);

for (const file of files) {
  if (file.endsWith('.js')) {
    const filePath = path.join(routesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace authAdmin
    content = content.replace(/const authAdmin = async \(req, res, next\) => \{[\s\S]*?\n\};\n/g, 
`const authAdmin = async (req, res, next) => {
  req.user = { role: 'Super Admin', id: 'dummy_admin_id' };
  next();
};\n`);

    // Replace auth (async version)
    content = content.replace(/const auth = async \(req, res, next\) => \{[\s\S]*?\n\};\n/g, 
`const auth = async (req, res, next) => {
  req.user = { role: 'Employee', id: 'dummy_employee_id' };
  next();
};\n`);

    // Replace auth (non-async version in reports.js)
    content = content.replace(/const auth = \(req, res, next\) => \{[\s\S]*?\n\};\n/g, 
`const auth = (req, res, next) => {
  req.user = { role: 'Employee', id: 'dummy_employee_id' };
  next();
};\n`);

    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
}
