import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { exec } from 'child_process';
import { promisify } from 'util';

dotenv.config();

const execAsync = promisify(exec);
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('🔄 Début de la migration Sequelize vers Prisma...');
        
        // 1. Générer la migration initiale de Prisma
        console.log('📝 Création de la migration Prisma...');
        await execAsync('npx prisma migrate dev --name init_migration');
        
        console.log('✅ Migration terminée avec succès !');
        console.log('');
        console.log('Instructions pour terminer la migration:');
        console.log('1. Modifiez votre fichier .env pour ajouter la variable DATABASE_URL');
        console.log('   Ex: DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"');
        console.log('2. Exécutez: npx prisma migrate dev');
        console.log('3. Supprimez les anciennes dépendances Sequelize si elles ne sont plus utilisées:');
        console.log('   npm uninstall sequelize pg pg-hstore');
        console.log('');
        console.log('Pour utiliser Prisma dans votre application:');
        console.log('1. Importez le client: import prisma from "@/lib/prisma"');
        console.log('2. Utilisez-le dans vos requêtes, ex: prisma.controlleur.findMany()');
        
    } catch (error) {
        console.error('❌ Erreur lors de la migration:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main(); 