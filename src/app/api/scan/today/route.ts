import { NextRequest, NextResponse } from 'next/server';
import { Op } from 'sequelize';
import Scan from '../../../../../models/Scan';

export async function GET(req: NextRequest) {
    try {
        // Obtenir la date du jour (début et fin)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const scans = await Scan.findAll({
            where: {
                createdAt: {
                    [Op.gte]: today,
                    [Op.lt]: tomorrow
                }
            },
            order: [['createdAt', 'DESC']]
        });

        return NextResponse.json({
            success: true,
            data: scans
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des scans:', error);
        return NextResponse.json({ 
            success: false,
            error: 'Erreur lors de la récupération des scans' 
        }, { status: 500 });
    }
} 