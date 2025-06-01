export default function UserSelector({currentUserId, onChangeUser }) {
    return (
        <div className = "flex items-center space-x-2">
            <label className="text-gray-700 text-base font-semibold">Usuario ID:</label>
            <input
                type="text"
                value={currentUserId}
                onChange={(e) => onChangeUser(e.target.value)}
                placeholder="ID del usuario"
                className = "px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
        </div>
    )
}