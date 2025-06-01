import express, { Request, Response } from "express";
import dinoRoutes from "./routes/apiExample";
import recetaRoutes from "./routes/endPointsRecetas"; // Assuming you have a similar route file for recetas
import ingredienteRoutes from "./routes/endPointsIngredientes"; // Assuming you have a similar route file for ingredientes
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/test", dinoRoutes);
app.use("/api", recetaRoutes); // replace bookRoutes with your actual route handler for entityone
app.use("/api", ingredienteRoutes); // Uncomment and replace with your actual route handler for entityone
// app.use("/entitytwo", bookRoutes); // Uncomment and replace with your actual route handler for entitytwo

app.get("/", (req: Request, res: Response) => {
  res.send("Recetas Api esta funcionando");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});