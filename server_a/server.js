import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;
const SERVER_B_URL = process.env.SERVER_B_URL || "http://serverb:8090";
const DATA_FILE = path.resolve("./data/animals.json");

app.get("/health", (_req, res) => res.json({ status: "ok" }));

// GET /animals
app.get("/animals", async (_req, res) => {
  try {
    const data = JSON.parse(await fs.readFile(DATA_FILE, "utf-8"));
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /animals/:id
app.get("/animals/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = JSON.parse(await fs.readFile(DATA_FILE, "utf-8"));
    const animal = data.find(a => Number(a.id) === id);
    if (!animal) return res.status(404).json({ error: "Animal not found" });
    res.json(animal);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /animals/:id/adopt -> forward Server B:lle
app.post("/animals/:id/adopt", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = JSON.parse(await fs.readFile(DATA_FILE, "utf-8"));
    const animal = data.find(a => Number(a.id) === id);
    if (!animal) return res.status(404).json({ error: "Animal not found" });
    if (animal.status === "adopted") return res.status(409).json({ error: "already adopted" });

    const r = await fetch(`${SERVER_B_URL}/adoptions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ animalId: id, applicant: req.body?.applicant || {} })
    });
    const result = await r.json();

    if (result.status === "approved") {
      const idx = data.findIndex(a => Number(a.id) === id);
      data[idx].status = "adopted";
      await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    }

    res.status(r.ok ? 200 : r.status).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log(`🐕 Server A running on port ${PORT}`));
