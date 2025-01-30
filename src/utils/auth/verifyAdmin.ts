import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import Controlleur from '../../../models/User';

export async function verifyAdmin(req: NextRequest): Promise<boolean> {
    try {
        const token = req.cookies.get('tk_lgly_fftir_4454df');
        if (!token) return false;

        const decoded = jwt.verify(token.value, process.env.JWT_SECRET as string) as { userId: number };
        const user = await Controlleur.findOne({ 
            where: { id: decoded.userId },
            attributes: ['role']
        });

        return user?.role === 'admin';
    } catch (error) {
        return false;
    }
} 