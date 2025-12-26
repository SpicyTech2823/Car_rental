-- Create the cars table in Supabase (PostgreSQL)

CREATE TABLE cars (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT[],
  price INTEGER,
  per_day BOOLEAN DEFAULT true,
  description TEXT,
  features TEXT[],
  image TEXT
);

-- Create the bookings table

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  car_id INTEGER REFERENCES cars(id),
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  pickup_date DATE,
  return_date DATE,
  days INTEGER,
  total_price INTEGER,
  payment_method TEXT,
  is_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create the users table (for future authentication)

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create the feedback table

CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  user_id UUID,
  user_name TEXT NOT NULL,
  user_email TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  car_id INTEGER REFERENCES cars(id),
  booking_id INTEGER REFERENCES bookings(id),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert the car data

INSERT INTO cars (id, name, category, price, per_day, description, features, image) VALUES
(1, 'Compact City Cruiser', ARRAY['All cars', 'Business', 'Family'], 150, true, 'Perfect for city driving with excellent fuel efficiency', ARRAY['5 Seats', 'Automatic', 'AC', 'Bluetooth'], 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'),
(2, 'Spacious SUV', ARRAY['All cars', 'Family', 'Adventure'], 195, true, 'Comfortable family SUV with ample space for luggage', ARRAY['7 Seats', 'Automatic', '4WD', 'Sunroof'], 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'),
(3, 'Luxury Sedan', ARRAY['All cars', 'Business', 'Wedding'], 250, true, 'Premium luxury sedan for business executives', ARRAY['5 Seats', 'Automatic', 'Leather Seats', 'Premium Sound'], 'https://images.unsplash.com/photo-1555212697-194d092e3b8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'),
(4, 'Convertible Sports', ARRAY['All cars', 'Adventure', 'Wedding'], 300, true, 'Experience the open road with this stylish convertible', ARRAY['2 Seats', 'Automatic', 'Convertible', 'Premium'], 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'),
(5, 'Economy Hatchback', ARRAY['All cars', 'Business', 'Family'], 120, true, 'Affordable and efficient hatchback for everyday use', ARRAY['5 Seats', 'Manual', 'AC', 'USB'], 'https://images.unsplash.com/photo-1511914265872-7b6f1f3c4f3c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'),
(6, 'Off-Road Jeep', ARRAY['All cars', 'Adventure'], 220, true, 'Rugged jeep designed for off-road adventures', ARRAY['5 Seats', 'Manual', '4WD', 'Roof Rack'], 'https://images.unsplash.com/photo-1504215680853-026ed2a45def?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'),
(7, 'Electric Compact', ARRAY['All cars', 'Business', 'Family'], 180, true, 'Eco-friendly electric car with modern features', ARRAY['5 Seats', 'Automatic', 'Electric', 'Touchscreen'], 'https://images.unsplash.com/photo-1502877338535-766e1452684a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'),
(8, 'Minivan Family', ARRAY['All cars', 'Family'], 200, true, 'Spacious minivan perfect for family trips', ARRAY['8 Seats', 'Automatic', 'AC', 'DVD Player'], 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'),
(9, 'Sports Coupe', ARRAY['All cars', 'Adventure'], 280, true, 'High-performance sports coupe for thrill seekers', ARRAY['2 Seats', 'Manual', 'Turbo', 'Sport Suspension'], 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'),
(10, 'Executive Limousine', ARRAY['All cars', 'Business', 'Wedding'], 400, true, 'Luxury limousine for special occasions', ARRAY['4 Seats', 'Automatic', 'Champagne Bar', 'Privacy Glass'], 'https://images.unsplash.com/photo-1549399735-cef2e2c3f638?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80');

-- Insert sample booking data

INSERT INTO bookings (car_id, customer_name, email, phone, pickup_date, return_date, days, total_price, payment_method, is_paid) VALUES
(1, 'John Doe', 'john@example.com', '123-456-7890', '2025-12-27', '2025-12-30', 3, 450, 'card', true),
(2, 'Jane Smith', 'jane@example.com', '098-765-4321', '2025-12-28', '2025-12-31', 3, 585, 'paypal', false),
(3, 'Alice Johnson', 'alice@example.com', '555-123-4567', '2025-12-29', '2026-01-02', 4, 1000, 'card', true),
(4, 'Bob Wilson', 'bob@example.com', '444-987-6543', '2025-12-30', '2026-01-01', 2, 600, 'bank_transfer', false),
(5, 'Carol Brown', 'carol@example.com', '333-456-7890', '2025-12-31', '2026-01-03', 3, 360, 'card', true);

-- Insert sample feedback data

INSERT INTO feedback (user_name, user_email, rating, comment, car_id, is_featured) VALUES
('Sarah Johnson', 'sarah.j@example.com', 5, 'Amazing service! The car was in perfect condition and the booking process was seamless. Will definitely rent again!', 3, true),
('Mike Chen', 'mike.chen@example.com', 5, 'Great experience with the luxury sedan. Staff was very helpful and the car exceeded my expectations. Highly recommended!', 3, true),
('Emma Davis', 'emma.davis@example.com', 4, 'The SUV was spacious and perfect for our family trip. Only minor issue was a small delay in pickup, but overall great service.', 2, true),
('David Wilson', 'david.w@example.com', 5, 'Fantastic electric car experience! So quiet and smooth. The range was perfect for our needs. Love the eco-friendly option!', 7, true),
('Lisa Rodriguez', 'lisa.r@example.com', 5, 'The convertible made our wedding day perfect! Everyone loved it and the service was top-notch. Thank you!', 4, true),
('Tom Anderson', 'tom.a@example.com', 4, 'Good value for money with the economy hatchback. Reliable and fuel-efficient. Would recommend for budget-conscious travelers.', 5, false),
('Jennifer Lee', 'jennifer.l@example.com', 5, 'Outstanding customer service! They helped us choose the perfect minivan for our group trip. Everything was perfect.', 8, false);