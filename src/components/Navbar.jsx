import { Link } from "react-router-dom";
import logo from "../assets/Images/logo.png";


const Navbar = () => {
  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "car", label: "Cars" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <nav className="w-full fixed top-5 left-5 z-50 bg-transparent" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="block">
              <div className="w-full h-full md:w-14 md:h-14">
                <img
                  src={logo}
                  alt="Car rental logo"
                  className="w-18 h-18 rounded-full object-cover object-center"
                />
              </div>
            </Link>
          </div>

          {/* Navigation items */}
          <div className="hidden md:block">
            <ul className="flex items-center space-x-6 md:space-x-8 bg-red-800/70 px-10 py-6 rounded-2xl">
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={`/${item.id === "home" ? "" : item.id}`}
                    className="text-white text-lg hover:text-red-200 transition-colors duration-200 px-2 py-1"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
