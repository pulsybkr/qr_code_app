import React from 'react';
import Link from 'next/link';

const DashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <div className="flex space-x-4">
            <Link href="/profile" className="text-blue-500 hover:underline">Profil</Link>
            <Link href="/logout" className="text-blue-500 hover:underline">Déconnexion</Link>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="flex-1 container mx-auto p-4">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-4">Bienvenue sur votre tableau de bord</h2>
          <p className="text-gray-700">
            Ici, vous pouvez gérer vos informations, voir vos statistiques, et accéder à d'autres fonctionnalités.
          </p>
        </div>
      </main>

      {/* Pied de page */}
      <footer className="bg-white shadow-md p-4 mt-4">
        <div className="container mx-auto text-center">
          <p className="text-gray-600">&copy; 2024 Votre Application.</p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
