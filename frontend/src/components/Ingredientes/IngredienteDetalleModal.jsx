import { useState, useEffect } from 'react';
import api from '@services/api';
import Modal from '../Modal';

export default function IngredienteDetalleModal({ ingredienteId, show, onClose }) {
  const [ingrediente, setIngrediente] = useState(null);
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    if (!show || !ingredienteId) return;

    api.get(`/ingredientes/${ingredienteId}/historial`).then((r) => setHistorial(r.data));
  }, [ingredienteId, show]);

  return (
    <Modal show={show} onClose={onClose} title={`Historial Ingrediente #${ingredienteId}`}>
      <div className="mb-4">
        <h4 className="font-semibold">Cambios de nombre</h4>
        <ul className="text-sm max-h-64 overflow-y-auto space-y-1">
          {historial.map((h) => (
            <li key={h.id} className="border-b pb-1">
              <span className="font-medium text-gray-700">
                [{new Date(h.realizado_en).toLocaleString()}]
              </span>{' '}
              De “{h.nombre_anterior}” a “{h.nombre_nuevo}”
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Cerrar
        </button>
      </div>
    </Modal>
  );
}