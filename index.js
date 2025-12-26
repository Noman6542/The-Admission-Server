import express from 'express';
import cors from 'cors';
import universitiesRouter from './Routes/universities.js';
import applicationsRouter from './Routes/applications.js';

const app = express();
// app.use(cors());
app.use(cors({
  origin: ["https://the-admission-bridge-two.vercel.app"]
}));
const PORT = process.env.PORT || 4000;
app.use(express.json());

app.use('/api/universities', universitiesRouter);
app.use('/api/applications', applicationsRouter);

// app.listen(4000, () => console.log("Server running on http://localhost:4000"));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.get("/", (req, res) => {
  res.send("Server is running ");
});
