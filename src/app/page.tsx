'use client'
import Scan from "@/components/scan";
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function Home() {
  const router = useRouter();

  const handleDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <main className="bg-background-light dark:bg-background-dark min-h-screen 
                     flex flex-col items-center justify-center p-24 
                     transition-colors duration-200">
      <div className="absolute top-4 right-4 flex space-x-4">
        <ThemeToggle />
        <button 
          onClick={handleDashboard} 
          className="bg-primary-light dark:bg-primary-dark text-white p-2 rounded-lg
                     hover:opacity-90 transition-opacity duration-200"
        >
          <svg width="25px" height="25px" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.5 8.75V18.5H18.5V8.75M4.5 10L12.5 5L20.5 10M14.5 18.5V11.5H10.5V18.5" 
                  stroke="currentColor" strokeWidth="1.2"/>
          </svg>
        </button>
      </div>
      <div className="w-96 rounded-lg">
        <Scan />
      </div>
    </main>
  );
}
