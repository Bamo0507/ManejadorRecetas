import { Router, Request, Response } from "express";

const router = Router();

interface Dino {
  id: number;
  name: string;
  specie: string;
}

const dinos: Dino[] = [
  { id: 1, name: "Rexy", specie: "T-Rex" },
  { id: 2, name: "Blue", specie: "Raptor" }
];

// Get all dinos
router.get("/dinos", (req: Request, res: Response) => {
  res.json(dinos);
});

// Get a Dino by ID
router.get("/dinos/:id", (req: Request, res: Response) => {
  const DinoId = parseInt(req.params.id);
  const Dino = dinos.find(b => b.id === DinoId);
  if (Dino) {
    res.json(Dino);
  } else {
    res.status(404).json({ message: "Dino not found" });
  }
});

// Create a new Dino
router.post("/dinos", (req: Request, res: Response) => {
  const newDino: Dino = {
    id: dinos.length + 1,
    name: req.body.name,
    specie: req.body.specie
  };
  dinos.push(newDino);
  res.status(201).json(newDino);
});

// Update a Dino by ID
router.put("/dinos/:id", (req: Request, res: Response) => {
  const DinoId = parseInt(req.params.id);
  const DinoIndex = dinos.findIndex(b => b.id === DinoId);

  if (DinoIndex !== -1) {
    dinos[DinoIndex] = { id: DinoId, name: req.body.name, specie: req.body.specie };
    res.json(dinos[DinoIndex]);
  } else {
    res.status(404).json({ message: "Dino not found" });
  }
});

// Delete a Dino by ID
router.delete("/dinos/:id", (req: Request, res: Response) => {
  const DinoId = parseInt(req.params.id);
  const DinoIndex = dinos.findIndex(b => b.id === DinoId);

  if (DinoIndex !== -1) {
    dinos.splice(DinoIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: "Dino not found" });
  }
});

export default router;