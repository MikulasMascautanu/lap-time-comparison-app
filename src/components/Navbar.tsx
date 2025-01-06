import React from "react";
import { Link } from "react-router-dom";
import { BrainCog, Flag, Flame, Users } from "lucide-react";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          F1 Lap Times
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:underline inline-flex items-center">
            <Flag className="mr-1" size={18} /> Circuits
          </Link>
          <Link
            to="/drivers"
            className="hover:underline inline-flex items-center"
          >
            <Users className="mr-1" size={18} /> Drivers
          </Link>
          <Link
            to="/mnemonic"
            className="hover:underline inline-flex items-center"
          >
            <BrainCog className="mr-1" size={18} /> Mnemonic
          </Link>
          <Link
            to="/admin"
            className="hover:underline inline-flex items-center"
          >
            <Flame className="mr-1" size={18} /> Admin
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
