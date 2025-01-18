import React from 'react';
import Button from '@/components/ui/Button';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userFirstName: string;
  userEmail: string;
  userRole: string;
}

const ProfileModal = ({ isOpen, onClose, userName, userFirstName, userEmail, userRole }: ProfileModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-xl w-96
                      text-secondary-light dark:text-secondary-dark">
        <h2 className="text-2xl font-bold mb-4">Profil</h2>
        <div className="mb-4 space-y-2">
          <p className="text-gray-700 dark:text-gray-300">Nom: {userName}</p>
          <p className="text-gray-700 dark:text-gray-300">Prénom: {userFirstName}</p>
          <p className="text-gray-700 dark:text-gray-300">Email: {userEmail}</p>
          <p className="text-gray-700 dark:text-gray-300">Rôle: {userRole}</p>
        </div>
        <Button 
          onClick={onClose} 
          className="w-full bg-primary-light dark:bg-primary-dark text-white 
                     hover:opacity-90 transition-opacity"
        >
          Fermer
        </Button>
      </div>
    </div>
  );
};

export default ProfileModal; 