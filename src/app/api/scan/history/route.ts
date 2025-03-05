import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const searchParams = new URL(req.url).searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        // Construire la condition where
        let whereCondition: any = {};

        // Ajouter la recherche si nécessaire
        if (search) {
            whereCondition.OR = [
                { nom: { contains: search, mode: 'insensitive' } },
                { prenom: { contains: search, mode: 'insensitive' } },
                { licence: { contains: search, mode: 'insensitive' } }
            ];
        }

        // Ajouter le filtre de date si nécessaire
        if (startDate && endDate) {
            whereCondition.createdAt = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }

        // Compter le nombre total d'enregistrements
        const count = await prisma.scan.count({
            where: whereCondition
        });

        // Récupérer les données avec pagination
        const rows = await prisma.scan.findMany({
            where: whereCondition,
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: (page - 1) * limit
        });

        return NextResponse.json({
            success: true,
            data: rows,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });

    } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique:', error);
        return NextResponse.json({ 
            success: false,
            error: 'Erreur lors de la récupération de l\'historique' 
        }, { status: 500 });
    }
}

// Route pour l'export CSV
export async function POST(req: NextRequest) {
    try {
        const { startDate, endDate, search } = await req.json();
        
        // Construire la condition where
        let whereCondition: any = {};

        // Ajouter la recherche si nécessaire
        if (search) {
            whereCondition.OR = [
                { nom: { contains: search, mode: 'insensitive' } },
                { prenom: { contains: search, mode: 'insensitive' } },
                { licence: { contains: search, mode: 'insensitive' } }
            ];
        }

        // Ajouter le filtre de date si nécessaire
        if (startDate && endDate) {
            whereCondition.createdAt = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }

        // Récupérer les données
        const scans = await prisma.scan.findMany({
            where: whereCondition,
            orderBy: { createdAt: 'desc' }
        });

        // Convertir en format CSV
        const csvData = scans.map(scan => ({
            Date: new Date(scan.createdAt).toLocaleDateString(),
            Heure: new Date(scan.createdAt).toLocaleTimeString(),
            Nom: scan.nom,
            Prenom: scan.prenom,
            Licence: scan.licence
        }));

        return NextResponse.json({
            success: true,
            data: csvData
        });

    } catch (error) {
        console.error('Erreur lors de l\'export CSV:', error);
        return NextResponse.json({ 
            success: false,
            error: 'Erreur lors de l\'export CSV' 
        }, { status: 500 });
    }
} 