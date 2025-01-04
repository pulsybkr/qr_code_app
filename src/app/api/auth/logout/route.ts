import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
    try {
        const cookieStore = await cookies();
        cookieStore.delete('tk_lgly_fftir_4454df');
        return NextResponse.json({ message: 'Déconnexion réussie' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Erreur lors de la déconnexion' }, { status: 500 });
    }
}