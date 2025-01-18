"use client";
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface Scan {
    id: string;
    nom: string;
    prenom: string;
    licence: string;
    createdAt: string;
    photoData: string;
}

const TodayScans = () => {
    const [scans, setScans] = useState<Scan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const ITEMS_PER_PAGE = 10;

    const fetchScans = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: ITEMS_PER_PAGE.toString(),
                search
            });

            const response = await fetch(`/api/scan/today?${params}`);
            const data = await response.json();

            if (response.ok) {
                setScans(data.data);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des scans:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchScans();
    }, [currentPage, search]);

    return (
        <div className="mt-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold mb-4">Scans du jour</h2>

                {/* Barre de recherche */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Rechercher par nom, prénom ou licence..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Photo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nom
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Licence
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Heure
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : scans.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                        Aucun scan aujourd'hui
                                    </td>
                                </tr>
                            ) : (
                                scans.map((scan) => (
                                    <tr key={scan.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <img
                                                src={scan.photoData}
                                                alt={`${scan.prenom} ${scan.nom}`}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {scan.prenom} {scan.nom}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {scan.licence}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {format(new Date(scan.createdAt), 'HH:mm', { locale: fr })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex items-center justify-between">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1 || isLoading}
                        className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                            currentPage === 1 || isLoading
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border'
                        }`}
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        Précédent
                    </button>
                    
                    <span className="text-sm text-gray-700">
                        Page <span className="font-medium">{currentPage}</span> sur <span className="font-medium">{totalPages}</span>
                    </span>
                    
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages || isLoading}
                        className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                            currentPage === totalPages || isLoading
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border'
                        }`}
                    >
                        Suivant
                        <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TodayScans; 