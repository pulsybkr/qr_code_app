import { NextRequest, NextResponse } from 'next/server';
import { Op } from 'sequelize';
import Scan from '../../../../../models/Scan';

export async function GET(req: NextRequest) {
    try {
        const searchParams = new URL(req.url).searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';

        // Obtenir la date du jour (début et fin)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        let whereClause: any = {};

        // Construire la clause where
        if (search) {
            whereClause = {
                [Op.and]: [
                    {
                        createdAt: {
                            [Op.gte]: today,
                            [Op.lt]: tomorrow
                        }
                    },
                    {
                        [Op.or]: [
                            { nom: { [Op.iLike]: `%${search}%` } },
                            { prenom: { [Op.iLike]: `%${search}%` } },
                            { licence: { [Op.iLike]: `%${search}%` } }
                        ]
                    }
                ]
            };
        } else {
            whereClause = {
                createdAt: {
                    [Op.gte]: today,
                    [Op.lt]: tomorrow
                }
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
        console.error('Erreur lors de la récupération des scans:', error);
        return NextResponse.json({ 
            success: false,
            error: 'Erreur lors de la récupération des scans' 
        }, { status: 500 });
    }
} 