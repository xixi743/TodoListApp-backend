import express from "express";
import cors from "cors";
import tasksRouter from "./tasks.router";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:3000" }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/", (_req, res) => res.send("Todo API is running"));

app.use("/tasks", tasksRouter);

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
