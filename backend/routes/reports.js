const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { auth } = require('../middleware/auth');

function formatReport(row) {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    user: row.user_id,
    project: row.project_id,
    workCompleted: row.work_completed,
    materialUsed: row.material_used,
    workersPresent: row.workers_present,
    issuesFound: row.issues_found,
    clientFeedback: row.client_feedback,
    tomorrowPlan: row.tomorrow_plan,
    media: row.media || [],
    createdAt: row.created_at,
  };
}

// Submit Daily Work Report
router.post('/', auth, async (req, res) => {
  const { projectId, workCompleted, materialUsed, workersPresent, issuesFound, clientFeedback, tomorrowPlan, media } = req.body;

  try {
    const { data: report, error } = await supabase
      .from('work_reports')
      .insert({
        user_id: req.user.id,
        project_id: projectId || null,
        work_completed: workCompleted,
        material_used: materialUsed,
        workers_present: workersPresent ? Number(workersPresent) : 0,
        issues_found: issuesFound,
        client_feedback: clientFeedback,
        tomorrow_plan: tomorrowPlan,
        media: media || [],
      })
      .select()
      .single();

    if (error) throw error;
    res.json(formatReport(report));
  } catch (err) {
    console.error('Work report error:', err);
    res.status(500).send('Server error');
  }
});

// Get User's Work Reports
router.get('/my-reports', auth, async (req, res) => {
  try {
    const { data: reports, error } = await supabase
      .from('work_reports')
      .select('*, projects(id, title, location)')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(reports || []);
  } catch (err) {
    console.error('My reports error:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
