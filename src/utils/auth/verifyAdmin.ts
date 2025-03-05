import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function verifyAdmin(req: NextRequest): Promise<boolean> {
    try {
        const token = req.cookies.get('tk_lgly_fftir_4454df');
        if (!token) return false;

        const decoded = jwt.verify(token.value, process.env.JWT_SECRET as string) as { userId: string };
        const user = await prisma.controlleur.findUnique({ 
            where: { id: decoded.userId },
            select: { role: true }
        });

        return user?.role === 'admin';
    } catch (error) {
        return false;
    }
} 