import express from 'express';
import path from 'path';
import eventHandler from './handlers/event';

const app = express();
const port = 3000;

app.use(express.json());

app.use('/event', eventHandler);

// ✅ Serve static files
app.use(express.static(path.join(__dirname, '../dist')));

// ✅ SPA fallback for non-API routes
app.get('/*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});