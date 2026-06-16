const axios = require('axios');
axios.get('http://localhost:5005/api/v2/site-visits/all', {
  headers: { Authorization: 'Bearer dummy_admin_token' }
}).then(res => {
  console.log("Found", res.data.length, "visits.");
  res.data.forEach(v => {
    console.log(Object.keys(v));
    console.log("User:", v.user);
    console.log("Project:", v.project);
  });
}).catch(console.error);
