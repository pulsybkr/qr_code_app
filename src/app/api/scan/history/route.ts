import { NextRequest, NextResponse } from 'next/server';
import { Op } from 'sequelize';
import Scan from '../../../../../models/Scan';

export async function GET(req: NextRequest) {
    try {
        const searchParams = new URL(req.url).searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        const whereClause: any = {};

        // Filtre de recherche
        if (search) {
            whereClause[Op.or] = [
                { nom: { [Op.iLike]: `%${search}%` } },
                { prenom: { [Op.iLike]: `%${search}%` } },
                { licence: { [Op.iLike]: `%${search}%` } }
            ];
        }

        // Filtre de date
        if (startDate && endDate) {
            whereClause.createdAt = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }

        // Récupération des données avec pagination
        const { count, rows } = await Scan.findAndCountAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
            limit,
            offset: (page - 1) * limit
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
        
        const whereClause: any = {};

        if (search) {
            whereClause[Op.or] = [
                { nom: { [Op.iLike]: `%${search}%` } },
                { prenom: { [Op.iLike]: `%${search}%` } },
                { licence: { [Op.iLike]: `%${search}%` } }
            ];
        }

        if (startDate && endDate) {
            whereClause.createdAt = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }

        const scans = await Scan.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']]
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