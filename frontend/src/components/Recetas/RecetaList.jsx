import { useState } from "react";
import api from "@services/api";
import RecetaForm from "./RecetaForm";

export default function RecetaList({ recetas, reload, currentUserId }) {
    const [recetaEdicion, setRecetaEdicion] = useState(null);

    const handleDelete = async (id) => {
        if(!window.confirm('Eliminar receta?')) return;

        try {
            await api.delete(`/recetas/${id}`);
            reload();
        } catch (error) {
            console.error(error);
            alert('Error al eliminar la receta');
        }
    };
    
    const toggleFavorito = async (id_receta) => {
        if(!currentUserId){
            alert('Debes ingresar un ID antes de crear o editar');
            return;
        }

        try {
            const response = await api.post(
                `/toggle_favorito`,
                { id_receta, id_usuario: currentUserId }
            );
            alert(`Se ha ${respponse.data.favorito ? 'agregado' : 'eliminado'} de favoritos`);
            reload();
        } catch (error) {
            console.error(error);
            alert('Error al agregar a favoritos');
        }
    };

    return (
        <div className="space-y-4 mt-4">
          {recetas.map((r) => (
            <div
              key={r.id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{r.nombre}</h3>
                <p className="text-gray-600">{r.descripcion}</p>
                <p className="text-sm text-gray-500">
                  {r.complejidad} • {r.momento_comida} • Picante: {r.nivel_picante}
                </p>
              </div>

              <div className="space-x-2">
                <button
                  onClick={() => setEditing(r)}
                  className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                >
                  Editar
                </button>

                <button
                  onClick={() => handleDelete(r.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Borrar
                </button>

                <button
                  onClick={() => toggleFavorito(r.id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Favorito
                </button>

              </div>
            </div>
          ))}
    
          {editing && (
            <div className="mt-6 p-4 bg-gray-50 rounded shadow">
              <h3 className="text-xl font-semibold mb-2">
                Editando receta: {editing.nombre}
              </h3>
              <RecetaForm
                recetaEdicion={editing}
                onSuccess={() => {
                  reload();
                  setEditing(null);
                }}
                currentUserId={currentUserId}
              />
            </div>
          )}
        </div>
    );
}