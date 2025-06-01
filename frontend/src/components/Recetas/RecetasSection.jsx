import api from "@services/api";
import { useState, useEffect } from "react";
import RecetaForm from "./RecetaForm";
import RecetaList from "./RecetaList";

export default function RecetasSection({ currentUserId }) {
    const [recetas, setRecetas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRecetas = async() => {
        setLoading(true);

        try {
            const response = await api.get('/recetas');
            setRecetas(response.data);
            setError(null);
        } catch(error){
            console.log(error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    // Ejecutar el fetch desde el inicio
    useEffect(() => {
        fetchRecetas();
    }, []);

    return (
        <div className="w-full flex flex-col container items-center justify-center">
            <h1 className="text-2xl font-extrabold mb-4">Recetas</h1>

            {/* Formulario de creación de recetas */}
            <div className="mb-6">
                <RecetaForm 
                onSucess={fetchRecetas}
                currentUserId={currentUserId}
                />
            </div>

            {loading && <p>Cargando recetas...</p>}
            {error && <p className="text-red-500">Error al cargar recetas: {error.message}</p>}

            {!loading && !error && (
                <RecetaList recetas={recetas} reload={fetchRecetas} currentUserId={currentUserId} />
            )}

        </div>
    );
}