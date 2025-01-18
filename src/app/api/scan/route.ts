import { NextResponse } from "next/server";
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import dotenv from 'dotenv';

dotenv.config();

export async function POST(request: Request) {
    try {
        const { code } = await request.json();
        // Lancer un navigateur headless
        const browser = await puppeteer.launch({ 
            executablePath: process.env.CHROMIUM_PATH,
            args: chromium.args,
            headless: chromium.headless,
        }); 
        const page = await browser.newPage();
        
        // Naviguer vers l'URL
        await page.goto(code);
        
        // Attendre que les éléments soient chargés
        await page.waitForSelector('#lb_res_licence');
        let buffer: any = '';
        // Extraire les données et télécharger l'image
        const result = await page.evaluate(async () => {
            const photoElement = document.querySelector('.photoLicencie') as HTMLImageElement;
            const photoUrl = photoElement?.src || '';
            
            return {
                licence: document.querySelector('#lb_res_licence')?.textContent?.trim() || '',
                nom: document.querySelector('#lb_res_nom')?.textContent?.trim() || '',
                prenom: document.querySelector('#lb_res_prenom')?.textContent?.trim() || '',
                photoUrl: photoUrl
            };
        });

        // Capturer l'image directement depuis la page
        let imageBase64 = '';
        if (result.photoUrl) {
            // Attendre que l'image soit chargée
            await page.waitForSelector('.photoLicencie');
            
            // Capturer l'image en base64 directement depuis la page
            const base64Data = await page.evaluate(() => {
                const img = document.querySelector('.photoLicencie') as HTMLImageElement;
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0);
                return canvas.toDataURL('image/jpeg').split(',')[1];
            });
            
            imageBase64 = base64Data;
        }

        // Fermer le navigateur
        await browser.close();
        
        return NextResponse.json({
            ...result,
            buffer,
            photoData: imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : null
        });
    } catch (error) {
        console.error('Erreur:', error);
        return NextResponse.json({ error: "Erreur lors de la récupération des données" }, { status: 500 });
    }
}