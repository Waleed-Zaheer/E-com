import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, User, LogOut } from "lucide-react";
import Logo from "../assets/bag_logo.svg";
import useUser from '../context/UserProvider';
import { useCart } from "../context/CartProvider";

export default function Navbar() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const [query, setQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { user, logout } = useUser();

  const handleNavigate = (path) => {
    navigate(path);
    setIsDrawerOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/api/products/search/?q=${encodeURIComponent(query)}`);
  };

  const handleProfileClick = () => {
    try {
      if (user) {
        if (user.role === "Admin") {
          navigate("/admin");
        } else {
          navigate("/profile");
        }
        setIsDrawerOpen(false);
        return;
      }
      navigate("/login");
      setIsDrawerOpen(false);
    } catch (error) {
      console.error("Error in handleProfileClick:", error);
      navigate("/login");
      setIsDrawerOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDrawerOpen(false);
  };

  return (
    <nav className="bg-blue-400 p-4 shadow-md w-full z-50 sticky top-0 overflow-hidden">
      <div className="flex justify-between flex-row items-center max-w-7xl mx-auto">
        {/* Logo Section */}
        <div
          className="text-white font-bold text-lg flex flex-row items-center cursor-pointer"
          onClick={() => handleNavigate("/")}
        >
          <img src={Logo} className="h-6 w-8 mx-1" alt="Logo"></img>
          <p>Ecommerce</p>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden sm:flex items-center relative w-28 sm:w-40 md:w-64 lg:w-96"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full px-3 py-1 rounded-full text-black focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l4.4 4.39-1.42 1.42-4.39-4.4zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
            </svg>
          </button>
        </form>

        {/* Right Side Icons */}
        <div className="flex items-center gap-4">
          {/* Navigation Icons */}
          <div className="hidden lg:flex gap-6 text-white font-semibold items-center">
            <button onClick={() => handleNavigate("/about")}>About Us</button>
            <button onClick={() => handleNavigate("/contact")}>
              Contact Us
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => handleNavigate("/cart")}
              className="text-white flex items-center gap-2"
              aria-label="Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </div>
            </button>

            {/* Profile Button */}
            <button
              onClick={handleProfileClick}
              className="text-white"
              aria-label="Profile"
            >
              {user && user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-white"
                />
              ) : (
                <User className="w-6 h-6" />
              )}
            </button>

            {/* Logout Button - Conditionally Rendered */}
            {user && (
              <button
                onClick={handleLogout}
                className="text-white hover:text-red-200 flex items-center gap-2"
                aria-label="Logout"
              >
                <LogOut className="w-6 h-6" />
                <span>Logout</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="lg:hidden text-white"
            aria-label="Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 p-6 text-black flex flex-col gap-6 ${isDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <button
          className="self-end text-gray-700"
          onClick={() => setIsDrawerOpen(false)}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Mobile Navigation Links */}

        <button onClick={() => handleNavigate("/about")}>About Us</button>
        <button onClick={() => handleNavigate("/contact")}>Contact Us</button>
        <button
          onClick={() => handleNavigate("/cart")}
          className="flex items-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          Cart
        </button>
        {/* Mobile Profile/Login Button */}
        <button
          onClick={handleProfileClick}
          className="flex items-center gap-2"
        >
          {user && user.profilePic ? (
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <User className="w-5 h-5" />
          )}
          {user ? "My Profile" : "Login / Register"}
        </button>

        {/* Mobile Logout Button - Conditionally Rendered */}
        {user && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        )}
      </div>
    </nav>
  );
}
