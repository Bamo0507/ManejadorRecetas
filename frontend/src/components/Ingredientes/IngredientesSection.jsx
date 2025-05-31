import {useState, useEffect} from "react";
import api from '@services/api';
import IngredienteForm from './IngredienteForm';
import IngredienteList from './IngredienteList';

export default function IngredientesSection({currentUserId}) {
    const [ingredientes, setIngredientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // hacer load de los ingredientes
    const fetchIngredientes = async () => {
        setLoading(true);
        try {
            const response = await api.get('/ingredientes');
            setIngredientes(response.data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    // que se cargue desde el inicio
    useEffect(() => {
        fetchIngredientes();
    }, []);

    return (
        <div className="w-full flex flex-col container items-center justify-center">

            <h1 className="text-2xl font-extrabold mb-4">Ingredientes</h1>

            {/* Formulario de creación de ingredientes */}
            <div className="mb-6">
                <IngredienteForm onSucess={fetchIngredientes} currentUserId={currentUserId} />
            </div>

            {/* Loading o error */}
            {loading ? (
                <p>Cargando...</p>
            ) : error ? (
                <p className="text-red-500">Error: {error.message}</p>
            ) : (
                // Listado de ingredientes
                <IngredienteList ingredientes={ingredientes} reload={fetchIngredientes}/>
            )}


        </div>
    )
}