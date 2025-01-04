"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import ProfileModal from '@/components/modals/ProfileModal';
import LogoutModal from '@/components/modals/LogoutModal';
import Swal from 'sweetalert2';
import { Menu } from '@headlessui/react'
import { ChevronDownIcon, QrCodeIcon } from '@heroicons/react/24/outline'

const DashboardPage = () => {
  const router = useRouter();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: ""
  });


  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Déconnexion réussie',
        timer: 3000,
        timerProgressBar: true,
      });
      router.push('/login');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de la déconnexion',
      });
      throw new Error('Erreur lors de la déconnexion');
    }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de la déconnexion',
      });
      console.error('Erreur lors de la déconnexion', error);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        if(response.ok){
          setUserData(data.user);
        }else{
          router.push('/login');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur', error);
      }
    };
    getUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <div className="flex items-center space-x-4">
            {/* Bouton de retour au scan */}
            <Link href="/">
              <Button className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                <QrCodeIcon className="h-5 w-5" />
                <span>Retour au scanner</span>
              </Button>
            </Link>

            {/* Menu déroulant */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-2 bg-white px-4 py-2 rounded-md border hover:bg-gray-50">
                <span>Menu</span>
                <ChevronDownIcon className="h-5 w-5" />
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setIsProfileModalOpen(true)}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                    >
                      Profil
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setIsLogoutModalOpen(true)}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                    >
                      Déconnexion
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
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

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userName={userData.firstName}
        userFirstName={userData.lastName}
        userEmail={userData.email}
        userRole={userData.role}
      />

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default DashboardPage;
