import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

// ---- File paths ------------------------------------------------------------
const DATA_FILE = path.resolve("./data/adoptions.json");

// ---- Helpers ---------------------------------------------------------------
async function loadAdoptions() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch {
    // jos tiedostoa ei vielä ole
    return [];
  }
}

async function saveAdoptions(list) {
  await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2));
}

// ---- Routes ----------------------------------------------------------------
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Kaikki adoptiot (diagnostiikkaa/oppimista varten)
app.get("/adoptions", async (_req, res) => {
  const adoptions = await loadAdoptions();
  res.json(adoptions);
});

/**
 * POST /adoptions
 * Body: { animalId: number, applicant?: { name?, email?, phone?, message? } }
 * Palauttaa: { status: "approved", adoptionId }
 * - Estää kaksoisadoption: jos sama eläin on jo approved, palauttaa 409
 */
app.post("/adoptions", async (req, res) => {
  try {
    const { animalId, applicant = {} } = req.body || {};
    const idNum = Number(animalId);

    if (!Number.isFinite(idNum)) {
      return res.status(400).json({ status: "rejected", message: "animalId required (number)" });
    }

    const adoptions = await loadAdoptions();

    // jos eläin on jo hyväksytysti adoptoitu, estä uusinta
    const alreadyApproved = adoptions.some(a => Number(a.animalId) === idNum && a.status === "approved");
    if (alreadyApproved) {
      return res.status(409).json({ status: "rejected", message: "already adopted" });
    }

    // tässä demossa hyväksytään heti (status: approved)
    const record = {
      id: Date.now(),               // yksinkertainen uniikki tunniste
      animalId: idNum,
      applicant: {
        name: applicant.name ?? "",
        email: applicant.email ?? "",
        phone: applicant.phone ?? "",
        message: applicant.message ?? ""
      },
      date: new Date().toISOString(),
      status: "approved"
    };

    adoptions.push(record);
    await saveAdoptions(adoptions);

    return res.json({ status: "approved", adoptionId: record.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", message: "internal error" });
  }
});

// ---- Start -----------------------------------------------------------------
const PORT = process.env.PORT || 8090;
app.listen(PORT, () => console.log(`🐾 Server B running on port ${PORT}`));
