import React from 'react';
import Button from '@/components/ui/Button';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal = ({ isOpen, onClose, onConfirm }: LogoutModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-4">Confirmation de déconnexion</h2>
        <p className="text-gray-700 mb-6">Êtes-vous sûr de vouloir vous déconnecter ?</p>
        <div className="flex space-x-4">
          <Button 
            onClick={onConfirm}
            className="flex-1 bg-red-500 text-white hover:bg-red-600"
          >
            Déconnexion
          </Button>
          <Button 
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 hover:bg-gray-400"
          >
            Annuler
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal; 