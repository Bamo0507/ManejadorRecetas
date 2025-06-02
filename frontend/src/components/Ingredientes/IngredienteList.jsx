import { useState } from 'react';
import api from '@services/api';
import IngredienteForm from './IngredienteForm';
import IngredienteDetalleModal from './IngredienteDetalleModal';

export default function IngredienteList({ ingredientes, reload }) {
  const [editing, setEditing] = useState(null);
  const [detalleId, setDetalleId] = useState(null);
  const [showDetalle, setShowDetalle] = useState(false);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este ingrediente?')) return;
    try {
      await api.delete(`/ingredientes/${id}`);
      reload();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar ingrediente');
    }
  };

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5 mb-10">
        {ingredientes.map((ingrediente) => (
          <div
            key={ingrediente.id}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between w-full"
          >
            <div className="space-y-2">
              <h3
                className="text-lg font-semibold text-gray-800 cursor-pointer"
                onClick={() => {
                  setDetalleId(ingrediente.id);
                  setShowDetalle(true);
                }}
              >
                {ingrediente.nombre}
              </h3>
              <p className="text-sm text-gray-500">
                Recetas asociadas:{' '}
                <span className="font-medium text-gray-700">
                  {ingrediente.recetas_count}
                </span>
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => setEditing(ingrediente)}
                className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(ingrediente.id)}
                className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Eliminar
              </button>
            </div>

            {editing && editing.id === ingrediente.id && (
              <div className="mt-4 bg-gray-50 p-3 rounded">
                <IngredienteForm
                  ingredienteEdicion={editing}
                  onSuccess={() => {
                    reload();
                    setEditing(null);
                  }}
                />
                <button
                  onClick={() => setEditing(null)}
                  className="mt-2 text-xs text-gray-600 hover:underline"
                >
                  Cancelar edición
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <IngredienteDetalleModal
        ingredienteId={detalleId}
        show={showDetalle}
        onClose={() => setShowDetalle(false)}
      />
    </>
  );
}