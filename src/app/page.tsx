import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react";

export default function Home() {
  return (
    <div className="font-sans flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-8 bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('/game/ui/construction.png')] bg-repeat opacity-5"></div>
      
      <div className="z-10 flex flex-col items-center gap-6 bg-card p-10 rounded-2xl shadow-2xl border-4 border-border max-w-md w-full animate-in zoom-in duration-500">
        <div className="relative w-32 h-32 mb-4">
             <Image src="/game/building/house.png" alt="Logo" fill className="object-contain drop-shadow-lg animate-bounce" />
        </div>
        <h1 className="text-5xl font-extrabold text-center text-primary tracking-tight drop-shadow-sm">Rolling Village</h1>
        <p className="text-center text-muted-foreground text-lg">Zbuduj swoją wioskę, rzuć kośćmi i zdobądź punkty!</p>
        
        <menu className="w-full flex flex-col gap-4 mt-4">
          <Link href="/play/single" className="w-full">
            <Button size="lg" className="w-full text-lg font-bold gap-3 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <Play size={24} fill="currentColor"/> Graj w pojedynkę
            </Button>
          </Link>
        </menu>
      </div>
      
      <footer className="text-sm text-muted-foreground mt-8 z-10">
        &copy; 2025 Rolling Village
      </footer>
    </div>
  );
}
