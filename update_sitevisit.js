const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'backend/models/SiteVisit.js');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  "expenseDescription: { type: String },",
  `expenseDescription: { type: String },
  expenseStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  expenseAdminComment: { type: String },`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('SiteVisit.js updated.');
