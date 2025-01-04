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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-4">Profil</h2>
        <div className="mb-4">
          <p className="text-gray-700">Nom: {userName}</p>
          <p className="text-gray-700">Prénom: {userFirstName}</p>
          <p className="text-gray-700">Email: {userEmail}</p>
          <p className="text-gray-700">Rôle: {userRole}</p>
        </div>
        <Button onClick={onClose} className="w-full bg-blue-500 text-white hover:bg-blue-600">
          Fermer
        </Button>
      </div>
    </div>
  );
};

export default ProfileModal; 