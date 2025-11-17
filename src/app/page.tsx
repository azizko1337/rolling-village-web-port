import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-4xl font-bold mb-8 text-center">Rolling Village</h1>
      <menu>
        <Link href="/play/single">
          <Button variant="outline">
            <Play size={10}/>Graj w pojedynkę
          </Button>
        </Link>
      </menu>
    </div>
  );
}
