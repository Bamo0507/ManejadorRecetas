import { useState, useEffect } from "react";
import api from "@services/api";

export default function RecetaForm({ onSucess, currentUserId, recetaEdicion }) {
    // TODO: Actualizar con ingredientes utensilios y demas cosas
    const [form, setForm] = useState({
        nombre: '',
        descripcion: '',
        complejidad: 'MEDIA',
        momento_comida: 'DESAYUNO',
        nivel_picante: 'NULO',
        tiempo_completacion: 10,
    });

    useEffect(() => {
        if (recetaEdicion) {
            setForm({
                nombre: recetaEdicion.nombre,
                descripcion: recetaEdicion.descripcion,
                complejidad: recetaEdicion.complejidad,
                momento_comida: recetaEdicion.momento_comida,
                nivel_picante: recetaEdicion.nivel_picante,
                tiempo_completacion: recetaEdicion.tiempo_completacion
            })
        }
    }, [recetaEdicion]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
          ...prev,
          [name]: name === 'tiempo_completacion' ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!currentUserId){
            alert('Debes ingresar un ID antes de crear o editar');
            return;
        }

        try {
            if(recetaEdicion) {
                await api.put(`/recetas/${recetaEdicion._id}`, {
                    ...form,
                    creado_por: currentUserId
                });
            } else {
                await api.post('/recetas', {
                    ...form,
                    creado_por: currentUserId
                });
            }
            setForm({
                nombre: '',
                descripcion: '',
                complejidad: 'MEDIA',
                momento_comida: 'DESAYUNO',
                nivel_picante: 'NULO',
                tiempo_completacion: 10,
            });
            onSucess();
        } catch (error) {
            console.error(error);
            alert('Error al guardar la receta');
        }
    };

    //TODO: INCORPORAR MAS CAMPOS PARA LA RECETA UTENSILIOS, INGREDIENTES, ETC
    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre */}
          <div>
            <label className="block text-gray-700">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
    
          {/* Descripción */}
          <div>
            <label className="block text-gray-700">Descripción</label>
            <input
              type="text"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
    
          {/* Complejidad */}
          <div>
            <label className="block text-gray-700">Complejidad</label>
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
    
          {/* Momento de comida */}
          <div>
            <label className="block text-gray-700">Momento de comida</label>
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
    
          {/* Nivel de picante */}
          <div>
            <label className="block text-gray-700">Nivel de picante</label>
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
    
          {/* Tiempo de completación */}
          <div>
            <label className="block text-gray-700">Tiempo (minutos)</label>
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
    
          {/* Botón Crear/Actualizar */}
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              {recetaEdicion ? 'Actualizar Receta' : 'Crear Receta'}
            </button>
          </div>
        </form>
    );
}