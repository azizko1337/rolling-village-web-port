import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="board-paper max-w-3xl w-full soft-fade-in">
        <div className="board-surface">
          <div className="flex flex-col items-center gap-10 text-center">
            <div className="floaty">
              <p className="parchment-title tracking-[0.5em] text-xs">Planszowa wyprawa</p>
              <h1 className="text-5xl font-semibold text-[color:var(--forest-ink)]">Rolling Village</h1>
              <p className="mt-4 max-w-lg text-base font-medium text-foreground/80">
                Rzuć kostkami, rozbuduj własną osadę i poznaj magiczną atmosferę planszówki w nowej odsłonie.
              </p>
            </div>
            <menu className="flex flex-col gap-4 sm:flex-row">
              <Link href="/play/single">
                <Button size="lg" className="uppercase tracking-[0.2em]">
                  <Play size={16} /> Rozpocznij przygodę
                </Button>
              </Link>
            </menu>
          </div>
        </div>
      </div>
    </div>
  );
}
