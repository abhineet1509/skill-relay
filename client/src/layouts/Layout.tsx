import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Search, User, Wrench, X } from "lucide-react";
import { useAuth } from "../components/AuthContext";
import { useState } from "react";

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { name: 'Home', path: '/home' },
    { name: 'Technicians', path: '/technicians' },
    { name: 'My Profile', path: '/profile' },
    { name: 'Tech Dashboard', path: '/technician/dashboard' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/technicians?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f2ec] text-[#222222] font-sans flex flex-col">
      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-start justify-center pt-24">
          <div className="w-full max-w-xl mx-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search technicians by name, skill or city..."
                className="flex-1 bg-white border border-gray-200 rounded-2xl px-5 py-4 text-base shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <button type="submit" className="bg-gray-900 text-white px-5 rounded-2xl font-semibold hover:bg-gray-700 shadow-xl">
                Search
              </button>
              <button type="button" onClick={() => setSearchOpen(false)} className="bg-white p-4 rounded-2xl shadow-xl hover:bg-gray-50">
                <X className="w-5 h-5" />
              </button>
            </form>
            <p className="text-white/70 text-xs mt-3 ml-2">Press Enter to search or Esc to close</p>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm">

        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to="/" className="font-bold text-xl tracking-tight flex items-center gap-2 text-gray-900 hover:opacity-80 transition-opacity">
            <Wrench className="w-5 h-5 stroke-[2.5]" />
            SkillRelay
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = location.pathname.includes(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-[14px] font-medium transition-colors hover:text-gray-900 relative py-2 ${
                    isActive
                      ? 'text-gray-900 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gray-900'
                      : 'text-gray-500'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-2 text-gray-500">

          {/* Search */}
          <div className="relative group flex items-center justify-center">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
              title="Search technicians"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>
            <span className="absolute top-12 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100 transition-transform origin-top whitespace-nowrap">Search</span>
          </div>

          {/* Profile / Login */}
          <div className="relative group flex items-center justify-center ml-2">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to={user.role === 'TECHNICIAN' ? '/technician/dashboard' : '/profile'} className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-gray-200 hover:ring-gray-900 transition-all shadow-sm cursor-pointer" title="Dashboard">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </Link>
                <button
                  onClick={async () => { await logout(); navigate('/login'); }}
                  className="text-xs text-red-500 font-semibold hover:text-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors shadow-sm" title="Login">
                <User className="w-4 h-4" />
              </Link>
            )}
            <span className="absolute top-12 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100 transition-transform origin-top whitespace-nowrap">
              {user ? 'Dashboard' : 'Login / Register'}
            </span>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
