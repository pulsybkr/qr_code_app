import { NextRequest, NextResponse } from 'next/server';
import Controlleur from '../../../../../models/User';
import { passwordCompare } from '@/utils/auth/ft_auth';
import dotenv from 'dotenv';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

dotenv.config();

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        console.log('Received login request for email:', email);

        // Vérifiez si l'utilisateur existe
        const user = await Controlleur.findOne({ where: { email } });
        if (!user) {
            console.log('User not found');
            return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 400 });
        }

        // Vérifiez le mot de passe
        const isPasswordValid = passwordCompare(password, user.password);
        if (!isPasswordValid) {
            console.log('Invalid password');
            return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 400 });
        }

        // Générer un token JWT
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        console.log('Generated token:', token);

        // Définir le cookie
        const cookieStore = cookies();
        cookieStore.set('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 });

        // Renvoyez une réponse de succès si les informations  
        return NextResponse.json({ message: 'Connexion réussie', user, token }, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la connexion de l\'utilisateur:', error);
        return NextResponse.json({ error: 'Erreur lors de la connexion de l\'utilisateur' }, { status: 500 });
    }
}
