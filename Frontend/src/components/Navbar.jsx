import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { logoutUser } from '../features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import logo from '../assets/logo.png';

const NavItem = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `px-3 py-2 text-sm font-medium rounded-full transition-colors ${
        isActive
          ? 'bg-indigo-50 text-indigo-700'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`
    }
  >
    {children}
  </NavLink>
);

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const cartCount = useSelector((state) => state.cart.itemCount);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async (e) => {
    e.preventDefault();
    await dispatch(logoutUser()).unwrap();
    toast.info('Logged out successfully');
    navigate('/auth/login', { replace: true, state: {} });
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const CartIconWithBadge = ({ size = 'w-5 h-5' }) => (
    <div className="relative inline-flex items-center">
      <svg
        className={`${size}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      {cartCount > 0 && (
        <span className="absolute -top-1.5 -left-1.5 bg-indigo-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
          {cartCount}
        </span>
      )}
    </div>
  );

  return (
    <nav className="bg-white/90 backdrop-blur border-b border-gray-100 sticky top-0 z-40">
      <div className="container flex items-center justify-between py-3">
        <NavLink to="/" className="flex items-center">
          <img src={logo} alt="Marketplace Logo" className="h-10 w-auto rounded-lg" />
          <span className="font-semibold text-xl text-gray-900 tracking-tight mb-1">
            Marketplace
          </span>
        </NavLink>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-1">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/products">All Products</NavItem>
          <NavItem to="/vendors">Vendors</NavItem>
          <NavItem to="/cart">
            <div className="flex items-center gap-2">
              <CartIconWithBadge />
              <span>Cart</span>
            </div>
          </NavItem>

          {user ? (
            <>
              {user.role === 'seller' && (
                <>
                  <NavItem to="/vendor/dashboard">Vendor</NavItem>
                </>
              )}
              {user.role === 'admin' && <NavItem to="/admin/dashboard">Admin</NavItem>}
              {user.role === 'buyer' && <NavItem to="/buyer/dashboard">Buyer</NavItem>}
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm font-medium rounded-full transition-colors bg-indigo-50 text-indigo-700 hover:text-gray-900 hover:bg-gray-50 ml-2"
              >
                Logout
              </button>
            </>
          ) : (
            <NavItem to="/auth/login">Login</NavItem>
          )}
        </div>

        <div className="md:hidden flex items-center gap-1">
          <Link
            to="/cart"
            className="p-2.5 text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <CartIconWithBadge size="w-6 h-6" />
          </Link>
          <button
            onClick={toggleMenu}
            className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu (Out of flow) */}
      {isOpen && (
        <>
          {/* Backdrop for mobile menu */}
          <div
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl z-40 md:hidden animate-slideUp">
            <div className="container py-4 space-y-2 flex flex-col items-start">
              <NavItem to="/" onClick={() => setIsOpen(false)}>Shop</NavItem>
              <NavItem to="/products" onClick={() => setIsOpen(false)}>All Products</NavItem>
              <NavItem to="/vendors" onClick={() => setIsOpen(false)}>Vendors</NavItem>
              <NavItem to="/cart" onClick={() => setIsOpen(false)}>
                <div className="flex items-center gap-2">
                  <CartIconWithBadge />
                  <span>Cart</span>
                </div>
              </NavItem>

              <div className="w-full h-px bg-gray-100 my-2" />

              {user ? (
                <>
                  {user.role === 'seller' && (
                    <>
                      <NavItem to="/vendor/dashboard" onClick={() => setIsOpen(false)}>
                        Vendor Dashboard
                      </NavItem>
                    </>
                  )}
                  {user.role === 'admin' && (
                    <NavItem to="/admin/dashboard" onClick={() => setIsOpen(false)}>
                      Admin Dashboard
                    </NavItem>
                  )}
                  {user.role === 'buyer' && (
                    <NavItem to="/buyer/dashboard" onClick={() => setIsOpen(false)}>
                      Buyer Dashboard
                    </NavItem>
                  )}
                  <button
                    onClick={(e) => {
                      handleLogout(e);
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 text-sm font-medium rounded-xl transition-colors text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <NavItem to="/auth/login" onClick={() => setIsOpen(false)}>
                  Login / Register
                </NavItem>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;