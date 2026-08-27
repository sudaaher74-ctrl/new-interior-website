const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/pages/AdminDashboard.jsx');
const content = fs.readFileSync(filePath, 'utf8');

const match = content.match(/const renderLeadsTab = \(\) => {[\s\S]*?};/);
if (match) {
  console.log(match[0]);
} else {
  console.log("Could not find renderLeadsTab");
}
