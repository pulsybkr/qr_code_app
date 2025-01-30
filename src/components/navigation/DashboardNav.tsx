"use client"
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

interface DashboardNavProps {
  onOpenProfile: () => void;
  onOpenLogout: () => void;
}

const DashboardNav: React.FC<DashboardNavProps> = ({ onOpenProfile, onOpenLogout }) => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch('/api/auth/session', {
          method: 'POST'
        });
        const data = await response.json();
        setIsAdmin(data.isAdmin);
      } catch (error) {
        console.error('Erreur lors de la vérification du statut admin:', error);
      }
    };

    checkAdminStatus();
  }, []);

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <div className="flex items-center space-x-4">
          {/* Bouton de retour au scan */}
          <Link href="/">
            <Button className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              <QrCodeIcon className="h-5 w-5" />
              <span>Scanner</span>
            </Button>
          </Link>

          {/* Menu déroulant */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-2 bg-white px-4 py-2 rounded-md border hover:bg-gray-50">
              <span>Menu</span>
              <ChevronDownIcon className="h-5 w-5" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={onOpenProfile}
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                  >
                    Profil
                  </button>
                )}
              </Menu.Item>
              
              
              {isAdmin && (
                <>
                <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => router.push('/dashboard/historic')}
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                  >
                    Historique
                  </button>
                )}
              </Menu.Item>
              
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => router.push('/dashboard/users')}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                    >
                      Gestion des utilisateurs
                    </button>
                  )}
                </Menu.Item>
                </>
              )}
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={onOpenLogout}
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
  );
};

export default DashboardNav; 