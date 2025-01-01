import Scan from "@/components/scan";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-96 rounded-lg">
        <Scan />
      </div>
    </main>
  );
}
