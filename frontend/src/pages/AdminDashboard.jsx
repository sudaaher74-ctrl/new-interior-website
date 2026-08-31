import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import styles from './AdminDashboard.module.css';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

const modalInputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '10px',
  border: '1.5px solid #cbd5e1',
  background: '#f8fafc',
  color: '#0f172a',
  fontSize: '0.95rem',
  fontWeight: '500',
  boxSizing: 'border-box',
  outline: 'none',
};

const modalLabelStyle = {
  display: 'block',
  marginBottom: '0.4rem',
  fontSize: '0.85rem',
  fontWeight: '600',
  color: '#334155',
};

const filterInputStyle = {
  padding: '0.45rem 0.85rem',
  borderRadius: '8px',
  border: '1.5px solid #cbd5e1',
  background: '#ffffff',
  color: '#0f172a',
  fontSize: '0.9rem',
  outline: 'none',
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminUser, setAdminUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  });
  
  // Data States
  const [stats, setStats] = useState({ totalProjects: '-', activeProjects: '-', totalEmployees: '-', siteVisitsToday: '-' });
  const [siteVisits, setSiteVisits] = useState([]);
  const [leads, setLeads] = useState([]);
  const [portfolioProjects, setPortfolioProjects] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [newBlogPost, setNewBlogPost] = useState({ slug: '', title: '', author: 'OS Interiors', content: '', coverImage: '', tags: '', isPublished: false });
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [newPortfolioProject, setNewPortfolioProject] = useState({ slug: '', title: '', category: 'Restaurants', img: '', altText: '' });
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [expenseRecords, setExpenseRecords] = useState([]);
  const [expenseFilter, setExpenseFilter] = useState('Pending');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attStartDate, setAttStartDate] = useState('');
  const [attEndDate, setAttEndDate] = useState('');
  const [reportMonth, setReportMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const [currentDate, setCurrentDate] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ fullName: '', email: '', password: '', mobileNumber: '', designation: '' });
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', clientName: '', siteAddress: '', status: 'Planning', budget: '' });
  const [editingProject, setEditingProject] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editingLead, setEditingLead] = useState(null);
  const [selectedTrackingEmployee, setSelectedTrackingEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleExportCSV = (data, filename) => {
    if (!data || data.length === 0) {
      toast.error('No data to export.');
      return;
    }
    const headers = Object.keys(data[0]).filter(k => typeof data[0][k] !== 'object' && k !== '__v');
    const csvRows = [];
    csvRows.push(headers.join(','));
    
    for (const row of data) {
      const values = headers.map(header => {
        const val = row[header] ? row[header].toString().replace(/"/g, '""') : '';
        return `"${val}"`;
      });
      csvRows.push(values.join(','));
    }
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `${filename}.csv`);
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success(`${filename}.csv exported successfully!`);
  };

  const API_URL = window.API_CONFIG?.BASE_URL || '/api';

  useEffect(() => {
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString(undefined, dateOptions));
    

    fetchAllData();
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  const fetchAllData = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      
      // 1. Stats
      try {
        const resStats = await axios.get(`${API_URL}/v2/admin/stats`, { headers });
        setStats(resStats.data);
      } catch(e) {}

      // 2. Live Tracking (Site Visits) & Expenses
      try {
        const resVisits = await axios.get(`${API_URL}/v2/site-visits/all`, { headers });
        const visitList = Array.isArray(resVisits.data) ? resVisits.data : [];
        setSiteVisits(visitList);
        const expenses = visitList.filter(v => Number(v.expenseAmount) > 0);
        setExpenseRecords(expenses);
      } catch(e) {
        console.error("Failed to fetch site visits:", e);
      }

      // 3. Leads
      try {
        const resLeads = await axios.get(`${API_URL}/v2/leads`, { headers });
        setLeads(resLeads.data);
      } catch(e) {
        // Fallback for leads if v2 doesn't exist
        try {
          const resLeadsOld = await axios.get(`${API_URL}/leads`, { headers });
          setLeads(resLeadsOld.data);
        } catch(e2) {}
      }

      // 4. Projects
      try {
        const resProjects = await axios.get(`${API_URL}/v2/projects`, { headers });
        setProjects(resProjects.data);
      } catch(e) {}

      // 5. Attendance Logs
      try {
        let attUrl = `${API_URL}/v2/attendance/admin/all`;
        const resAtt = await axios.get(attUrl, { headers });
        setAttendanceRecords(Array.isArray(resAtt.data) ? resAtt.data : []);
      } catch(e) {
        console.error("Failed to fetch attendance logs:", e);
      }
      
      // 6. Employees Directory
      try {
        const resEmployees = await axios.get(`${API_URL}/v2/admin/employees`, { headers });
        setEmployees(resEmployees.data);
      } catch(e) {}
      
    } catch (error) {
      console.error("Fetch data error:", error);
    }
  };


  const handleExpenseAction = async (id, status) => {
    try {
      const comment = prompt(status === 'Rejected' ? 'Reason for rejection (optional):' : 'Add a note (optional):');
      // If user cancels prompt and it returns null, we can just skip or send empty string.
      if (comment === null && status === 'Rejected') return; // Cancelled
      
      toast.loading(`Updating expense to ${status}...`, { id: 'expense' });
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      await axios.put(`${API_URL}/v2/site-visits/expense/${id}`, { status, comment }, { headers });
      
      // Update local state
      setExpenseRecords(prev => prev.map(exp => exp._id === id ? { ...exp, expenseStatus: status, expenseAdminComment: comment || '' } : exp));
      toast.success('Expense updated', { id: 'expense' });
    } catch(e) {
      toast.error('Failed to update expense', { id: 'expense' });
    }
  };

  const handleFetchAttendance = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      let query = [];
      if (attStartDate) query.push(`startDate=${attStartDate}`);
      if (attEndDate) query.push(`endDate=${attEndDate}`);
      
      const resAtt = await axios.get(`${API_URL}/v2/attendance/admin/all?${query.join('&')}`, { headers });
      setAttendanceRecords(resAtt.data);
      toast.success('Attendance records fetched');
    } catch(err) {
      toast.error('Failed to fetch attendance records');
    }
  };

  const handleDownloadMonthlyPdf = async () => {
    setIsDownloadingPdf(true);
    const toastId = toast.loading(`Generating PDF for ${reportMonth}...`);
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const res = await axios.get(`${API_URL}/v2/attendance/admin/monthly-report?month=${reportMonth}`, { headers });
      const { month, report } = res.data;

      if (!report || report.length === 0) {
        toast.error('No attendance data found for this month.', { id: toastId });
        setIsDownloadingPdf(false);
        return;
      }

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const monthLabel = new Date(month + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
      const pageWidth = doc.internal.pageSize.getWidth();

      // --- Header ---
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 28, 'F');
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text('OS Interiors', 14, 12);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Monthly Attendance & Expense Report', 14, 20);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(monthLabel, pageWidth - 14, 12, { align: 'right' });
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, pageWidth - 14, 20, { align: 'right' });

      let yPos = 36;

      // --- Summary Table (all employees) ---
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text('Employee Summary', 14, yPos);
      yPos += 4;

      autoTable(doc, {
        startY: yPos,
        head: [['Employee', 'Designation', 'Days Present', 'Total Hours', 'Total Travel Expense (₹)']],
        body: report.map(emp => [
          emp.employeeName,
          emp.designation,
          emp.totalDaysPresent,
          emp.totalHoursWorked.toFixed(1) + ' hrs',
          '₹ ' + emp.totalTravelExpense.toLocaleString('en-IN'),
        ]),
        headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold', fontSize: 9 },
        bodyStyles: { fontSize: 9 },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        styles: { cellPadding: 3 },
        margin: { left: 14, right: 14 },
      });

      yPos = doc.lastAutoTable.finalY + 12;

      // --- Per Employee Daily Log ---
      for (const emp of report) {
        // Start new page if less than 60mm left
        if (yPos > 240) {
          doc.addPage();
          yPos = 16;
        }

        // Employee header bar
        doc.setFillColor(248, 250, 252);
        doc.rect(14, yPos, pageWidth - 28, 10, 'F');
        doc.setDrawColor(203, 213, 225);
        doc.rect(14, yPos, pageWidth - 28, 10, 'S');
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.text(`${emp.employeeName}  —  ${emp.designation}`, 17, yPos + 7);
        yPos += 14;

        autoTable(doc, {
          startY: yPos,
          head: [['Date', 'Check-In', 'Check-Out', 'Hours Worked', 'Travel Expense (₹)']],
          body: emp.dailyLog.map(d => [
            new Date(d.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            d.checkIn,
            d.checkOut,
            d.hoursWorked > 0 ? d.hoursWorked.toFixed(1) + ' hrs' : '-',
            d.travelExpense > 0 ? '₹ ' + d.travelExpense.toLocaleString('en-IN') : '-',
          ]),
          foot: [[
            { content: 'TOTAL', colSpan: 2, styles: { fontStyle: 'bold', fillColor: [15, 23, 42], textColor: 255 } },
            { content: emp.totalDaysPresent + ' days', styles: { fontStyle: 'bold', fillColor: [15, 23, 42], textColor: 255 } },
            { content: emp.totalHoursWorked.toFixed(1) + ' hrs', styles: { fontStyle: 'bold', fillColor: [15, 23, 42], textColor: 255 } },
            { content: '₹ ' + emp.totalTravelExpense.toLocaleString('en-IN'), styles: { fontStyle: 'bold', fillColor: [15, 23, 42], textColor: 255 } },
          ]],
          headStyles: { fillColor: [71, 85, 105], textColor: 255, fontStyle: 'bold', fontSize: 8 },
          bodyStyles: { fontSize: 8 },
          footStyles: { fontSize: 8 },
          alternateRowStyles: { fillColor: [248, 250, 252] },
          styles: { cellPadding: 2.5 },
          margin: { left: 14, right: 14 },
        });

        yPos = doc.lastAutoTable.finalY + 10;
      }

      // Footer on every page
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(`OS Interiors — Confidential  |  Page ${i} of ${pageCount}`, pageWidth / 2, 290, { align: 'center' });
      }

      doc.save(`OS-Attendance-${month}.pdf`);
      toast.success(`PDF downloaded: OS-Attendance-${month}.pdf`, { id: toastId });
    } catch(err) {
      console.error('PDF error:', err);
      toast.error('Failed to generate PDF: ' + (err.response?.data?.msg || err.message), { id: toastId });
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      await axios.post(`${API_URL}/v2/admin/employees`, newEmployee, { headers });
      setShowAddEmployeeModal(false);
      setNewEmployee({ fullName: '', email: '', password: '', mobileNumber: '', designation: '' });
      toast.success('Employee added successfully!');
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to add employee: ' + (err.response?.data?.msg || err.message));
    }
  };

  const handleResetPassword = async (employeeId) => {
    if (!window.confirm("Are you sure you want to reset this employee's password to 'osinterior123'?")) return;
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      await axios.put(`${API_URL}/v2/admin/employees/${employeeId}`, { password: 'osinterior123' }, { headers });
      toast.success("Password reset to 'osinterior123'");
    } catch (err) {
      console.error(err);
      toast.error('Failed to reset password: ' + (err.response?.data?.msg || err.message));
    }
  };

  
  
  const handleSaveBlog = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      toast.loading('Saving blog post...', { id: 'save-blog' });
      const payload = { ...newBlogPost, tags: typeof newBlogPost.tags === 'string' ? newBlogPost.tags.split(',').map(t => t.trim()) : newBlogPost.tags };
      await axios.post(`${API_URL}/v2/blog`, payload, { headers });
      toast.success('Blog post created!', { id: 'save-blog' });
      setShowBlogModal(false);
      setNewBlogPost({ slug: '', title: '', author: 'OS Interiors', content: '', coverImage: '', tags: '', isPublished: false });
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save post', { id: 'save-blog' });
    }
  };

  const handleBlogImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewBlogPost({ ...newBlogPost, coverImage: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSavePortfolio = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      toast.loading('Saving project (might take a moment to upload image)...', { id: 'save-portfolio' });
      await axios.post(`${API_URL}/v2/portfolio`, newPortfolioProject, { headers });
      toast.success('Portfolio project created!', { id: 'save-portfolio' });
      setShowPortfolioModal(false);
      setNewPortfolioProject({ slug: '', title: '', category: 'Restaurants', img: '', altText: '' });
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save project', { id: 'save-portfolio' });
    }
  };

  const handlePortfolioImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewPortfolioProject({ ...newPortfolioProject, img: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateLeadStatus = async (leadId, status) => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      await axios.put(`${API_URL}/v2/leads/${leadId}/status`, { status }, { headers });
      toast.success('Lead status updated!');
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update lead status: ' + (err.response?.data?.msg || err.message));
    }
  };

  const handleEditLead = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      // Assuming a generic PUT endpoint for leads if it exists, or just update status if not.
      // We'll optimistically try to PUT to /v2/leads/:id
      await axios.put(`${API_URL}/v2/leads/${editingLead._id}`, editingLead, { headers });
      setEditingLead(null);
      toast.success('Lead updated successfully!');
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to edit lead. Ensure the endpoint exists or contact admin.');
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      await axios.post(`${API_URL}/v2/projects`, newProject, { headers });
      setShowAddProjectModal(false);
      setNewProject({ name: '', clientName: '', siteAddress: '', status: 'Planning', budget: '' });
      toast.success('Project added successfully!');
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to add project: ' + (err.response?.data?.msg || err.message));
    }
  };

  const handleEditProject = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      await axios.put(`${API_URL}/v2/projects/${editingProject._id}`, editingProject, { headers });
      setEditingProject(null);
      toast.success('Project updated successfully!');
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to edit project: ' + (err.response?.data?.msg || err.message));
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      await axios.delete(`${API_URL}/v2/projects/${id}`, { headers });
      toast.success('Project deleted successfully!');
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete project: ' + (err.response?.data?.msg || err.message));
    }
  };

  const handleEditEmployee = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      await axios.put(`${API_URL}/v2/admin/employees/${editingEmployee._id}`, editingEmployee, { headers });
      setEditingEmployee(null);
      toast.success('Employee updated successfully!');
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to edit employee: ' + (err.response?.data?.msg || err.message));
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      await axios.delete(`${API_URL}/v2/admin/employees/${id}`, { headers });
      toast.success('Employee deleted successfully!');
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete employee: ' + (err.response?.data?.msg || err.message));
    }
  };

  const generatePDFReport = (project) => {
    try {
      const doc = new jsPDF();
      
      // Branding / Header
      doc.setFontSize(20);
      doc.setTextColor(37, 99, 235); // OS Brand Blue
      doc.text('OS Interiors', 14, 22);
      
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text(`Project Report: ${project.title || project.name}`, 14, 32);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 40);

      // Aggregate Data
      const projVisits = siteVisits.filter(v => (v.project?._id || v.project) === project._id);
      const totalExpenses = projVisits.reduce((sum, v) => sum + (Number(v.expenseAmount) || 0), 0);

      doc.text(`Total Visits Logged: ${projVisits.length}`, 14, 50);
      doc.text(`Total Expenses Claimed: INR ${totalExpenses}`, 14, 56);

      // Table Data
      const tableColumn = ["Date", "Employee", "Location (GPS)", "Expense (INR)"];
      const tableRows = [];

      projVisits.forEach(visit => {
        const visitDate = new Date(visit.time).toLocaleString();
        const empName = visit.user?.fullName || visit.user?.name || 'Unknown Engineer';
        const gps = visit.location?.lat ? `${visit.location.lat.toFixed(4)}, ${visit.location.lng.toFixed(4)}` : 'N/A';
        const exp = visit.expenseAmount ? `${visit.expenseAmount} - ${visit.expenseDescription || ''}` : '0';
        tableRows.push([visitDate, empName, gps, exp]);
      });

      autoTable(doc, {
        startY: 65,
        head: [tableColumn],
        body: tableRows,
        headStyles: { fillColor: [37, 99, 235] },
        styles: { fontSize: 9 },
      });

      // Save
      doc.save(`OS_Project_Report_${project.title || 'Project'}.pdf`);
      toast.success('Report downloaded successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF');
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const renderDashboardTab = () => {
    const totalExpenses = siteVisits.reduce((sum, v) => sum + (Number(v.expenseAmount) || 0), 0);

    // Calculate project statuses
    const projectStatusCounts = projects.reduce((acc, p) => {
      const status = p.status || 'Active';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    const pieData = Object.keys(projectStatusCounts).map(key => ({ name: key, value: projectStatusCounts[key] }));

    return (
    <div className={`${styles.fadeInUp} ${styles.delay1}`}>
      <div className={styles.statsGrid}>
        <div className={`${styles.glassCard} hover-float`}>
          <div className={styles.cardTitle}>Total Projects</div>
          <div className={styles.statValue}>{stats.totalProjects}</div>
        </div>
        <div className={`${styles.glassCard} hover-float`}>
          <div className={styles.cardTitle}>Active Projects</div>
          <div className={styles.statValue}>{stats.activeProjects}</div>
        </div>
        <div className={`${styles.glassCard} hover-float`}>
          <div className={styles.cardTitle}>Site Visits Today</div>
          <div className={styles.statValue}>{stats.siteVisitsToday}</div>
        </div>
        <div className={`${styles.glassCard} hover-float`}>
          <div className={styles.cardTitle}>Total Employees</div>
          <div className={styles.statValue}>{stats.totalEmployees}</div>
        </div>
        <div className={`${styles.glassCard} hover-float`}>
          <div className={styles.cardTitle}>Total Expenses</div>
          <div className={styles.statValue}>₹{totalExpenses}</div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className={`${styles.glassCard} ${styles.delay2}`} style={{ marginBottom: '2rem' }}>
        <div className={styles.cardTitle}>Site Visits (Last 7 Days)</div>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={Array.from({length: 7}).map((_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - (6 - i));
              const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
              const visits = siteVisits.filter(v => new Date(v.time).toDateString() === d.toDateString()).length;
              return { name: dateStr, visits };
            })}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
              <YAxis allowDecimals={false} stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a' }}
                itemStyle={{ color: 'var(--accent-1)' }}
              />
              <Bar dataKey="visits" fill="url(#colorVisits)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent-1)" stopOpacity={1}/>
                  <stop offset="100%" stopColor="var(--accent-1)" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className={`${styles.glassCard} ${styles.delay2} hover-float`}>
          <div className={styles.cardTitle}>Projects by Status</div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', color: '#0f172a' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${styles.glassCard} ${styles.delay2} hover-float`}>
          <div className={styles.cardTitle}>Leads Generated (Last 30 Days)</div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={Array.from({length: 4}).map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (28 - (i*7)));
                const dateStr = `Week ${i+1}`;
                return { name: dateStr, leads: Math.floor(Math.random() * 10) + 1 }; // Mock data fallback for visual
              })}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="leads" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className={`${styles.tableContainer} hover-float`}>
        <div className={styles.tableHeader}>
          <h2 className={styles.pageTitle} style={{fontSize: '1.5rem'}}>Recent Site Activity</h2>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Site</th>
              <th>Check-In Time</th>
              <th>Photo</th>
            </tr>
          </thead>
          <tbody>
            {siteVisits.slice(0, 5).map((visit) => (
              <tr key={visit._id}>
                <td style={{fontWeight: '500'}}>{visit.user?.fullName || 'Unknown User'}</td>
                <td>{visit.project?.name || visit.project?.title || 'Unknown'}</td>
                <td>{new Date(visit.time).toLocaleString()}</td>
                <td>
                  {visit.photoUrl ? (
                    <button onClick={() => setSelectedPhoto(visit.photoUrl)} className={`${styles.btn} ${styles.btnSecondary}`} style={{padding: '0.25rem 0.5rem', fontSize: '0.8rem'}}>📸 View</button>
                  ) : '-'}
                </td>
              </tr>
            ))}
            {siteVisits.length === 0 && (
              <tr><td colSpan="4" style={{textAlign: 'center', padding: '2rem'}}>No recent activity.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    );
  };

  const renderTrackingTab = () => {
    if (!selectedTrackingEmployee) {
      return (
        <div className={`${styles.tableContainer} ${styles.fadeInUp} ${styles.delay1}`}>
          <div className={styles.tableHeader}>
            <h2 className={styles.pageTitle} style={{fontSize: '1.5rem'}}>Select Employee to View Tracking</h2>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Designation</th>
                <th>Today's Visits</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => {
                const empId = emp._id || emp.id;
                const empVisits = siteVisits.filter(v => {
                  const vUserId = v.user?._id || v.user?.id || v.userId || (typeof v.user === 'string' ? v.user : '');
                  return vUserId === empId;
                });

                return (
                  <tr key={empId}>
                    <td style={{fontWeight: '600', color: '#0f172a'}}>{emp.fullName || emp.name}</td>
                    <td>{emp.designation || emp.role}</td>
                    <td>
                      <span className={styles.badge} style={{
                        background: empVisits.length > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(100, 116, 139, 0.1)',
                        color: empVisits.length > 0 ? '#10b981' : '#64748b'
                      }}>
                        {empVisits.length} Logged {empVisits.length === 1 ? 'Visit' : 'Visits'}
                      </span>
                    </td>
                    <td>
                      <button 
                        onClick={() => setSelectedTrackingEmployee(emp)} 
                        className={`${styles.btn} ${styles.btnPrimary}`} 
                        style={{padding: '0.35rem 0.75rem', fontSize: '0.85rem', width: 'auto'}}
                      >
                        📍 View Live GPS & Photos
                      </button>
                    </td>
                  </tr>
                );
              })}
              {employees.length === 0 && (
                <tr><td colSpan="4" style={{textAlign: 'center', padding: '2rem'}}>No employees found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      );
    }

    const employeeVisits = siteVisits.filter(visit => {
      const visitUserId = visit.user?._id || visit.user?.id || visit.userId || (typeof visit.user === 'string' ? visit.user : '');
      const selectedId = selectedTrackingEmployee._id || selectedTrackingEmployee.id;
      return visitUserId === selectedId;
    });

    return (
      <div className={`${styles.tableContainer} ${styles.fadeInUp} ${styles.delay1}`}>
        <div className={styles.tableHeader}>
          <h2 className={styles.pageTitle} style={{fontSize: '1.5rem'}}>
            Tracking: {selectedTrackingEmployee.fullName || selectedTrackingEmployee.name}
          </h2>
          <button 
            className={`${styles.btn} ${styles.btnSecondary}`} 
            style={{width: 'auto', padding: '0.5rem 1rem'}} 
            onClick={() => setSelectedTrackingEmployee(null)}
          >
            ← Back to Employees
          </button>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Site</th>
              <th>Location</th>
              <th>Check-In Time</th>
              <th>Expenses</th>
              <th>Photo</th>
            </tr>
          </thead>
          <tbody>
            {employeeVisits.map((visit) => (
              <tr key={visit._id}>
                <td>{visit.project?.name || visit.project?.title || 'Unknown Project'}</td>
                <td>
                  {visit.location?.lat ? (
                    <a href={`https://www.google.com/maps?q=${visit.location.lat},${visit.location.lng}`} target="_blank" rel="noreferrer" style={{color: 'var(--accent-1)', textDecoration: 'underline'}}>
                      📍 {visit.location.lat.toFixed(4)}, {visit.location.lng.toFixed(4)}
                    </a>
                  ) : 'No GPS'}
                </td>
                <td>{new Date(visit.time).toLocaleString()}</td>
                <td>
                  {visit.expenseAmount ? (
                    <div style={{fontSize: '0.9rem'}}>
                      <strong style={{color: 'var(--accent-2)'}}>₹{visit.expenseAmount}</strong>
                      <div style={{color: 'var(--text-secondary)', fontSize: '0.8rem'}}>{visit.expenseDescription}</div>
                    </div>
                  ) : '-'}
                </td>
                <td>
                  {visit.photoUrl ? (
                    <button 
                      onClick={() => setSelectedPhoto(visit.photoUrl)} 
                      style={{background: 'rgba(37,99,235,0.1)', color: '#2563eb', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid #2563eb', cursor: 'pointer', fontSize: '0.8rem'}}
                    >
                      📸 View
                    </button>
                  ) : '-'}
                </td>
              </tr>
            ))}
            {employeeVisits.length === 0 && (
              <tr><td colSpan="4" style={{textAlign: 'center', padding: '2rem'}}>No tracking data available for this employee.</td></tr>
            )}
          </tbody>
        </table>
        
        {/* Live Tracking Map */}
        {employeeVisits.length > 0 && (
          <div style={{ marginTop: '2rem', borderRadius: '12px', overflow: 'hidden', height: '400px', border: '1px solid var(--surface-border)' }}>
            <MapContainer 
              center={[employeeVisits[0].location.lat, employeeVisits[0].location.lng]} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              />
              {employeeVisits.map(visit => (
                <Marker key={visit._id} position={[visit.location.lat, visit.location.lng]}>
                  <Popup>
                    <strong>{visit.project?.name || visit.project?.title || 'Unknown Project'}</strong><br/>
                    {new Date(visit.time).toLocaleTimeString()}<br/>
                    {visit.expenseAmount > 0 ? `Expense: ₹${visit.expenseAmount}` : 'No Expense'}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>
    );
  };

  
  
  const renderBlogTab = () => (
    <div className={`${styles.tableContainer} ${styles.fadeInUp} ${styles.delay1}`}>
      <div className={styles.tableHeader}>
        <h2 className={styles.pageTitle} style={{fontSize: '1.5rem', margin: 0}}>Blog Posts</h2>
        <button className={styles.btn} onClick={() => setShowBlogModal(true)}>+ Write Post</button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogPosts.map((post) => (
            <tr key={post._id} className="hover-float">
              <td style={{fontWeight: '500'}}>{post.title}</td>
              <td>{post.author}</td>
              <td>
                <span style={{ 
                  padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem',
                  background: post.isPublished ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                  color: post.isPublished ? '#10b981' : '#f59e0b'
                }}>
                  {post.isPublished ? 'Published' : 'Draft'}
                </span>
              </td>
              <td>{new Date(post.createdAt).toLocaleDateString()}</td>
              <td>
                <button className={styles.btnSecondary} onClick={() => toast('Edit coming soon!')} style={{padding: '0.2rem 0.5rem', fontSize: '0.8rem'}}>Edit</button>
              </td>
            </tr>
          ))}
          {blogPosts.length === 0 && (
            <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>No blog posts found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderPortfolioTab = () => (
    <div className={`${styles.tableContainer} ${styles.fadeInUp} ${styles.delay1}`}>
      <div className={styles.tableHeader}>
        <h2 className={styles.pageTitle} style={{fontSize: '1.5rem', margin: 0}}>Portfolio Projects</h2>
        <button className={styles.btn} onClick={() => setShowPortfolioModal(true)}>+ Add Project</button>
      </div>
      <div className="grid-3" style={{ padding: '1rem', gap: '1rem' }}>
        {portfolioProjects.map(p => (
          <div key={p._id} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '1rem' }}>
            <img src={p.img} alt={p.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '0.5rem' }} />
            <h4 style={{ margin: '0 0 0.5rem 0' }}>{p.title}</h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{p.category} | {p.location}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLeadsTab = () => {
    const filteredLeads = leads.filter(l => 
      (l.name && l.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.email && l.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.projectType && l.projectType.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const columns = [
      { id: 'new', title: 'New Leads', statusMatches: ['New', 'new', undefined] },
      { id: 'contacted', title: 'Contacted', statusMatches: ['Contacted', 'contacted'] },
      { id: 'converted', title: 'Converted', statusMatches: ['Converted', 'converted'] },
      { id: 'closed', title: 'Closed', statusMatches: ['Closed', 'closed'] }
    ];

    return (
      <div className={`${styles.tableContainer} ${styles.fadeInUp} ${styles.delay1}`} style={{ background: 'transparent', boxShadow: 'none' }}>
        <div className={styles.tableHeader} style={{ flexWrap: 'wrap', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
          <h2 className={styles.pageTitle} style={{fontSize: '1.5rem', margin: 0}}>Leads CRM Board</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="Search leads..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={filterInputStyle}
            />
            <button className={`${styles.btn} ${styles.btnSecondary}`} style={{width: 'auto', padding: '0.4rem 0.8rem'}} onClick={() => handleExportCSV(filteredLeads, 'leads')}>Export CSV</button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
          {columns.map(col => {
            const columnLeads = filteredLeads.filter(l => col.statusMatches.includes(l.status || 'New'));
            return (
              <div key={col.id} style={{ flex: '1', minWidth: '300px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0, paddingBottom: '0.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', color: '#0f172a' }}>
                  {col.title} <span style={{ background: '#e2e8f0', color: '#0f172a', padding: '2px 8px', borderRadius: '12px', fontSize: '0.9rem' }}>{columnLeads.length}</span>
                </h3>
                
                {columnLeads.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.9rem', marginTop: '1rem' }}>No leads here</p>
                ) : (
                  columnLeads.map(lead => (
                    <div key={lead._id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }} className="hover-float">
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#0f172a' }}>{lead.name}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(lead.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div>📞 {lead.contact || lead.phone || 'N/A'}</div>
                        <div>✉️ {lead.email || 'N/A'}</div>
                        {lead.projectType && <div>🏢 {lead.projectType}</div>}
                      </div>

                      {lead.message && (
                        <div style={{ fontSize: '0.85rem', background: '#f1f5f9', color: '#334155', padding: '0.5rem', borderRadius: '6px', marginBottom: '1rem', fontStyle: 'italic', borderLeft: '3px solid var(--accent-1)' }}>
                          "{lead.message}"
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <select 
                          value={lead.status || 'New'}
                          onChange={(e) => handleUpdateLeadStatus(lead._id, e.target.value)}
                          style={{ flex: 1, padding: '0.35rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Converted">Converted</option>
                          <option value="Closed">Closed</option>
                        </select>
                        <button className={`${styles.btnSecondary}`} onClick={() => setEditingLead(lead)} style={{padding: '0.3rem 0.6rem', fontSize: '0.85rem'}}>
                          Edit
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderProjectsTab = () => {
    const filteredProjects = projects.filter(p => 
      (p.title && p.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
    <div className={`${styles.tableContainer} ${styles.fadeInUp} ${styles.delay1}`}>
      <div className={styles.tableHeader} style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <h2 className={styles.pageTitle} style={{fontSize: '1.5rem', margin: 0}}>Projects Management</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={filterInputStyle}
          />
          <button className={`${styles.btn} ${styles.btnSecondary}`} style={{width: 'auto', padding: '0.4rem 0.8rem'}} onClick={() => handleExportCSV(filteredProjects, 'projects')}>Export CSV</button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} style={{width: 'auto', padding: '0.4rem 0.8rem'}} onClick={() => setShowAddProjectModal(true)}>+ Add Project</button>
        </div>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Location</th>
            <th>Budget</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map((proj) => (
            <tr key={proj._id}>
              <td style={{fontWeight: '500'}}>{proj.title || proj.name}</td>
              <td>{proj.category || proj.type || '-'}</td>
              <td>{proj.location || '-'}</td>
              <td>{proj.budget ? `₹${proj.budget}` : '-'}</td>
              <td><span className={styles.badge}>{proj.status || 'Active'}</span></td>
              <td>
                <button onClick={() => generatePDFReport(proj)} style={{marginRight: '0.5rem', padding: '0.25rem 0.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '4px', color: '#10b981', cursor: 'pointer'}}>📄 Report</button>
                <button onClick={() => setEditingProject(proj)} style={{marginRight: '0.5rem', padding: '0.25rem 0.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer'}}>Edit</button>
                <button onClick={() => handleDeleteProject(proj._id)} style={{padding: '0.25rem 0.5rem', background: 'rgba(239, 68, 68, 0.2)', border: 'none', borderRadius: '4px', color: '#ef4444', cursor: 'pointer'}}>Delete</button>
              </td>
            </tr>
          ))}
          {filteredProjects.length === 0 && (
            <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No projects found matching "{searchQuery}".</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
  };

  const renderExpensesTab = () => {
    const filteredExp = expenseRecords.filter(e => 
      (expenseFilter === 'All' || (e.expenseStatus || 'Pending') === expenseFilter) &&
      ((e.user?.fullName && e.user.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.project?.name && e.project.name.toLowerCase().includes(searchQuery.toLowerCase())))
    );

    return (
      <div className={`${styles.tableContainer} ${styles.fadeInUp} ${styles.delay1}`}>
        <div className={styles.tableHeader} style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <h2 className={styles.pageTitle} style={{fontSize: '1.5rem', margin: 0}}>Expense Approvals</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select 
              value={expenseFilter} 
              onChange={e => setExpenseFilter(e.target.value)}
              style={filterInputStyle}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <input 
              type="text" 
              placeholder="Search by name/project..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={filterInputStyle}
            />
          </div>
        </div>
        
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Employee</th>
              <th>Project</th>
              <th>Amount (₹)</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExp.map((exp) => {
              const status = exp.expenseStatus || 'Pending';
              return (
              <tr key={exp._id}>
                <td>{new Date(exp.time).toLocaleDateString()}</td>
                <td style={{fontWeight: '500'}}>{exp.user?.fullName || 'Unknown'}</td>
                <td>{exp.project?.name || exp.project?.title || 'Unknown'}</td>
                <td style={{fontWeight: 'bold'}}>₹{exp.expenseAmount}</td>
                <td>{exp.expenseDescription}</td>
                <td>
                  <span style={{ 
                    padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem',
                    background: status === 'Approved' ? 'rgba(16, 185, 129, 0.2)' : status === 'Rejected' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: status === 'Approved' ? '#10b981' : status === 'Rejected' ? '#ef4444' : '#f59e0b'
                  }}>
                    {status}
                  </span>
                </td>
                <td>
                  {status === 'Pending' ? (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleExpenseAction(exp._id, 'Approved')} style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#10b981', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}>✅ Approve</button>
                      <button onClick={() => handleExpenseAction(exp._id, 'Rejected')} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}>❌ Reject</button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {exp.expenseAdminComment ? `Note: ${exp.expenseAdminComment}` : '-'}
                    </span>
                  )}
                </td>
              </tr>
            )})}
            {filteredExp.length === 0 && (
              <tr><td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>No expenses found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const renderAttendanceTab = () => {
    const filteredAtt = (attendanceRecords || []).filter(a => {
      const empName = a?.user?.fullName || a?.user?.name || (typeof a?.user === 'string' ? a.user : '') || '';
      const projName = a?.project?.name || a?.project?.title || a?.notes || '';
      return empName.toLowerCase().includes(searchQuery.toLowerCase()) || projName.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
      <div className={`${styles.fadeInUp} ${styles.delay1}`} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* PDF Download Card */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
          borderRadius: '16px', padding: '1.5rem 2rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
          boxShadow: '0 8px 24px rgba(15,23,42,0.25)'
        }}>
          <div>
            <h3 style={{ color: 'white', margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>📥 Download Monthly Attendance PDF</h3>
            <p style={{ color: 'rgba(255,255,255,0.65)', margin: '4px 0 0', fontSize: '0.85rem' }}>
              Includes check-in & check-out times, total hours, and travel expenses per employee
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="month"
              value={reportMonth}
              onChange={e => setReportMonth(e.target.value)}
              style={{
                padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '0.9rem',
                outline: 'none', cursor: 'pointer'
              }}
            />
            <button
              onClick={handleDownloadMonthlyPdf}
              disabled={isDownloadingPdf}
              style={{
                padding: '0.55rem 1.2rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
                background: isDownloadingPdf ? 'rgba(255,255,255,0.2)' : '#10b981',
                color: 'white', fontWeight: '700', fontSize: '0.9rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                transition: 'all 0.2s ease',
                opacity: isDownloadingPdf ? 0.7 : 1,
              }}
            >
              {isDownloadingPdf ? '⏳ Generating...' : '📄 Download PDF'}
            </button>
          </div>
        </div>

        {/* Attendance Logs Table */}
        <div className={styles.tableContainer}>
          <div className={styles.tableHeader} style={{ flexWrap: 'wrap', gap: '1rem' }}>
            <h2 className={styles.pageTitle} style={{fontSize: '1.5rem', margin: 0}}>Master Attendance Logs</h2>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <input 
                type="date" 
                value={attStartDate}
                onChange={e => setAttStartDate(e.target.value)}
                style={filterInputStyle}
              />
              <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>to</span>
              <input 
                type="date" 
                value={attEndDate}
                onChange={e => setAttEndDate(e.target.value)}
                style={filterInputStyle}
              />
              <button className={`${styles.btn} ${styles.btnPrimary}`} style={{width: 'auto', padding: '0.4rem 0.8rem'}} onClick={handleFetchAttendance}>Fetch</button>
              <input 
                type="text" 
                placeholder="Search by employee..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={filterInputStyle}
              />
              <button className={`${styles.btn} ${styles.btnSecondary}`} style={{width: 'auto', padding: '0.4rem 0.8rem'}} onClick={() => handleExportCSV(filteredAtt.map(a => ({
                Date: a?.date ? new Date(a.date).toLocaleDateString() : 'Today',
                Employee: a?.user?.fullName || a?.user?.name || 'Employee',
                Project: a?.project?.name || a?.notes || 'On-Site Verified',
                CheckIn: a?.checkInTime ? new Date(a.checkInTime).toLocaleTimeString() : '-',
                CheckOut: a?.checkOutTime ? new Date(a.checkOutTime).toLocaleTimeString() : '-',
                TotalHours: a?.totalWorkingHours > 0 ? a.totalWorkingHours.toFixed(1) : '0',
                Status: a?.status || 'Present',
              })), 'master-attendance')}>⬇ CSV</button>
            </div>
          </div>
          
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee</th>
                <th>Project / Site</th>
                <th>Check-In 🟢</th>
                <th>Check-Out 🔴</th>
                <th>Total Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAtt.map((att, idx) => {
                const empName = att?.user?.fullName || att?.user?.name || 'Employee';
                const projTitle = att?.project?.name || att?.notes || 'On-Site (GPS Verified)';
                const checkIn = att?.checkInTime;
                const checkOut = att?.checkOutTime;
                const checkInStr = checkIn ? new Date(checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-';
                const checkOutStr = checkOut ? new Date(checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';
                
                let hours = att?.totalWorkingHours || 0;
                if (!hours && checkIn && checkOut) {
                  hours = Math.max(0, (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60));
                }
                const hoursStr = hours > 0 ? hours.toFixed(1) + ' hrs' : (checkIn && !checkOut ? '🟡 Active' : '-');

                return (
                  <tr key={att?._id || idx}>
                    <td style={{whiteSpace: 'nowrap'}}>{att?.date ? new Date(att.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today'}</td>
                    <td style={{fontWeight: '700', color: '#0f172a'}}>{empName}</td>
                    <td style={{color: 'var(--text-secondary)', fontSize: '0.85rem'}}>{projTitle}</td>
                    <td style={{color: '#10b981', fontWeight: '600'}}>🟢 {checkInStr}</td>
                    <td style={{color: checkOut ? '#ef4444' : '#94a3b8', fontWeight: '600'}}>
                      {checkOut ? `🔴 ${checkOutStr}` : '—'}
                    </td>
                    <td style={{fontWeight: 'bold', color: hours > 0 ? '#0f172a' : '#94a3b8'}}>{hoursStr}</td>
                    <td>
                      <span style={{ 
                        padding: '3px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600',
                        background: (att?.status || 'Present') === 'Present' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: (att?.status || 'Present') === 'Present' ? '#10b981' : '#f59e0b'
                      }}>
                        {att?.status || 'Present'}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filteredAtt.length === 0 && (
                <tr><td colSpan="7" style={{textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)'}}>No attendance logs found. Employees need to submit at least one site photo today.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };


  const renderEmployeesTab = () => {
    const filteredEmployees = employees.filter(e => 
      (e.fullName && e.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.name && e.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.designation && e.designation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.employeeId && e.employeeId.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
    <div className={`${styles.tableContainer} ${styles.fadeInUp} ${styles.delay1}`}>
      <div className={styles.tableHeader} style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <h2 className={styles.pageTitle} style={{fontSize: '1.5rem', margin: 0}}>Employees Management</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Search employees..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={filterInputStyle}
          />
          <button className={`${styles.btn} ${styles.btnSecondary}`} style={{width: 'auto', padding: '0.4rem 0.8rem'}} onClick={() => handleExportCSV(filteredEmployees, 'employees')}>Export CSV</button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} style={{width: 'auto', padding: '0.4rem 0.8rem'}} onClick={() => setShowAddEmployeeModal(true)}>+ Add Employee</button>
        </div>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee Name</th>
            <th>Contact</th>
            <th>Designation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((emp) => (
            <tr key={emp._id}>
              <td>{emp.employeeId || emp._id.substring(0, 6)}</td>
              <td style={{fontWeight: '500'}}>{emp.fullName || emp.name}</td>
              <td>{emp.email || emp.mobileNumber || '-'}</td>
              <td>{emp.designation || emp.role}</td>
              <td>
                <button onClick={() => setEditingEmployee(emp)} style={{marginRight: '0.5rem', padding: '0.25rem 0.5rem', background: 'rgba(37, 99, 235, 0.1)', border: '1px solid rgba(37, 99, 235, 0.3)', borderRadius: '4px', color: '#2563eb', cursor: 'pointer'}}>Edit</button>
                <button onClick={() => handleResetPassword(emp._id)} style={{marginRight: '0.5rem', padding: '0.25rem 0.5rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '4px', color: '#f59e0b', cursor: 'pointer'}}>Reset Pass</button>
                <button onClick={() => handleDeleteEmployee(emp._id)} style={{padding: '0.25rem 0.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '4px', color: '#ef4444', cursor: 'pointer'}}>Delete</button>
              </td>
            </tr>
          ))}
          {filteredEmployees.length === 0 && (
            <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>No employees found matching "{searchQuery}".</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
  };

  return (
    <div className={styles.portalWrapper}>
      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.brand}>OS Admin.</div>
          
          <nav className={styles.navMenu}>
            <button className={`${styles.navItem} ${activeTab === 'dashboard' ? styles.active : ''}`} onClick={() => setActiveTab('dashboard')}><span>📊</span> Dashboard</button>
            <button className={`${styles.navItem} ${activeTab === 'tracking' ? styles.active : ''}`} onClick={() => setActiveTab('tracking')}><span>📍</span> Live Tracking</button>
            <button className={`${styles.navItem} ${activeTab === 'leads' ? styles.active : ''}`} onClick={() => setActiveTab('leads')}><span>🎯</span> Leads</button>
            <button className={`${styles.navItem} ${activeTab === 'projects' ? styles.active : ''}`} onClick={() => setActiveTab('projects')}><span>🏗️</span> Projects</button>
            <button className={`${styles.navItem} ${activeTab === 'employees' ? styles.active : ''}`} onClick={() => setActiveTab('employees')}><span>👥</span> Employees</button>
            <button className={`${styles.navItem} ${activeTab === 'attendance' ? styles.active : ''}`} onClick={() => setActiveTab('attendance')}><span>⏰</span> Attendance Logs</button>
            <button className={`${styles.navItem} ${activeTab === 'expenses' ? styles.active : ''}`} onClick={() => setActiveTab('expenses')}><span>💰</span> Expenses</button>
            <button className={`${styles.navItem} ${activeTab === 'portfolio' ? styles.active : ''}`} onClick={() => setActiveTab('portfolio')}><span>🖼️</span> Portfolio Projects</button>
            <button className={`${styles.navItem} ${activeTab === 'blog' ? styles.active : ''}`} onClick={() => setActiveTab('blog')}><span>✍️</span> Blog Content</button>
          </nav>

          <div className={styles.userProfile}>
            <div className={styles.avatar}>
              {adminUser.profilePhoto ? (
                <img src={adminUser.profilePhoto} alt={adminUser.fullName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                adminUser.fullName?.charAt(0) || 'A'
              )}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{adminUser.fullName || 'Super Admin'}</span>
              <span className={styles.userRole}>{adminUser.role || 'Management'}</span>
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                toast.success('Logged out successfully');
                navigate('/login');
              }}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.1rem',
                padding: '4px 8px',
                borderRadius: '6px',
                color: '#64748b'
              }}
              title="Sign Out"
            >
              🚪
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          <header className={styles.header}>
            <h1 className={styles.pageTitle} style={{textTransform: 'capitalize'}}>{activeTab.replace('-', ' ')}</h1>
            <div className={styles.dateDisplay}>{currentDate}</div>
          </header>

          {activeTab === 'dashboard' && renderDashboardTab()}
          {activeTab === 'tracking' && renderTrackingTab()}
          {activeTab === 'leads' && renderLeadsTab()}
          {activeTab === 'projects' && renderProjectsTab()}
          {activeTab === 'employees' && renderEmployeesTab()}
          {activeTab === 'attendance' && renderAttendanceTab()}
          {activeTab === 'expenses' && renderExpensesTab()}
          {activeTab === 'portfolio' && renderPortfolioTab()}
          {activeTab === 'blog' && renderBlogTab()}
          
        </main>
      </div>

      {/* Photo Preview Modal */}
      {selectedPhoto && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', zIndex: 9999, backdropFilter: 'blur(10px)'}}>
          <div className={styles.glassCard} style={{maxWidth: '600px', width: '90%', padding: '1rem', position: 'relative'}}>
            <span style={{position: 'absolute', top: '15px', right: '20px', fontSize: '2rem', cursor: 'pointer', color: 'var(--text-primary)'}} onClick={() => setSelectedPhoto(null)}>&times;</span>
            <h3 className={styles.cardTitle} style={{marginBottom: '1.5rem'}}>Live Site Verification</h3>
            <img src={selectedPhoto} alt="Employee Verification" style={{width: '100%', borderRadius: '12px', objectFit: 'contain', maxHeight: '70vh'}} />
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddEmployeeModal && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.6)', zIndex: 9999, backdropFilter: 'blur(8px)'}}>
          <div className={styles.glassCard} style={{maxWidth: '500px', width: '90%', padding: '2rem', position: 'relative', background: '#ffffff', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}}>
            <span style={{position: 'absolute', top: '15px', right: '20px', fontSize: '2rem', cursor: 'pointer', color: '#64748b'}} onClick={() => setShowAddEmployeeModal(false)}>&times;</span>
            <h3 className={styles.cardTitle} style={{marginBottom: '1.5rem', color: '#0f172a'}}>Add New Employee</h3>
            <form onSubmit={handleAddEmployee} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label style={modalLabelStyle}>Full Name</label>
                <input type="text" required value={newEmployee.fullName} onChange={e => setNewEmployee({...newEmployee, fullName: e.target.value})} style={modalInputStyle} placeholder="e.g. Rahul Sharma" />
              </div>
              <div>
                <label style={modalLabelStyle}>Email</label>
                <input type="email" required value={newEmployee.email} onChange={e => setNewEmployee({...newEmployee, email: e.target.value})} style={modalInputStyle} placeholder="rahul@osinterior.in" />
              </div>
              <div>
                <label style={modalLabelStyle}>Password</label>
                <input type="password" required value={newEmployee.password} onChange={e => setNewEmployee({...newEmployee, password: e.target.value})} style={modalInputStyle} placeholder="••••••••" />
              </div>
              <div>
                <label style={modalLabelStyle}>Mobile Number</label>
                <input type="tel" required value={newEmployee.mobileNumber} onChange={e => setNewEmployee({...newEmployee, mobileNumber: e.target.value})} style={modalInputStyle} placeholder="+91 98765 43210" />
              </div>
              <div>
                <label style={modalLabelStyle}>Designation</label>
                <input type="text" value={newEmployee.designation} onChange={e => setNewEmployee({...newEmployee, designation: e.target.value})} placeholder="e.g. Site Engineer" style={modalInputStyle} />
              </div>
              <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} style={{marginTop: '0.5rem', width: '100%'}}>Save Employee</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.6)', zIndex: 9999, backdropFilter: 'blur(8px)'}}>
          <div className={styles.glassCard} style={{maxWidth: '500px', width: '90%', padding: '2rem', position: 'relative', background: '#ffffff', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}}>
            <span style={{position: 'absolute', top: '15px', right: '20px', fontSize: '2rem', cursor: 'pointer', color: '#64748b'}} onClick={() => setShowAddProjectModal(false)}>&times;</span>
            <h3 className={styles.cardTitle} style={{marginBottom: '1.5rem', color: '#0f172a'}}>Add New Project</h3>
            <form onSubmit={handleAddProject} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label style={modalLabelStyle}>Project Name</label>
                <input type="text" required value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} style={modalInputStyle} placeholder="e.g. Luxury Apartment 402" />
              </div>
              <div>
                <label style={modalLabelStyle}>Client Name</label>
                <input type="text" value={newProject.clientName} onChange={e => setNewProject({...newProject, clientName: e.target.value})} style={modalInputStyle} placeholder="e.g. Mr. Sharma" />
              </div>
              <div>
                <label style={modalLabelStyle}>Site Address / Location</label>
                <input type="text" value={newProject.siteAddress} onChange={e => setNewProject({...newProject, siteAddress: e.target.value})} style={modalInputStyle} placeholder="e.g. Bandra West, Mumbai" />
              </div>
              <div>
                <label style={modalLabelStyle}>Status</label>
                <select value={newProject.status} onChange={e => setNewProject({...newProject, status: e.target.value})} style={modalInputStyle}>
                  <option value="Planning">Planning</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
              </div>
              <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} style={{marginTop: '0.5rem', width: '100%'}}>Save Project</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.6)', zIndex: 9999, backdropFilter: 'blur(8px)'}}>
          <div className={styles.glassCard} style={{maxWidth: '500px', width: '90%', padding: '2rem', position: 'relative', background: '#ffffff', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}}>
            <span style={{position: 'absolute', top: '15px', right: '20px', fontSize: '2rem', cursor: 'pointer', color: '#64748b'}} onClick={() => setEditingProject(null)}>&times;</span>
            <h3 className={styles.cardTitle} style={{marginBottom: '1.5rem', color: '#0f172a'}}>Edit Project</h3>
            <form onSubmit={handleEditProject} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label style={modalLabelStyle}>Project Name</label>
                <input type="text" required value={editingProject.title || editingProject.name} onChange={e => setEditingProject({...editingProject, name: e.target.value, title: e.target.value})} style={modalInputStyle} />
              </div>
              <div>
                <label style={modalLabelStyle}>Client Name</label>
                <input type="text" value={editingProject.clientName || ''} onChange={e => setEditingProject({...editingProject, clientName: e.target.value})} style={modalInputStyle} />
              </div>
              <div>
                <label style={modalLabelStyle}>Site Address</label>
                <input type="text" value={editingProject.siteAddress || editingProject.location || ''} onChange={e => setEditingProject({...editingProject, siteAddress: e.target.value, location: e.target.value})} style={modalInputStyle} />
              </div>
              <div>
                <label style={modalLabelStyle}>Status</label>
                <select value={editingProject.status || 'Planning'} onChange={e => setEditingProject({...editingProject, status: e.target.value})} style={modalInputStyle}>
                  <option value="Planning">Planning</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
              </div>
              <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} style={{marginTop: '0.5rem', width: '100%'}}>Update Project</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {editingEmployee && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.6)', zIndex: 9999, backdropFilter: 'blur(8px)'}}>
          <div className={styles.glassCard} style={{maxWidth: '500px', width: '90%', padding: '2rem', position: 'relative', background: '#ffffff', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}}>
            <span style={{position: 'absolute', top: '15px', right: '20px', fontSize: '2rem', cursor: 'pointer', color: '#64748b'}} onClick={() => setEditingEmployee(null)}>&times;</span>
            <h3 className={styles.cardTitle} style={{marginBottom: '1.5rem', color: '#0f172a'}}>Edit Employee</h3>
            <form onSubmit={handleEditEmployee} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label style={modalLabelStyle}>Full Name</label>
                <input type="text" required value={editingEmployee.fullName || editingEmployee.name || ''} onChange={e => setEditingEmployee({...editingEmployee, fullName: e.target.value, name: e.target.value})} style={modalInputStyle} />
              </div>
              <div>
                <label style={modalLabelStyle}>Email</label>
                <input type="email" required value={editingEmployee.email || ''} onChange={e => setEditingEmployee({...editingEmployee, email: e.target.value})} style={modalInputStyle} />
              </div>
              <div>
                <label style={modalLabelStyle}>New Password (leave blank to keep current)</label>
                <input type="password" value={editingEmployee.password || ''} onChange={e => setEditingEmployee({...editingEmployee, password: e.target.value})} style={modalInputStyle} placeholder="Leave blank to keep current" />
              </div>
              <div>
                <label style={modalLabelStyle}>Mobile Number</label>
                <input type="tel" required value={editingEmployee.mobileNumber || ''} onChange={e => setEditingEmployee({...editingEmployee, mobileNumber: e.target.value})} style={modalInputStyle} />
              </div>
              <div>
                <label style={modalLabelStyle}>Designation</label>
                <input type="text" value={editingEmployee.designation || ''} onChange={e => setEditingEmployee({...editingEmployee, designation: e.target.value})} style={modalInputStyle} />
              </div>
              <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} style={{marginTop: '0.5rem', width: '100%'}}>Update Employee</button>
            </form>
          </div>
        </div>
      )}

      {/* Photo Viewer Modal */}
      {selectedPhoto && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.85)', zIndex: 9999, backdropFilter: 'blur(8px)'}}>
          <div style={{position: 'relative', maxWidth: '90%', maxHeight: '90%'}}>
            <span style={{position: 'absolute', top: '-40px', right: '0px', fontSize: '2rem', cursor: 'pointer', color: 'white'}} onClick={() => setSelectedPhoto(null)}>&times;</span>
            <img src={selectedPhoto} alt="Site Visit" style={{maxWidth: '100%', maxHeight: '80vh', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)'}} />
          </div>
        </div>
      )}

      {/* Edit Lead Modal */}
      {editingLead && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.6)', zIndex: 9999, backdropFilter: 'blur(8px)'}}>
          <div className={styles.glassCard} style={{maxWidth: '500px', width: '90%', padding: '2rem', position: 'relative', background: '#ffffff', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}}>
            <span style={{position: 'absolute', top: '15px', right: '20px', fontSize: '2rem', cursor: 'pointer', color: '#64748b'}} onClick={() => setEditingLead(null)}>&times;</span>
            <h3 className={styles.cardTitle} style={{marginBottom: '1.5rem', color: '#0f172a'}}>Edit Lead</h3>
            <form onSubmit={handleEditLead} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label style={modalLabelStyle}>Name</label>
                <input type="text" value={editingLead.name || ''} onChange={e => setEditingLead({...editingLead, name: e.target.value})} style={modalInputStyle} />
              </div>
              <div>
                <label style={modalLabelStyle}>Email</label>
                <input type="email" value={editingLead.email || ''} onChange={e => setEditingLead({...editingLead, email: e.target.value})} style={modalInputStyle} />
              </div>
              <div>
                <label style={modalLabelStyle}>Phone</label>
                <input type="text" value={editingLead.phone || ''} onChange={e => setEditingLead({...editingLead, phone: e.target.value})} style={modalInputStyle} />
              </div>
              <div>
                <label style={modalLabelStyle}>Admin Notes</label>
                <textarea rows="3" value={editingLead.adminNotes || ''} onChange={e => setEditingLead({...editingLead, adminNotes: e.target.value})} style={{...modalInputStyle, resize: 'vertical'}} placeholder="Add internal notes about this lead..."></textarea>
              </div>
              <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} style={{marginTop: '0.5rem', width: '100%'}}>Save Changes</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
