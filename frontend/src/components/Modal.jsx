export default function Modal({ show, onClose, children, title }) {
    if (!show) return null;
    return (
      <>
        <div
          className="fixed inset-0 bg-transparent z-40"
          onClick={onClose}
        />

        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center border-b px-4 py-2">
              <h2 className="text-xl font-semibold">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[80vh]">{children}</div>
          </div>
        </div>
      </>
    );
}