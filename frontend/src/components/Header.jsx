import UserSelector from './UserSelector';

export default function Header({ currentUserId, onChangeUser, onSelectSection }) {
  return (
    <header className="bg-slate-200 shadow-md w-screen">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <nav className="space-x-4">
          <button onClick={() => onSelectSection('ingredientes')} className="text-gray-600 hover:text-gray-900">
            Ingredientes
          </button>
          <button onClick={() => onSelectSection('recetas')} className="text-gray-600 hover:text-gray-900">
            Recetas
          </button>
        </nav>

        <UserSelector currentUserId={currentUserId} onChangeUser={onChangeUser} />
      </div>
    </header>
  );
}