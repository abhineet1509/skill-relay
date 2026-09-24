import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";
import { useState } from "react";

export function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/technicians?search=${encodeURIComponent(search.trim())}`);
    } else {
      navigate('/technicians');
    }
  };

  return (
    <div className="w-full min-h-[75vh] flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-6">
        
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
            <Wrench className="w-8 h-8 text-gray-900" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Find a Local Technician
        </h1>
        
        <p className="text-gray-600 text-lg max-w-lg mx-auto">
          Search and book verified professionals for appliance repairs in your city.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto mt-8 pt-4">
          <input 
            type="text" 
            placeholder="Search by skill, appliance, or city..." 
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit" className="bg-gray-900 text-white px-8 py-3 rounded-lg text-base font-medium hover:bg-gray-800 shadow-sm transition-colors">
            Search
          </Button>
        </form>

        <div className="flex items-center justify-center gap-4 pt-16 mt-8">
          <button 
            onClick={() => navigate('/technicians')} 
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Browse all technicians
          </button>
          <span className="text-gray-300">•</span>
          <button 
            onClick={() => navigate('/technician-register')} 
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Join as a Technician
          </button>
        </div>

      </div>
    </div>
  );
}
