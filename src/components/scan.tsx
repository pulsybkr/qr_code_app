"use client";
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

interface Result {
    licence: string;
    nom: string;
    prenom: string;
    photoUrl: string;
    localPhotoPath?: string;
    rawData?: string;
    htmlStructure?: string;
    photoData: string;
}

export default function Scan() {
  const [result, setResult] = useState<string | null>(null);
  const [data, setData] = useState<Result | null>(null);
  const [pause, setPause] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(false);

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    const qrCode = detectedCodes.find(code => 
      code.format === 'qr_code' || 
      code.format === 'micro_qr_code' || 
      code.format === 'rm_qr_code'
    );
    if (qrCode) {
      setResult(qrCode.rawValue);
    }
  };

  const handleRegister = async (data: Result) => {
    try {
      const response = await fetch(`/api/scan/register`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      const json = await response.json();
      
      if(response.ok) {
        console.log(json);
        Swal.fire({
          icon: 'success',
          title: 'Bienvenue ',
          timer: 3000,
          timerProgressBar: true,
          html: `
          <div class="flex flex-col items-center">
              <img src="${data.photoData}" alt="photo" class="w-16 h-16 rounded-full mb-4">
              <h1 class="text-2xl font-bold">${data.nom} ${data.prenom}</h1>
          </div>
          `,
        });
        setPause(false); // Réactive le scanner après un scan réussi
      } else {
        const error = json.error;
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: error || 'Une erreur est survenue lors du traitement du scan'
        });
        console.log(response);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (result) {
       fetch(`/api/scan`, {
        method: 'POST',
        body: JSON.stringify({ code: result }),
       })
       .then(res => res.json())
       .then((data) => {
        setData(data);
        setPause(true);
        handleRegister(data);
       })
       .catch(err => console.log(err));
    }
  }, [result]);

  return (
    <>
      <div className='w-96 h-96 relative'>
        <Scanner 
            onScan={handleScan} 
            allowMultiple={true} 
            paused={pause}
            constraints={{
              facingMode: isFrontCamera ? "user" : "environment"
            }}
            classNames={{
              video: 'rounded-xl'
            }}
          />
          
          <button 
            onClick={() => setIsFrontCamera(!isFrontCamera)}
            className="absolute top-1 right-1 bg-gray-400 p-2 rounded-full shadow-md"
          >
            {isFrontCamera ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            )}
          </button>
        </div>
        
        {data && (
          <section>
            <button 
              onClick={() => {
                setData(null);
                setResult(null);
                setPause(false);
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Nouveau scan
            </button>
          </section>
        )}
       
      </>
    );
}

