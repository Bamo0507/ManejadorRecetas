import api from "@services/api";
import { useState, useEffect } from "react";

export default function IngredienteForm({ onSuccess, currentUserId, ingredienteEdicion}) {
    const [nombre, setNombre] = useState('');

    // Actualizar el ingrediente cada que se de una edicion
    useEffect(() => {
        if (ingredienteEdicion) {
            setNombre(ingredienteEdicion.nombre);
        }
    }, [ingredienteEdicion]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(!nombre.trim()) {
            alert('El ingrediente debe tener un nombre');
            return;
        }

        try {
            if(ingredienteEdicion){
                await api.put('/ingredientes/${ingredienteEdicion._id}', { nombre });
            } else {
                await api.post('/ingredientes', { nombre });
            }

            setNombre('');
            onSuccess();
        } catch (error) {
            console.error(error);
            alert('Error al guardar el ingrediente');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre del ingrediente"
                className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

            <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                {ingredienteEdicion ? 'Actualizar' : 'Crear'}
            </button>

            {ingredienteEdicion && (
                <button
                type="button"
                onClick={() => {
                    setNombre('');
                    onSuccess();
                }}
                className="px-2 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                    Cancelar
                </button>
            )}
        </form>
    )
}