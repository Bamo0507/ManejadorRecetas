import { useState } from 'react';
import api from '@services/api';
export default function ReportesSection(){
    const [reporte1Data, setReporte1Data] = useState(null);
    const [reporte2Data, setReporte2Data] = useState(null);
    const [reporte3Data, setReporte3Data] = useState(null);

    const handleFiltersReporte1 = async (filtros) => {
        try {
          const response = await api.get('/reportes/recetas-detalladas', {
            params: filtros,
          });
          setReporte1Data(response.data);
        } catch (err) {
          console.error(err);
          alert('Error al generar Reporte 1');
        }
    };

    const handleFiltersReporte2 = async (filtros) => {
        try {
          const response = await api.get('/reportes/popularidad-valoraciones', {
            params: filtros,
          });
          setReporte2Data(response.data);
        } catch (err) {
          console.error(err);
          alert('Error al generar Reporte 2');
        }
    };

    const handleFiltersReporte3 = async (filtros) => {
        try {
          const response = await api.get('/reportes/utensilios-frecuencia', {
            params: filtros,
          });
          setReporte3Data(response.data);
        } catch (err) {
          console.error(err);
          alert('Error al generar Reporte 3');
        }
    };

    //TODO: AJUSTAR A COMO BRANDON ME LOS DEVUELVA
    return (
        <div>
          <h1 className="text-2xl font-bold mb-6">Reportes</h1>
    
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ──────────── Reporte 1 ──────────── */}
            <div>
              <ReportCard
                titulo="Recetas Detalladas"
                onApplyFilters={handleFiltersReporte1}
              />
              {reporte1Data && reporte1Data.length > 0 && (
                <ReportTable
                  fileName="reporte_recetas_detalladas"
                  columns={[
                    { key: 'id', header: 'ID' },
                    { key: 'nombre', header: 'Nombre' },
                    { key: 'descripcion', header: 'Descripción' },
                    { key: 'complejidad', header: 'Complejidad' },
                    { key: 'momento_comida', header: 'Momento' },
                    { key: 'nivel_picante', header: 'Picante' },
                    { key: 'tiempo_completacion', header: 'Tiempo (min)' },
                    { key: 'creado_por', header: 'Creado Por' },
                  ]}
                  data={reporte1Data}
                />
              )}
            </div>
    
            {/* ──────────── Reporte 2 ──────────── */}
            <div>
              <ReportCard
                titulo="Popularidad y Valoraciones"
                onApplyFilters={handleFiltersReporte2}
              />
              {reporte2Data && reporte2Data.length > 0 && (
                <ReportTable
                  fileName="reporte_popularidad_valoraciones"
                  columns={[
                    { key: 'id_receta', header: 'ID Receta' },
                    { key: 'nombre_receta', header: 'Nombre' },
                    { key: 'fav_count', header: 'Favoritos' },
                    { key: 'total_valoraciones', header: 'Total Val.' },
                    { key: 'promedio_valoracion', header: 'Promedio' },
                    { key: 'usuarios_distintos', header: 'Usuarios Únicos' },
                    { key: 'fecha_primera_valoracion', header: '1ª Valoración' },
                    { key: 'fecha_ultima_valoracion', header: 'Última Valoración' },
                  ]}
                  data={reporte2Data}
                />
              )}
            </div>
    
            {/* ──────────── Reporte 3 ──────────── */}
            <div>
              <ReportCard
                titulo="Utensilios y Frecuencia"
                onApplyFilters={handleFiltersReporte3}
              />
              {reporte3Data && reporte3Data.length > 0 && (
                <ReportTable
                  fileName="reporte_utensilios_frecuencia"
                  columns={[
                    { key: 'id_utensilio', header: 'ID Utensilio' },
                    { key: 'nombre_utensilio', header: 'Nombre' },
                    { key: 'descripcion_utensilio', header: 'Descripción' },
                    { key: 'veces_usado', header: 'Veces Usado' },
                    { key: 'fecha_primera_aparicion', header: 'Primera Aparición' },
                    { key: 'fecha_ultima_aparicion', header: 'Última Aparición' },
                  ]}
                  data={reporte3Data}
                />
              )}
            </div>
          </div>
        </div>
    );
}