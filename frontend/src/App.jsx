import { useState } from 'react'
import Header from '@components/Header'
import IngredientesSection from '@components/Ingredientes/IngredientesSection'
import RecetasSection from '@components/Recetas/RecetasSection'

import '@styles/global.css'

function App() {
  const [currentUserId, setCurrentUserId] = useState('1');
  const [seccion, setSeccion] = useState('ingredientes');

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <Header
        currentUserId={currentUserId}
        onChangeUser={setCurrentUserId}
        onSelectSection={setSeccion}
      />

      <main className="p-6 w-full">
        {seccion === 'ingredientes' && (
          <IngredientesSection currentUserId={Number(currentUserId)} />
        )}
        {seccion === 'recetas' && (
          <RecetasSection currentUserId={Number(currentUserId)} />
        )}
        {seccion === 'reportes' && (
          <ReportesSection currentUserId={Number(currentUserId)} />
        )}
      </main>
    </div>
  );

};

export default App
