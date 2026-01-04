import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());  
app.use(express.json());
app.use(helmet());

app.get('/', (req, res) => res.json({ message: 'Hello from Express' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', now: new Date() }));

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});