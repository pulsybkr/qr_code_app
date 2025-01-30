"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfileModal from '@/components/modals/ProfileModal';
import LogoutModal from '@/components/modals/LogoutModal';
import Swal from 'sweetalert2';
import TodayScans from '@/components/TodayScans';
import DashboardNav from '@/components/navigation/DashboardNav';

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
      <DashboardNav 
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenLogout={() => setIsLogoutModalOpen(true)}
      />

      {/* Contenu principal */}
      <main className="flex-1 container mx-auto p-4">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-4">Bienvenue sur votre tableau de bord</h2>
          <p className="text-gray-700">
            Ici, vous pouvez gérer vos informations, voir vos statistiques, et accéder à d'autres fonctionnalités.
          </p>
        </div>

        <TodayScans />
      </main>

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
