require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const express = require('express');
const cors = require('cors');
const incidentRoutes = require('./routes/incidentRoutes');
const repositoryRoutes = require('./routes/repositoryRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/incidents', incidentRoutes);
app.use('/api/repository', repositoryRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Incident triage backend running on http://localhost:${PORT}`);
});
