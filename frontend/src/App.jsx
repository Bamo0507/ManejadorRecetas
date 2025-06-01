import { useState } from 'react'
import Header from '@components/Header'
import IngredientesSection from '@components/Ingredientes/IngredientesSection'
import RecetasSection from '@components/Recetas/RecetasSection'

import '@styles/global.css'

function App() {
  const [currentUserId, setCurrentUserId] = useState('');
  const [seccion, setSeccion] = useState('ingredientes');

  return (
    <div className="w-full min-h-screen flex flex-col">

      <Header
        currentUserId={currentUserId}
        onChangeUser={setCurrentUserId}
        onSelectSection={setSeccion}
      />

      <main className="flex-grow p-4 flex items-center flex-col">
        {seccion === 'ingredientes' && (
          <IngredientesSection currentUserId={currentUserId} />
        )}

        {seccion === 'recetas' && (
          <RecetasSection currentUserId={currentUserId} />
        )}
        
        {seccion === 'reportes' && (
          <ReportesSection currentUserId={currentUserId} />
        )}
      </main>
    </div>
  
  )

};

export default App
