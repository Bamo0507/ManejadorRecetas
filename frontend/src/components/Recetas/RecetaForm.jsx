import { useState, useEffect } from "react";
import api from "@services/api";

export default function RecetaForm({ onSuccess, currentUserId, recetaEdicion }) {
  const [todosIngredientes, setTodosIngredientes] = useState([]);
  const [todasUnidades, setTodasUnidades] = useState([]);
  const [todasAlergias, setTodasAlergias] = useState([]);
  const [todosUtensilios, setTodosUtensilios] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    complejidad: "MEDIA",
    momento_comida: "DESAYUNO",
    nivel_picante: "NULO",
    tiempo_completacion: 10,
    ingredientesSeleccionados: [], 
    alergiasSeleccionadas: [], 
    utensiliosSeleccionados: [] 
  });


  useEffect(() => {
    api.get("/ingredientes").then((r) => setTodosIngredientes(r.data));
    api.get("/unidades").then((r) => setTodasUnidades(r.data));
    api.get("/alergias").then((r) => setTodasAlergias(r.data));
    api.get("/utensilios").then((r) => setTodosUtensilios(r.data));

    if (recetaEdicion) {
      setForm((prev) => ({
        ...prev,
        nombre: recetaEdicion.nombre,
        descripcion: recetaEdicion.descripcion,
        complejidad: recetaEdicion.complejidad,
        momento_comida: recetaEdicion.momento_comida,
        nivel_picante: recetaEdicion.nivel_picante,
        tiempo_completacion: recetaEdicion.tiempo_completacion
      }));

      // Cargar relaciones actuales
      api.get(`/recetas/${recetaEdicion.id}/ingredientes`).then((r) => {
        const arr = r.data.map((i) => ({
          id_ingrediente: i.id_ingrediente,
          id_unidades: i.id_unidades,
          cantidad: i.cantidad
        }));
        setForm((prev) => ({ ...prev, ingredientesSeleccionados: arr }));
      });
      api.get(`/recetas/${recetaEdicion.id}/alergias`).then((r) => {
        setForm((prev) => ({
          ...prev,
          alergiasSeleccionadas: r.data.map((a) => a.id_alergia)
        }));
      });
      api.get(`/recetas/${recetaEdicion.id}/utensilios`).then((r) => {
        setForm((prev) => ({
          ...prev,
          utensiliosSeleccionados: r.data.map((u) => u.id_utensilio)
        }));
      });
    }
  }, [recetaEdicion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "tiempo_completacion" ? Number(value) : value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUserId) {
      alert("Debes ingresar un ID antes de crear o editar");
      return;
    }

    try {
      let recetaId;

      if (recetaEdicion) {
        await api.patch(`/recetas/${recetaEdicion.id}`, {
          nombre: form.nombre,
          descripcion: form.descripcion
        });
        onSuccess();
        return;
      } else {
        const resp = await api.post("/recetas", {
          nombre: form.nombre,
          descripcion: form.descripcion,
          complejidad: form.complejidad,
          momento_comida: form.momento_comida,
          nivel_picante: form.nivel_picante,
          tiempo_completacion: form.tiempo_completacion,
          creado_por: currentUserId
        });
        recetaId = resp.data.id;
      }

      // Insertar ingredientes
      if (form.ingredientesSeleccionados.length > 0) {
        await api.post(`/recetas/${recetaId}/ingredientes`, {
          ingredientes: form.ingredientesSeleccionados.map((it) => ({
            id_ingrediente: it.id_ingrediente,
            id_unidades: it.id_unidades,
            cantidad: it.cantidad
          }))
        });
      }

      // Insertar alergias
      if (form.alergiasSeleccionadas.length > 0) {
        await api.post(`/recetas/${recetaId}/alergias`, {
          alergias: form.alergiasSeleccionadas.map((id) => ({
            id_alergia: id
          }))
        });
      }

      // Insertar utensilios
      if (form.utensiliosSeleccionados.length > 0) {
        await api.post(`/recetas/${recetaId}/utensilios`, {
          utensilios: form.utensiliosSeleccionados.map((id) => ({
            id_utensilio: id
          }))
        });
      }

      // Resetear formulario
      setForm({
        nombre: "",
        descripcion: "",
        complejidad: "MEDIA",
        momento_comida: "DESAYUNO",
        nivel_picante: "NULO",
        tiempo_completacion: 10,
        ingredientesSeleccionados: [],
        alergiasSeleccionadas: [],
        utensiliosSeleccionados: []
      });

      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Error al guardar la receta completa");
    }
  };

  // 6) Renderizado del formulario
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto bg-blue-100 p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {/* Campos básicos */}
      <div className="col-span-2 mb-4">
        <label className="block text-gray-700 text-lg">Nombre</label>
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div className="col-span-2 mb-4">
        <label className="block text-gray-700 text-lg">Descripción</label>
        <input
          type="text"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      {!recetaEdicion && (
        <>
          <div className="mb-4 md:mb-0">
            <label className="block text-gray-700 text-lg">Complejidad</label>
            <select
              name="complejidad"
              value={form.complejidad}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400"
            >
              <option value="BAJA">BAJA</option>
              <option value="MEDIA">MEDIA</option>
              <option value="ALTA">ALTA</option>
            </select>
          </div>

          <div className="mb-4 md:mb-0">
            <label className="block text-gray-700 text-lg">Momento</label>
            <select
              name="momento_comida"
              value={form.momento_comida}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400"
            >
              <option value="DESAYUNO">DESAYUNO</option>
              <option value="ALMUERZO">ALMUERZO</option>
              <option value="CENA">CENA</option>
              <option value="POSTRE">POSTRE</option>
              <option value="SNACK">SNACK</option>
            </select>
          </div>

          <div className="mb-4 md:mb-0">
            <label className="block text-gray-700 text-lg">Nivel de picante</label>
            <select
              name="nivel_picante"
              value={form.nivel_picante}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400"
            >
              <option value="NULO">NULO</option>
              <option value="SUAVE">SUAVE</option>
              <option value="MEDIO">MEDIO</option>
              <option value="FUERTE">FUERTE</option>
              <option value="EXTREMO">EXTREMO</option>
            </select>
          </div>

          <div className="mb-4 md:mb-0">
            <label className="block text-gray-700 text-lg">Tiempo (minutos)</label>
            <input
              type="number"
              name="tiempo_completacion"
              value={form.tiempo_completacion}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400"
              min="1"
              required
            />
          </div>
        </>
      )}

      {!recetaEdicion && (
        <>
          {/* Sección Ingredientes */}
          <div className="col-span-2 mb-6">
            <h4 className="font-semibold text-lg mb-2">Ingredientes de la receta</h4>
            {form.ingredientesSeleccionados.map((item, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-2 mb-2">
                <select
                  value={item.id_ingrediente}
                  onChange={(e) => {
                    const copia = [...form.ingredientesSeleccionados];
                    copia[idx].id_ingrediente = Number(e.target.value);
                    setForm((prev) => ({
                      ...prev,
                      ingredientesSeleccionados: copia
                    }));
                  }}
                  className="px-2 py-1 border rounded"
                >
                  <option value="">-- Selecciona ingrediente --</option>
                  {todosIngredientes.map((ing) => (
                    <option key={ing.id} value={ing.id}>
                      {ing.nombre}
                    </option>
                  ))}
                </select>

                <select
                  value={item.id_unidades}
                  onChange={(e) => {
                    const copia = [...form.ingredientesSeleccionados];
                    copia[idx].id_unidades = Number(e.target.value);
                    setForm((prev) => ({
                      ...prev,
                      ingredientesSeleccionados: copia
                    }));
                  }}
                  className="px-2 py-1 border rounded"
                >
                  <option value="">-- Unidad --</option>
                  {todasUnidades.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nombre}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  value={item.cantidad}
                  onChange={(e) => {
                    const copia = [...form.ingredientesSeleccionados];
                    copia[idx].cantidad = Number(e.target.value);
                    setForm((prev) => ({
                      ...prev,
                      ingredientesSeleccionados: copia
                    }));
                  }}
                  placeholder="Cantidad"
                  className="px-2 py-1 border rounded"
                />

                <button
                  type="button"
                  onClick={() => {
                    const copia = form.ingredientesSeleccionados.filter((_, i) => i !== idx);
                    setForm((prev) => ({ ...prev, ingredientesSeleccionados: copia }));
                  }}
                  className="col-span-3 text-blue-600 hover:underline text-sm"
                >
                  Eliminar ingrediente
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                setForm((prev) => ({
                  ...prev,
                  ingredientesSeleccionados: [
                    ...prev.ingredientesSeleccionados,
                    { id_ingrediente: "", id_unidades: "", cantidad: 1 }
                  ]
                }));
              }}
              className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              + Agregar ingrediente
            </button>
          </div>

          {/* Sección Alergias */}
          <div className="col-span-2 mb-4">
            <h4 className="font-semibold text-lg mb-2">Alergias</h4>
            <div className="grid grid-cols-2 gap-2">
              {todasAlergias.map((al) => (
                <label key={al.id} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.alergiasSeleccionadas.includes(al.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setForm((prev) => ({
                          ...prev,
                          alergiasSeleccionadas: [...prev.alergiasSeleccionadas, al.id]
                        }));
                      } else {
                        setForm((prev) => ({
                          ...prev,
                          alergiasSeleccionadas: prev.alergiasSeleccionadas.filter((x) => x !== al.id)
                        }));
                      }
                    }}
                  />
                  <span>{al.nombre}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sección Utensilios */}
          <div className="col-span-2 mb-4">
            <h4 className="font-semibold text-lg mb-2">Utensilios</h4>
            <div className="grid grid-cols-2 gap-2">
              {todosUtensilios.map((ut) => (
                <label key={ut.id} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.utensiliosSeleccionados.includes(ut.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setForm((prev) => ({
                          ...prev,
                          utensiliosSeleccionados: [...prev.utensiliosSeleccionados, ut.id]
                        }));
                      } else {
                        setForm((prev) => ({
                          ...prev,
                          utensiliosSeleccionados: prev.utensiliosSeleccionados.filter((x) => x !== ut.id)
                        }));
                      }
                    }}
                  />
                  <span>{ut.nombre}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Botón Crear/Actualizar */}
      <div className="col-span-2 mt-4">
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          {recetaEdicion ? "Actualizar Receta" : "Crear Receta"}
        </button>
      </div>
    </form>
  );
}