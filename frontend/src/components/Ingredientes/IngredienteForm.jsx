import api from "@services/api";
import { useState, useEffect } from "react";

export default function IngredienteForm({
  onSuccess,
  ingredienteEdicion,
}) {
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    if (ingredienteEdicion) {
      setNombre(ingredienteEdicion.nombre);
    }
  }, [ingredienteEdicion]);

  const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nombre.trim()) {
        alert("El ingrediente debe tener un nombre");
        return;
        }
    
        try {
            if (ingredienteEdicion) {
                console.log("Editando ingrediente con id:", ingredienteEdicion.id);
                console.log("URL completa:", `/ingredientes/${ingredienteEdicion.id}`);
                await api.patch(
                `/ingredientes/${ingredienteEdicion.id}`,
                { nombre }
                );
            } else {
                await api.post("/ingredientes", { nombre });
            }
            setNombre("");
            onSuccess();
        } catch (error) {
            console.error(error);
            alert("Error al guardar el ingrediente");
        }
    };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${
        ingredienteEdicion
          ? "flex flex-col space-y-2" 
          : "flex items-center space-x-2" 
      }`}
    >
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre del ingrediente"
        className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 flex-1"
      />

      <button
        type="submit"
        className={`px-4 py-2 ${
          ingredienteEdicion
            ? "self-start bg-slate-600 hover:bg-slate-700 text-sm"
            : "bg-blue-600 hover:bg-blue-700"
        } text-white rounded`}
      >
        {ingredienteEdicion ? "Actualizar" : "Crear"}
      </button>
    </form>
  );
}