import { useState, useEffect } from 'react';
import { Building2, Globe, TrendingUp, Calendar, DollarSign, Plus, X, Edit, Trash2 } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue } from 'firebase/database'; // Removed unused 'remove' import
import EditDomain from '../components/Edit and Delete/EditDomain';
import DeleteConfirmation from '../components/Edit and Delete/DeleteConfirmation';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8ye-N3aG3N_ue_Ezcp9kudjddR7rE3VE",
  authDomain: "nextriadsolution-account.firebaseapp.com",
  databaseURL: "https://nextriadsolution-account-default-rtdb.firebaseio.com",
  projectId: "nextriadsolution-account",
  storageBucket: "nextriadsolution-account.firebasestorage.app",
  messagingSenderId: "480826735868",
  appId: "1:480826735868:web:c17643611d98ad46aaab79",
  measurementId: "G-N2H4VHZPPD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Define interface for domain data
interface DomainData {
  id?: string;
  company: string;
  domain: string;
  purchaseDate: string;
  expiryDate: string;
  yearlyIncome: number;
}

// Interface specifically for editing domains
interface EditableDomainData extends DomainData {
  id: string; // Make id required for editing
}

const initialDomainState: DomainData = {
  company: '',
  domain: '',
  purchaseDate: '',
  expiryDate: '',
  yearlyIncome: 0
};

