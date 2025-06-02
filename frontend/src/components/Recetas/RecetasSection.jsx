import { useState, useEffect } from 'react';
import api from '@services/api';
import RecetaForm from './RecetaForm';
import RecetaList from './RecetaList';
import RecetaDetalleModal from './RecetaDetalleModal';

export default function RecetasSection({ currentUserId }) {
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [detalleId, setDetalleId] = useState(null);
  const [showDetalle, setShowDetalle] = useState(false);

  const fetchRecetas = async () => {
    setLoading(true);
    try {
        const response = await api.get(`/recetas?userId=${currentUserId}`);
        setRecetas(response.data);
        setError(null);
    } catch (err) {
        console.error(err);
        setError(err);
    } finally {
        setLoading(false);
    }
    };

    useEffect(() => {
        fetchRecetas();
    }, [currentUserId]);

  return (
    <div className="w-full flex flex-col items-center justify-center mx-auto min-h-screen">
      <h1 className="text-2xl font-extrabold mb-4">Recetas</h1>
      <div className="mb-6">
        <RecetaForm onSuccess={fetchRecetas} currentUserId={currentUserId} />
      </div>

      {loading && <p>Cargando recetas…</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}

      {!loading && !error && (
        <RecetaList
          recetas={recetas}
          reload={fetchRecetas}
          currentUserId={currentUserId}
          onVerDetalle={(id) => {
            setDetalleId(id);
            setShowDetalle(true);
          }}
        />
      )}

      <RecetaDetalleModal
        recetaId={detalleId}
        show={showDetalle}
        onClose={() => setShowDetalle(false)}
        currentUserId={currentUserId}
      />
    </div>
  );
}