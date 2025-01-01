import { NextRequest, NextResponse } from 'next/server';
import Controlleur from '../../../../../models/User';
import { passwordHash } from '@/utils/auth/ft_auth';
import dotenv from 'dotenv';

dotenv.config();

export const POST = async (req: NextRequest) => {
    try {
        const { firstName, lastName, email, password, accessCode } = await req.json();
        const codeEnv = process.env.CODE_REGISTRATION;

        if (accessCode !== codeEnv) {
            return NextResponse.json({ error: 'Code de validation incorrect' }, { status: 400 });
        }

        const emailExist = await Controlleur.findOne({ where: { email } });
        if (emailExist) {
            return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 400 });
        }

        const user = await Controlleur.create({ firstName, lastName, email, password: passwordHash(password) });
        if (!user) {
            return NextResponse.json({ error: 'Erreur lors de la création de l\'utilisateur' }, { status: 500 });
        }
        return NextResponse.json({ message: 'Utilisateur créé avec succès' }, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        return NextResponse.json({ error: 'Erreur lors de la création de l\'utilisateur' }, { status: 500 });
    }
}
