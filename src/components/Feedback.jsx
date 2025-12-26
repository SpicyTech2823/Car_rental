import { useState, useEffect } from 'react';
import { Star, MessageSquare, User } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { useAuth } from '../contexts/AuthContext';

const Feedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [cars, setCars] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
    car_id: null
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchFeedback();
    fetchCars();
    testDatabaseConnection();
  }, []);

  const testDatabaseConnection = async () => {
    try {
      const { error } = await supabase.from('feedback').select('count').limit(1);
      if (error) {
        console.error('Database connection test failed:', error);
        alert('Database connection issue. Please make sure you have run the SQL schema in Supabase.');
      } else {
        console.log('Database connection successful');
      }
    } catch (err) {
      console.error('Database test error:', err);
    }
  };

  const fetchCars = async () => {
    const { data, error } = await supabase
      .from('cars')
      .select('id, name')
      .order('name');

    if (error) {
      console.error('Error fetching cars:', error);
    } else {
      setCars(data);
    }
  };

  const fetchFeedback = async () => {
    const { data, error } = await supabase
      .from('feedback')
      .select(`
        *,
        cars (
          name
        )
      `)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) {
      console.error('Error fetching feedback:', error);
    } else {
      setFeedback(data);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();

    console.log('User object:', user); // Debug log

    if (!user) {
      alert('Please log in to submit feedback.');
      return;
    }

    setLoading(true);
    try {
      const feedbackData = {
        user_name: user.user_metadata?.name || user.email?.split('@')[0] || 'Anonymous',
        rating: formData.rating,
        comment: formData.comment,
        is_featured: false
      };

      // Only add user_id if user exists in users table
      if (user.id) {
        feedbackData.user_id = user.id;
      }

      // Only add user_email if it exists
      if (user.email) {
        feedbackData.user_email = user.email;
      }

      // Only add car_id if selected
      if (formData.car_id) {
        feedbackData.car_id = formData.car_id;
      }

      console.log('Feedback data to insert:', feedbackData); // Debug log

      const { data, error } = await supabase
        .from('feedback')
        .insert([feedbackData]);

      console.log('Supabase response:', { data, error }); // Debug log

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      setShowForm(false);
      setFormData({ rating: 5, comment: '', car_id: null });
      alert('Thank you for your feedback!');
      // Refresh feedback list
      fetchFeedback();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert(`Error submitting feedback: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what satisfied renters have to say about their experience.
          </p>
        </div>

        {/* Feedback Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {feedback.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{item.user_name}</h4>
                  <div className="flex items-center">
                    {renderStars(item.rating)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-3">"{item.comment}"</p>
              {item.cars && (
                <p className="text-sm text-red-600 font-medium">
                  Rented: {item.cars.name}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Submit Feedback Button */}
        {user && (
          <div className="text-center">
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center px-6 py-3 bg-red-900 text-white font-medium rounded-lg hover:bg-red-800 transition-colors duration-200"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              {showForm ? 'Cancel' : 'Share Your Experience'}
            </button>
          </div>
        )}

        {!user && (
          <div className="text-center">
            <p className="text-gray-600 mb-4">Want to share your experience?</p>
            <a
              href="/login"
              className="inline-flex items-center px-6 py-3 bg-red-900 text-white font-medium rounded-lg hover:bg-red-800 transition-colors duration-200"
            >
              Log in to Leave Feedback
            </a>
          </div>
        )}

        {/* Feedback Form */}
        {showForm && user && (
          <div className="mt-8 max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Share Your Feedback</h3>
            <form onSubmit={handleSubmitFeedback}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= formData.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="car" className="block text-sm font-medium text-gray-700 mb-2">
                  Which car did you rent? (Optional)
                </label>
                <select
                  id="car"
                  value={formData.car_id || ''}
                  onChange={(e) => setFormData({ ...formData, car_id: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select a car (optional)</option>
                  {cars.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Tell us about your experience..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-red-900 text-white rounded-md hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};

export default Feedback;