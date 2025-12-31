import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import { Edit, Trash2, Plus } from 'lucide-react';

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [adminCheckLoading, setAdminCheckLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    features: ''
  });

  // Admin verification function
  const verifyAdminAccess = async () => {
    try {
      // Step 1: Check if user is authenticated
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();

      if (userError || !currentUser) {
        console.log('No authenticated user found');
        navigate('/admin/login');
        return false;
      }

      // Step 2: Query admins table to verify user exists
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('id')
        .single();

      if (adminError) {
        console.log('Admin verification error:', adminError);
        console.log('Error code:', adminError.code);
        console.log('Error message:', adminError.message);
        console.log('User ID attempting access:', currentUser.id);
        console.log('User email:', currentUser.email);
      }

      if (adminError || !adminData) {
        console.log('User not found in admins table:', adminError?.message);
        console.log('This usually means:');
        console.log('1. User is not in the admins table');
        console.log('2. RLS policy is blocking access');
        console.log('3. Table or policy doesn\'t exist');
        // Sign out and redirect to not authorized page
        await signOut();
        navigate('/not-authorized');
        return false;
      }

      console.log('Admin access verified for user:', currentUser.id);
      return true;

    } catch (error) {
      console.error('Admin verification failed:', error);
      await signOut();
      navigate('/not-authorized');
      return false;
    }
  };

  useEffect(() => {
    const checkAdminAccess = async () => {
      setAdminCheckLoading(true);
      const authorized = await verifyAdminAccess();
      setIsAuthorized(authorized);
      setAdminCheckLoading(false);

      if (authorized) {
        fetchCars();
      }
    };

    checkAdminAccess();
  }, [navigate, signOut]);

  const fetchCars = async () => {
    const { data, error } = await supabase.from('cars').select('*');
    if (error) {
      console.error('Error fetching cars:', error);
    } else {
      setCars(data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const carData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      image: formData.image,
      category: formData.category.split(',').map(c => c.trim()),
      features: formData.features.split(',').map(f => f.trim())
    };

    if (editingCar) {
      const { error } = await supabase
        .from('cars')
        .update(carData)
        .eq('id', editingCar.id);
      if (error) {
        console.error('Error updating car:', error);
      } else {
        fetchCars();
        setEditingCar(null);
      }
    } else {
      const { error } = await supabase
        .from('cars')
        .insert([carData]);
      if (error) {
        console.error('Error adding car:', error);
      } else {
        fetchCars();
        setShowAddForm(false);
      }
    }

    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      category: '',
      features: ''
    });
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setFormData({
      name: car.name,
      description: car.description,
      price: car.price.toString(),
      image: car.image,
      category: car.category.join(', '),
      features: car.features.join(', ')
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', id);
      if (error) {
        console.error('Error deleting car:', error);
      } else {
        fetchCars();
      }
    }
  };

  const handleCancel = () => {
    setEditingCar(null);
    setShowAddForm(false);
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      category: '',
      features: ''
    });
  };

  if (adminCheckLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-800 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-red-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage Cars</p>
        </div>

        <div className="mb-4">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Add New Car
          </button>
        </div>

        {(showAddForm || editingCar) && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold mb-4">
              {editingCar ? 'Edit Car' : 'Add New Car'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price per day</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category (comma separated)</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Features (comma separated)</label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({...formData, features: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  {editingCar ? 'Update' : 'Add'} Car
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={car.image} alt={car.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-bold">{car.name}</h3>
                <p className="text-gray-600 text-sm">{car.description}</p>
                <p className="text-red-800 font-bold mt-2">${car.price}/day</p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(car)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(car.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center gap-1"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}