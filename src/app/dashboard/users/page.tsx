"use client";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import ChevronLeftIcon from "@heroicons/react/24/outline/ChevronLeftIcon";
import { TrashIcon, KeyIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "@/components/ui/Tooltip";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok)
        throw new Error("Erreur lors du chargement des utilisateurs");
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      Swal.fire("Erreur", "Impossible de charger les utilisateurs", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Créer un nouveau contrôleur",
      html: `
                <input id="firstName" class="swal2-input" placeholder="Prénom" required>
                <input id="lastName" class="swal2-input" placeholder="Nom" required>
                <input id="email" class="swal2-input" placeholder="Email" required>
            `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Créer',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        return {
          firstName: (document.getElementById("firstName") as HTMLInputElement).value,
          lastName: (document.getElementById("lastName") as HTMLInputElement).value,
          email: (document.getElementById("email") as HTMLInputElement).value,
        };
      },
    });

    if (formValues) {
      try {
        if (!formValues.firstName || !formValues.lastName || !formValues.email) {
          throw new Error("Tous les champs sont requis");
        }
        const response = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues),
        });

        const data = await response.json();

        if (response.ok) {
          await Swal.fire({
            title: "Utilisateur créé !",
            html: `
                            <p>Email: ${data.email}</p>
                            <p>Mot de passe temporaire: ${data.temporaryPassword}</p>
                        `,
            icon: "success",
            confirmButtonText: "Copier les informations",
          });

          // Copier dans le presse-papier
          navigator.clipboard.writeText(
            `Email: ${data.email}\nMot de passe: ${data.temporaryPassword}`
          );

          fetchUsers();
        } else {
          throw new Error(data.error);
        }
      } catch (error: any) {
        Swal.fire("Erreur", error.message, "error");
      }
    }
  };

  const handleResetPassword = async (userId: number) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Vous êtes sur le point de réinitialiser le mot de passe de cet utilisateur.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, réinitialiser',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: "POST",
        });
        const data = await response.json();

        if (response.ok) {
          await Swal.fire({
            title: "Mot de passe réinitialisé",
            html: `Nouveau mot de passe: ${data.newPassword}`,
            icon: "success",
            confirmButtonText: "Copier le mot de passe",
          });
          navigator.clipboard.writeText(data.newPassword);
        } else {
          throw new Error(data.error);
        }
      } catch (error: any) {
        Swal.fire("Erreur", error.message, "error");
      }
    }
  };

  const handleDeleteUser = async (userId: number) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          Swal.fire("Supprimé !", "L'utilisateur a été supprimé.", "success");
          fetchUsers();
        } else {
          throw new Error("Erreur lors de la suppression");
        }
      } catch (error) {
        Swal.fire("Erreur", "Impossible de supprimer l'utilisateur", "error");
      }
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="bg-white shadow flex justify-between items-center">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronLeftIcon className="h-6 w-6 text-gray-500" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">
                Gestion des utilisateurs
              </h1>
            </div>
          </div>
        </div>
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <Button
            onClick={handleCreateUser}
            className="bg-gradient-to-r w-10 from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg transform transition-all duration-200 ease-in-out hover:scale-105"
          >
            Créer un utilisateur
          </Button>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl shadow-xl border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-4 sm:px-8 py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-4 sm:px-8 py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="hidden sm:table-cell px-4 sm:px-8 py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Rôle
                </th>
                
                <th className="px-4 sm:px-8 py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-all duration-200 ease-in-out"
                >
                  <td className="px-4 sm:px-8 py-4 sm:py-6 whitespace-nowrap text-gray-800 font-medium">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-4 sm:px-8 py-4 sm:py-6 whitespace-nowrap text-gray-600">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                        {user.email}
                      </span>
                      <Tooltip content="Copier l'email">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(user.email);
                            Swal.fire('Copié !', 'L\'email a été copié.', 'success');
                          }}
                          className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <ClipboardDocumentIcon className="h-4 w-4" />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-4 sm:px-8 py-4 sm:py-6 whitespace-nowrap">
                    <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border border-blue-200">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 sm:px-8 py-4 sm:py-6 whitespace-nowrap">
                    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                      <Tooltip content="Réinitialiser le mot de passe">
                        <button
                          onClick={() => handleResetPassword(user.id)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 ease-in-out hover:shadow-sm"
                        >
                          <KeyIcon className="h-5 w-5" />
                        </button>
                      </Tooltip>
                      <Tooltip content="Supprimer l'utilisateur">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 ease-in-out hover:shadow-sm"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
