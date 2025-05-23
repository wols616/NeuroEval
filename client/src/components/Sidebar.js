import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUsers, FaFileMedical, FaChartLine, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="hidden md:flex flex-col fixed left-0 top-0 h-full bg-white shadow-lg w-64">
      <div className="flex items-center justify-center h-16 border-b">
        <h1 className="text-xl font-bold text-indigo-600">NeuroEval</h1>
      </div>

      <nav className="mt-4">
        <ul>
          <li className="px-4 py-3 hover:bg-gray-100">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <FaHome className="text-xl text-indigo-600" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="px-4 py-3 hover:bg-gray-100">
            <Link to="/patients" className="flex items-center space-x-3">
              <FaUsers className="text-xl text-indigo-600" />
              <span>Pacientes</span>
            </Link>
          </li>
          <li className="px-4 py-3 hover:bg-gray-100">
            <Link to="/adir" className="flex items-center space-x-3">
              <FaFileMedical className="text-xl text-indigo-600" />
              <span>Evaluación ADI-R</span>
            </Link>
          </li>
          <li className="px-4 py-3 hover:bg-gray-100">
            <Link to="/ados" className="flex items-center space-x-3">
              <FaChartLine className="text-xl text-indigo-600" />
              <span>Evaluación ADOS-2</span>
            </Link>
          </li>
          <li className="px-4 py-3 hover:bg-gray-100">
            <Link to="/reports" className="flex items-center space-x-3">
              <FaChartLine className="text-xl text-indigo-600" />
              <span>Reportes</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="absolute bottom-0 w-full border-t">
        <ul>
          <li className="px-4 py-3 hover:bg-gray-100">
            <Link to="/profile" className="flex items-center space-x-3">
              <FaUser className="text-xl text-indigo-600" />
              <span>Mi Perfil</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
