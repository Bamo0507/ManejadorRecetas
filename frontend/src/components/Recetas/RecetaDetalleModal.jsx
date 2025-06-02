import { useState, useEffect } from 'react';
import api from '@services/api';
import Modal from '../Modal';

export default function RecetaDetalleModal({ recetaId, show, onClose, currentUserId }) {
  const [receta, setReceta] = useState(null);
  const [ingredientes, setIngredientes] = useState([]);
  const [alergias, setAlergias] = useState([]);
  const [utensilios, setUtensilios] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [valoraciones, setValoraciones] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [nuevaValoracion, setNuevaValoracion] = useState(1);

  useEffect(() => {
    if (!show || !recetaId) return;

    api.get('/recetas').then((resp) => {
      const data = resp.data.find((r) => r.id === recetaId);
      setReceta(data);
    });

    // 2) Relaciones
    api.get(`/recetas/${recetaId}/ingredientes`).then((r) => setIngredientes(r.data));
    api.get(`/recetas/${recetaId}/alergias`).then((r) => setAlergias(r.data));
    api.get(`/recetas/${recetaId}/utensilios`).then((r) => setUtensilios(r.data));
    api.get(`/recetas/${recetaId}/comentarios`).then((r) => setComentarios(r.data));
    api.get(`/recetas/${recetaId}/valoraciones`).then((r) => setValoraciones(r.data));
    api.get(`/recetas/${recetaId}/historial`).then((r) => setHistorial(r.data));
  }, [recetaId, show]);

  const handleAgregarComentario = async () => {
    if (!nuevoComentario.trim() || !currentUserId) return;
    await api.post(`/recetas/${recetaId}/comentarios`, {
      id_usuario: currentUserId,
      comentario: nuevoComentario,
    });
    const resp = await api.get(`/recetas/${recetaId}/comentarios`);
    setComentarios(resp.data);
    setNuevoComentario('');
  };

  const handleAgregarValoracion = async () => {
    if (!currentUserId) return;
    await api.post(`/recetas/${recetaId}/valoraciones`, {
      id_usuario: currentUserId,
      valoracion: nuevaValoracion,
    });
    const resp = await api.get(`/recetas/${recetaId}/valoraciones`);
    setValoraciones(resp.data);
  };

  const promedio = () => {
    if (valoraciones.length === 0) return '—';
    const s = valoraciones.reduce((acc, v) => acc + v.valoracion, 0);
    return (s / valoraciones.length).toFixed(1);
  };

  return (
    <Modal show={show} onClose={onClose} title={receta?.nombre ?? 'Detalle'}>
      {!receta ? (
        <p>Cargando…</p>
      ) : (
        <>
          <p className="text-gray-600 mb-4">{receta.descripcion}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="font-semibold">Datos básicos</h4>
              <ul className="text-sm text-black">
                <li>Complejidad: {receta.complejidad}</li>
                <li>Momento: {receta.momento_comida}</li>
                <li>Picante: {receta.nivel_picante}</li>
                <li>Tiempo (min): {receta.tiempo_completacion}</li>
                <li>Creada por: {receta.creado_por_username}</li>
                <li>
                  Fecha creación:{' '}
                  {new Date(receta.fecha_creacion).toLocaleDateString()}
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Ingredientes</h4>
              <ul className="list-disc ml-6 text-sm">
                {ingredientes.map((i) => (
                  <li key={i.id}>
                    {i.nombre} — Cantidad: {i.cantidad}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="font-semibold">Alergias</h4>
              <ul className="list-disc ml-6 text-sm">
                {alergias.map((a) => (
                  <li key={a.id}>{a.nombre}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Utensilios</h4>
              <ul className="list-disc ml-6 text-sm">
                {utensilios.map((u) => (
                  <li key={u.id}>
                    {u.nombre} — <span className="text-gray-600">{u.descripcion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold">Comentarios</h4>
            <ul className="space-y-2 mb-2 max-h-40 overflow-y-auto text-sm">
              {comentarios.map((c) => (
                <li key={c.id} className="border-b pb-1">
                  <strong>Usuario {c.id_usuario}:</strong> {c.comentario}
                </li>
              ))}
            </ul>
            <div className="flex space-x-2">
              <input
                type="text"
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                placeholder="Escribe tu comentario..."
                className="flex-1 px-2 py-1 border rounded"
              />
              <button
                onClick={handleAgregarComentario}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Comentar
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold">
              Valoraciones (Prom: {promedio()})
            </h4>
            <ul className="text-sm mb-2 max-h-32 overflow-y-auto">
              {valoraciones.map((v) => (
                <li key={v.id}>
                  Usuario {v.id_usuario}: {v.valoracion} ⭐
                </li>
              ))}
            </ul>
            <div className="flex items-center space-x-2">
              <select
                value={nuevaValoracion}
                onChange={(e) => setNuevaValoracion(Number(e.target.value))}
                className="px-2 py-1 border rounded"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} ⭐
                  </option>
                ))}
              </select>
              <button
                onClick={handleAgregarValoracion}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Valorar
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold">Historial de cambios</h4>
            <ul className="text-sm max-h-40 overflow-y-auto space-y-1">
              {historial.map((h) => (
                <li key={h.id} className="border-b pb-1">
                  <span className="font-medium text-gray-700">
                    [{new Date(h.realizado_en).toLocaleString()}]
                  </span>{' '}
                  {h.atributo_modificado} — de “{h.valor_anterior}” a “{h.valor_nuevo}”
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
        </>
      )}
    </Modal>
  );
}