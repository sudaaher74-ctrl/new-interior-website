const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'backend/routes/siteVisits.js');
let content = fs.readFileSync(filePath, 'utf8');

// Insert the new route before module.exports = router;
const newRoute = `
// Admin endpoint to update expense status
router.put('/expense/:id', auth, authorizeRoles('Admin', 'PM'), async (req, res) => {
  try {
    const { status, comment } = req.body;
    
    // Validate status
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    const visit = await SiteVisit.findById(req.params.id);
    if (!visit) {
      return res.status(404).json({ msg: 'Site visit / expense not found' });
    }

    visit.expenseStatus = status;
    visit.expenseAdminComment = comment || '';
    
    await visit.save();

    // Populate user and project for the response
    await visit.populate('user', 'fullName');
    await visit.populate('project', 'title name');

    res.json({ msg: 'Expense updated successfully', visit });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
`;

content = content.replace("module.exports = router;", newRoute);

fs.writeFileSync(filePath, content, 'utf8');
console.log('siteVisits.js updated with expense endpoint.');
