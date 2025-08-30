import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// GET /tasks  (list + summary)
router.get("/", async (_req, res) => {
  const [items, total, completed] = await Promise.all([
    prisma.task.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.task.count(),
    prisma.task.count({ where: { completed: true } }),
  ]);
  res.json({ tasks: items, summary: { total, completed } });
});

// POST /tasks
router.post("/", async (req, res) => {
  const { title, color = "blue" } = req.body ?? {};
  if (!title?.trim()) return res.status(400).json({ error: "Title is required" });
  const created = await prisma.task.create({ data: { title: title.trim(), color } });
  res.status(201).json(created);
});

// PUT /tasks/:id
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  try {
    const updated = await prisma.task.update({ where: { id }, data: req.body });
    res.json(updated);
  } catch {
    res.status(404).json({ error: "Task not found" });
  }
});

// DELETE /tasks/:id
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  try {
    await prisma.task.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "Task not found" });
  }
});

export default router;
