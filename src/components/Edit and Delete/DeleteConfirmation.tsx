import { useState } from 'react';
import { getDatabase, ref, remove } from 'firebase/database';
import { X, AlertTriangle } from 'lucide-react';

interface DeleteConfirmationProps {
  domainId: string;
  domainName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const DeleteConfirmation = ({ domainId, domainName, onClose, onSuccess }: DeleteConfirmationProps) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setError(null);
    setLoading(true);
    
    try {
      const database = getDatabase();
      const domainRef = ref(database, `domains/${domainId}`);
      
      await remove(domainRef);
      setLoading(false);
      onSuccess();
    } catch (error) {
      setError('Failed to delete domain. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-4 sm:p-8 w-full max-w-md max-h-screen overflow-y-auto transform transition-all duration-300 scale-100 rotate-0 hover:rotate-0">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="h-6 w-6" />
            <h3 className="text-lg sm:text-2xl font-bold">Delete Domain</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete the domain <span className="font-semibold">{domainName}</span>? This action cannot be undone.
          </p>
          
          {error && (
            <div className="p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm sm:text-base">
              {error}
            </div>
          )}
        </div>
        
        <div className="flex space-x-3 sm:space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;