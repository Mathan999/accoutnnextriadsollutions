import { useState } from 'react';
import { getDatabase, ref, update } from 'firebase/database';
import { X } from 'lucide-react';

// Define interface for domain data
interface DomainData {
  id: string;
  company: string;
  domain: string;
  purchaseDate: string;
  expiryDate: string;
  yearlyIncome: number;
}

interface EditDomainProps {
  domain: DomainData;
  onClose: () => void;
  onSuccess: () => void;
}

const EditDomain = ({ domain, onClose, onSuccess }: EditDomainProps) => {
  const [editedDomain, setEditedDomain] = useState<DomainData>(domain);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const database = getDatabase();
      const domainRef = ref(database, `domains/${domain.id}`);
      
      // Remove the id field before updating Firebase
      const { id, ...domainDataToUpdate } = editedDomain;
      
      await update(domainRef, domainDataToUpdate);
      setLoading(false);
      onSuccess();
    } catch (error) {
      setError('Failed to update domain. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-4 sm:p-8 w-full max-w-2xl max-h-screen overflow-y-auto transform transition-all duration-300 scale-100 rotate-0 hover:rotate-0">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-2xl font-bold text-gray-800">Edit Domain</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Company Name
              </label>
              <input
                type="text"
                required
                value={editedDomain.company}
                onChange={(e) => setEditedDomain({...editedDomain, company: e.target.value})}
                className="w-full px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Domain Name
              </label>
              <input
                type="text"
                required
                value={editedDomain.domain}
                onChange={(e) => setEditedDomain({...editedDomain, domain: e.target.value})}
                className="w-full px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Purchase Date
              </label>
              <input
                type="date"
                required
                value={editedDomain.purchaseDate}
                onChange={(e) => setEditedDomain({...editedDomain, purchaseDate: e.target.value})}
                className="w-full px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Expiry Date
              </label>
              <input
                type="date"
                required
                value={editedDomain.expiryDate}
                onChange={(e) => setEditedDomain({...editedDomain, expiryDate: e.target.value})}
                className="w-full px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Yearly Income ($)
              </label>
              <input
                type="number"
                required
                value={editedDomain.yearlyIncome}
                onChange={(e) => setEditedDomain({...editedDomain, yearlyIncome: Number(e.target.value)})}
                className="w-full px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          {error && (
            <div className="p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm sm:text-base">
              {error}
            </div>
          )}
          <div className="flex space-x-3 sm:space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Domain'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDomain;