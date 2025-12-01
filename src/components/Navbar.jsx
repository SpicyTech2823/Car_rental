import logo from "../assets/Images/873.jpg";
const Navbar = () => {
  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "car", label: "Cars" },
    { id: "contact", label: "Contact" },
  ];
  return (
    <nav className="w-full fixed top-0 left-0 z-50">
      <div className="flex items-center justify-between p-4 ">
        <div className="w-17 h-17 ml-20">
          <img
            src={logo}
            alt="logo"
            className="w-full h-full rounded-full object-cover object-center"
          />
        </div>
        <ul className="flex gap-10 mr-20 bg-red-800 p-3 rounded-xl bg-opacity-50">
          {navItems.map((item) => (
            <li
              key={item.id}
              className="hover:text-red-200 cursor-pointer focus-underline focus-text-red-800 text-lg font-helvetica text-white transition-all duration-300 px-3 py-2"
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
