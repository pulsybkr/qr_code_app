import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
    try {
        // Récupération et validation des paramètres de requête
        const searchParams = new URL(req.url).searchParams;
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')));
        const search = searchParams.get('search')?.trim() || '';

        // Définition de la plage horaire pour aujourd'hui (00:00:00 à 23:59:59)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Construction de la condition where de base avec la date
        const dateCondition: Prisma.ScanWhereInput = {
            createdAt: {
                gte: today,
                lt: tomorrow
            }
        };

        // Construction de la condition where complète
        let whereCondition: Prisma.ScanWhereInput;
        
        if (search) {
            whereCondition = {
                AND: [
                    dateCondition,
                    {
                        OR: [
                            { nom: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
                            { prenom: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
                            { licence: { contains: search, mode: 'insensitive' as Prisma.QueryMode } }
                        ]
                    }
                ]
            };
        } else {
            whereCondition = dateCondition;
        }

        // Utilisation d'une transaction Prisma pour garantir la cohérence des données
        const [count, rows] = await prisma.$transaction([
            // Comptage du nombre total d'enregistrements
            prisma.scan.count({
                where: whereCondition
            }),
            // Récupération des données paginées
            prisma.scan.findMany({
                where: whereCondition,
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: (page - 1) * limit,
                include: {
                    // Inclusion des informations du contrôleur (sans le mot de passe)
                    controlleur: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    }
                }
            })
        ]);

        // Calcul du nombre total de pages
        const totalPages = Math.ceil(count / limit);

        // Retour de la réponse formatée
        return NextResponse.json({
            success: true,
            data: rows,
            total: count,
            totalPages,
            currentPage: page,
            limit
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des scans:', error);
        
        // Gestion plus précise des erreurs de Prisma
        const errorMessage = error instanceof Error 
            ? `Erreur lors de la récupération des scans: ${error.message}` 
            : 'Erreur inconnue lors de la récupération des scans';
            
        return NextResponse.json({ 
            success: false,
            error: errorMessage
        }, { status: 500 });
    }
} 