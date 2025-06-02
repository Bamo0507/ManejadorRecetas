import { useState, useRef, useEffect } from 'react';
import api from '@services/api';
import RecetaForm from './RecetaForm';

export default function RecetaList({ recetas, reload, currentUserId, onVerDetalle }) {
  const [editing, setEditing] = useState(null);

  const editFormRef = useRef(null);

  useEffect(() => {
    if (editing && editFormRef.current) {
      editFormRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [editing]);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar receta?')) return;
    try {
      await api.delete(`/recetas/${id}`);
      reload();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar la receta');
    }
  };

  const toggleFavorito = async (id_receta) => {
    if (!currentUserId) {
      alert('Debes ingresar un ID antes de crear o editar');
      return;
    }
    try {
      const resp = await api.post('/toggle_favorito', {
        id_receta,
        id_usuario: currentUserId,
      });
      alert(`Se ha ${resp.data.favorito ? 'agregado' : 'eliminado'} de favoritos`);
      reload();
    } catch (err) {
      console.error(err);
      alert('Error al actualizar favorito');
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {recetas.map((r) => (
        <div
          key={r.id}
          className={`p-4 rounded shadow ${r.isFavorito ? 'bg-blue-100' : 'bg-white'}`}
        >
          <div
            className="cursor-pointer flex flex-col space-y-1 w-full"
            onClick={() => onVerDetalle(r.id)}
          >
            <h3 className="text-lg font-semibold">{r.nombre}</h3>
            {r.isFavorito && (
              <p className="text-sm font-extrabold self-center uppercase text-slate-600">Favorito</p>
            )}
            <p className="text-gray-600 truncate my-2">{r.descripcion}</p>
            <p className="text-sm text-gray-500">Complejidad: <span className="font-medium text-gray-700">{r.complejidad}</span></p>
            <p className="text-sm text-gray-500">Momento Comida: <span className="font-medium text-gray-700">{r.momento_comida}</span></p>
            <p className="text-sm text-gray-500">Picante: <span className="font-medium text-gray-700">{r.nivel_picante}</span></p>
          </div>

          <div className="flex flex-col space-y-2 mt-4">
            <button
              onClick={() => setEditing(r)}
              className="px-3 py-1 bg-slate-600 text-white rounded hover:bg-slate-700 w-full text-center"
            >
              Editar
            </button>

            <button
              onClick={() => handleDelete(r.id)}
              className="px-3 py-1 bg-slate-600 text-white rounded hover:bg-slate-700 w-full text-center"
            >
              Borrar
            </button>

            <button
              onClick={() => toggleFavorito(r.id)}
              className="px-3 py-1 bg-slate-600 text-white rounded hover:bg-slate-700 w-full text-center"
            >
              Favorito
            </button>
          </div>

          {editing && editing.id === r.id && (
            <div ref={editFormRef} className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
              <div className="bg-white p-6 rounded shadow-lg w-80">
                <h3 className="text-xl font-semibold mb-2">Editando: {editing.nombre}</h3>
                <RecetaForm
                  recetaEdicion={editing}
                  onSuccess={() => {
                    reload();
                    setEditing(null);
                  }}
                  currentUserId={currentUserId}
                />
                <button
                  onClick={() => setEditing(null)}
                  className="mt-4 text-sm text-gray-600 underline"
                >
                  Cancelar edición
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}