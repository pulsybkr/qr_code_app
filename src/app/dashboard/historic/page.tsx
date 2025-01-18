"use client"
import React, { useEffect, useState, useRef } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CSVLink } from 'react-csv';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { ArrowLeftIcon, ArrowRightIcon, DocumentArrowDownIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

interface Scan {
    id: string;
    nom: string;
    prenom: string;
    licence: string;
    createdAt: string;
    photoData: string;
}

export default function HistoricPage() {
    const router = useRouter();
    const csvLinkRef = useRef<any>(null);
    const [scans, setScans] = useState<Scan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [csvData, setCSVData] = useState<any[]>([]);
    const [isExporting, setIsExporting] = useState(false);

    const fetchScans = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '10',
                search,
                ...(startDate && { startDate }),
                ...(endDate && { endDate })
            });

            const response = await fetch(`/api/scan/history?${params}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            setScans(data.data);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const response = await fetch('/api/scan/history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    search,
                    startDate,
                    endDate
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setCSVData(data.data);
                // Déclencher le téléchargement après la mise à jour du state
                setTimeout(() => {
                    csvLinkRef.current?.link.click();
                    setIsExporting(false);
                }, 100);
            }
        } catch (error) {
            console.error('Erreur lors de l\'export:', error);
            setIsExporting(false);
        }
    };

    useEffect(() => {
        fetchScans();
    }, [currentPage, search, startDate, endDate]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <button 
                                onClick={() => router.push('/dashboard')}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <ChevronLeftIcon className="h-6 w-6 text-gray-500" />
                            </button>
                            <h1 className="text-2xl font-semibold text-gray-900">Historique des Scans</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filtres */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Recherche</label>
                            <input
                                type="text"
                                placeholder="Nom, prénom ou licence..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Date début</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Date fin</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={handleExport}
                                disabled={isExporting}
                                className={`w-full flex items-center justify-center px-4 py-2 rounded-lg text-white transition-colors ${
                                    isExporting 
                                        ? 'bg-green-400 cursor-not-allowed' 
                                        : 'bg-green-500 hover:bg-green-600'
                                }`}
                            >
                                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                                {isExporting ? 'Export en cours...' : 'Exporter en CSV'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                                        Date
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
                                            Aucun résultat trouvé
                                        </td>
                                    </tr>
                                ) : (
                                    scans.map((scan) => (
                                        <tr key={scan.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <img
                                                    src={scan.photoData}
                                                    alt={`${scan.prenom} ${scan.nom}`}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {scan.prenom} {scan.nom}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">
                                                    {scan.licence}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {format(new Date(scan.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                        <div className="flex items-center justify-between">
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
            </div>

            {/* Composant CSV caché */}
            <CSVLink
                data={csvData}
                filename={`scans-${format(new Date(), 'yyyy-MM-dd')}.csv`}
                ref={csvLinkRef}
                className="hidden"
            />
        </div>
    );
}
