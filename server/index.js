import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();
const port = process.env.SERVER_PORT || 3001;

app.use(express.json());

const authRoutes = await import('./routes/authRoutes.js');
const staffRoutes = await import('./routes/staffRoutes.js');
const casesRoutes = await import('./routes/casesRoutes.js');

app.use('/api/auth/staff', staffRoutes.default);
app.use('/api/auth', authRoutes.default);
app.use('/api/cases', casesRoutes.default);

app.get('/api/health', (_req, res) => {
  return res.json({ status: 'ok', server: 'digilegal-vault-api', port });
});

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  const status = res.statusCode !== 200 ? res.statusCode : 500;
  return res.status(status).json({
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

app.listen(port, () => {
  console.log(`[server] Digilegal Vault API listening on port ${port}`);
  console.log(`[server] Health check: http://localhost:${port}/api/health`);
});

export default app;