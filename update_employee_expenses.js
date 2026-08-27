const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/pages/EmployeeDashboard.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update the expenses table headers
content = content.replace(
  "<th style={{ padding: '8px' }}>Description</th>",
  `<th style={{ padding: '8px' }}>Description</th>
                        <th style={{ padding: '8px' }}>Status</th>
                        <th style={{ padding: '8px' }}>Notes</th>`
);

// 2. Update the expenses table rows
content = content.replace(
  "<td style={{ padding: '8px' }}>{v.expenseDescription}</td>",
  `<td style={{ padding: '8px' }}>{v.expenseDescription}</td>
                          <td style={{ padding: '8px' }}>
                            <span style={{ 
                              padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem',
                              background: (v.expenseStatus || 'Pending') === 'Approved' ? 'rgba(16, 185, 129, 0.2)' : (v.expenseStatus || 'Pending') === 'Rejected' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                              color: (v.expenseStatus || 'Pending') === 'Approved' ? '#10b981' : (v.expenseStatus || 'Pending') === 'Rejected' ? '#ef4444' : '#f59e0b'
                            }}>
                              {v.expenseStatus || 'Pending'}
                            </span>
                          </td>
                          <td style={{ padding: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{v.expenseAdminComment || '-'}</td>`
);


fs.writeFileSync(filePath, content, 'utf8');
console.log('EmployeeDashboard.jsx expenses updated.');
