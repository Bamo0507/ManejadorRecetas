import { useState } from 'react';
import api from '@services/api';
import IngredienteForm from './IngredienteForm';

export default function IngredienteList({ ingredientes, reload}){
    const [editing, setEditing] = useState(null);

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este ingrediente?')) {
            return;
        }
        try {
            await api.delete(`/ingredientes/${id}`);
            reload();
        } catch (error) {
            console.error(error);
            alert('Error al eliminar el ingrediente');
        }
    };

    return (
        <div className="space-y-4">
            {ingredientes.map((ingrediente) => (
                <div
                key={ing.id}
                className="flex itemscenter jsutify-between p-3 bg-white rounded shadow"
                >
                    <span className="text-gray-800">{ingrediente.nombre}</span>

                    <div className="flex space-x-2">
                        <button
                        onClick={() => setEditing(ingrediente)}
                        className="text-blue-600 hover:text-blue-800"
                        >
                        Editar
                        </button>

                        <button
                        onClick={() => handleDelete(ingrediente._id)}
                        className="text-red-600 hover:text-red-800"
                        >
                        Eliminar
                        </button>
                    </div>

                    {editing && (
                        <div className="mt-4 p-4 bg-gray-50 rounded shadow">
                        <h3 className="text-lg font-semibold mb-2">
                            Editando: {editing.nombre}
                        </h3>
                        <IngredienteForm
                            ingredienteEdicion={editing}
                            onSuccess={() => {
                            reload();
                            setEditing(null);
                            }}
                        />
                        </div>
                    )}
                </div>
            ))}

        </div>
    )
}