const Home = () => {
  const [domains, setDomains] = useState<DomainData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newDomain, setNewDomain] = useState<DomainData>(initialDomainState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [domainToEdit, setDomainToEdit] = useState<EditableDomainData | null>(null);
  const [domainToDelete, setDomainToDelete] = useState<{id: string, name: string} | null>(null);

  // Calculate statistics
  const totalIncome = domains.reduce((sum, domain) => sum + domain.yearlyIncome, 0);
  const averageIncome = domains.length ? Math.round(totalIncome / domains.length) : 0;
  const nextRenewal = domains.length 
    ? [...domains].sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())[0].expiryDate 
    : 'No domains';

  // Fetch domains from Firebase on component mount
  useEffect(() => {
    const domainsRef = ref(database, 'domains');
    
    try {
      const unsubscribe = onValue(domainsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const domainsArray = Object.entries(data).map(([id, domainData]: [string, any]) => ({
            id,
            ...domainData
          }));
          setDomains(domainsArray);
        } else {
          setDomains([]);
        }
        setLoading(false);
      }, (error) => {
        setError(error.message);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      setError('Failed to connect to database');
      setLoading(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    try {
      const domainsRef = ref(database, 'domains');
      await push(domainsRef, newDomain);
      setNewDomain(initialDomainState);
      setShowForm(false);
    } catch (error) {
      setError('Failed to add domain. Please try again.');
    }
  };

  const handleEditClick = (domain: DomainData) => {
    // Check if the domain has an id before attempting to edit
    if (domain.id) {
      setDomainToEdit(domain as EditableDomainData);
    } else {
      setError('Cannot edit domain without an ID');
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDomainToDelete({ id, name });
  };

  const handleEditSuccess = () => {
    setDomainToEdit(null);
  };

  const handleDeleteSuccess = () => {
    setDomainToDelete(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-xl font-semibold text-indigo-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Enhanced Header with Stats */}
      <header className="bg-white shadow-lg transform-gpu">
        <div className="w-full max-w-7xl mx-auto px-4 py-4 sm:py-6 sm:px-6 lg:px-8">
          {/* Logo and Company Name */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center space-x-3 group mb-4 sm:mb-0">
              <div className="transform transition-transform group-hover:rotate-180 duration-700">
                <Building2 className="h-8 w-8 sm:h-12 sm:w-12 text-indigo-600" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              Nextriad Solutions Domain Manager
              </h1>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            {/* Total Income */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-xl p-3 sm:p-4 transform transition-all duration-300 hover:scale-105 hover:rotate-1">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-xs sm:text-sm opacity-80">Total Yearly Income</p>
                  <p className="text-xl sm:text-2xl font-bold mt-1">${totalIncome.toLocaleString()}</p>
                </div>
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 opacity-80" />
              </div>
            </div>

            {/* Total Domains */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-3 sm:p-4 transform transition-all duration-300 hover:scale-105 hover:rotate-1">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-xs sm:text-sm opacity-80">Total Domains</p>
                  <p className="text-xl sm:text-2xl font-bold mt-1">{domains.length}</p>
                </div>
                <Globe className="h-6 w-6 sm:h-8 sm:w-8 opacity-80" />
              </div>
            </div>

            {/* Average Income */}
            <div className="bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl p-3 sm:p-4 transform transition-all duration-300 hover:scale-105 hover:rotate-1">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-xs sm:text-sm opacity-80">Average Income/Domain</p>
                  <p className="text-xl sm:text-2xl font-bold mt-1">${averageIncome.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 opacity-80" />
              </div>
            </div>

            {/* Next Renewal */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-3 sm:p-4 transform transition-all duration-300 hover:scale-105 hover:rotate-1">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-xs sm:text-sm opacity-80">Next Renewal</p>
                  <p className="text-xl sm:text-2xl font-bold mt-1 truncate max-w-36 sm:max-w-full">{nextRenewal}</p>
                </div>
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-4 sm:py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm sm:text-base">
            {error}
          </div>
        )}

        {/* Add Domain Button */}
        <button
          onClick={() => setShowForm(true)}
          className="mb-4 sm:mb-8 bg-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Add New Domain</span>
        </button>

        {/* Add Domain Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-4 sm:p-8 w-full max-w-2xl max-h-screen overflow-y-auto transform transition-all duration-300 scale-100 rotate-0 hover:rotate-0">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-2xl font-bold text-gray-800">Add New Domain</h3>
                <button 
                  onClick={() => setShowForm(false)}
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
                      value={newDomain.company}
                      onChange={(e) => setNewDomain({...newDomain, company: e.target.value})}
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
                      value={newDomain.domain}
                      onChange={(e) => setNewDomain({...newDomain, domain: e.target.value})}
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
                      value={newDomain.purchaseDate}
                      onChange={(e) => setNewDomain({...newDomain, purchaseDate: e.target.value})}
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
                      value={newDomain.expiryDate}
                      onChange={(e) => setNewDomain({...newDomain, expiryDate: e.target.value})}
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
                      value={newDomain.yearlyIncome}
                      onChange={(e) => setNewDomain({...newDomain, yearlyIncome: Number(e.target.value)})}
                      className="w-full px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  Add Domain
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Edit Domain Modal */}
        {domainToEdit && (
          <EditDomain 
            domain={domainToEdit} 
            onClose={() => setDomainToEdit(null)} 
            onSuccess={handleEditSuccess} 
          />
        )}

        {/* Delete Confirmation Modal */}
        {domainToDelete && (
          <DeleteConfirmation 
            domainId={domainToDelete.id} 
            domainName={domainToDelete.name}
            onClose={() => setDomainToDelete(null)} 
            onSuccess={handleDeleteSuccess} 
          />
        )}

        {/* Domains Grid */}
        <div className="grid gap-4 sm:gap-8">
          {domains.map((domain) => (
            <div
              key={domain.id}
              className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 sm:hover:-translate-y-2 hover:rotate-1"
            >
              <div className="grid grid-cols-1 gap-2 sm:gap-6">
                {/* For mobile: stacked layout */}
                <div className="grid grid-cols-2 gap-2 sm:hidden">
                  <div className="transform transition-all duration-300 hover:scale-105">
                    <label className="text-xs text-gray-500">Company</label>
                    <p className="font-semibold text-gray-800 text-sm truncate">{domain.company}</p>
                  </div>
                  <div className="transform transition-all duration-300 hover:scale-105">
                    <label className="text-xs text-gray-500">Domain</label>
                    <p className="font-semibold text-indigo-600 text-sm truncate">{domain.domain}</p>
                  </div>
                  <div className="transform transition-all duration-300 hover:scale-105">
                    <label className="text-xs text-gray-500">Purchase Date</label>
                    <p className="font-semibold text-gray-800 text-sm truncate">{domain.purchaseDate}</p>
                  </div>
                  <div className="transform transition-all duration-300 hover:scale-105">
                    <label className="text-xs text-gray-500">Expiry Date</label>
                    <p className="font-semibold text-gray-800 text-sm truncate">{domain.expiryDate}</p>
                  </div>
                  <div className="transform transition-all duration-300 hover:scale-105">
                    <label className="text-xs text-gray-500">Yearly Income</label>
                    <p className="font-semibold text-green-600 text-sm">
                      ${domain.yearlyIncome.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-end space-x-2 mt-2">
                    <button
                      onClick={() => domain.id ? handleEditClick(domain) : setError('Cannot edit domain without an ID')}
                      className="p-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => domain.id ? handleDeleteClick(domain.id, domain.domain) : setError('Cannot delete domain without an ID')}
                      className="p-1 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                {/* For tablet and desktop: grid layout */}
                <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                  <div className="transform transition-all duration-300 hover:scale-105">
                    <label className="text-sm text-gray-500">Company</label>
                    <p className="font-semibold text-gray-800 text-base lg:text-lg truncate">{domain.company}</p>
                  </div>
                  <div className="transform transition-all duration-300 hover:scale-105">
                    <label className="text-sm text-gray-500">Domain</label>
                    <p className="font-semibold text-indigo-600 text-base lg:text-lg truncate">{domain.domain}</p>
                  </div>
                  <div className="transform transition-all duration-300 hover:scale-105">
                    <label className="text-sm text-gray-500">Purchase Date</label>
                    <p className="font-semibold text-gray-800 truncate">{domain.purchaseDate}</p>
                  </div>
                  <div className="transform transition-all duration-300 hover:scale-105">
                    <label className="text-sm text-gray-500">Expiry Date</label>
                    <p className="font-semibold text-gray-800 truncate">{domain.expiryDate}</p>
                  </div>
                  <div className="transform transition-all duration-300 hover:scale-105">
                    <label className="text-sm text-gray-500">Yearly Income</label>
                    <p className="font-semibold text-green-600 text-base lg:text-lg">
                      ${domain.yearlyIncome.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center justify-end space-x-3">
                    <button
                      onClick={() => domain.id ? handleEditClick(domain) : setError('Cannot edit domain without an ID')}
                      className="p-2 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition-colors"
                      aria-label={`Edit ${domain.domain}`}
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => domain.id ? handleDeleteClick(domain.id, domain.domain) : setError('Cannot delete domain without an ID')}
                      className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                      aria-label={`Delete ${domain.domain}`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;