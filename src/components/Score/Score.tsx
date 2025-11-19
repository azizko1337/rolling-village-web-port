"use client";

import RollingVillage from "@/game/RollingVillage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {RotateCcw, ListCollapse} from "lucide-react"

type Props = {
    game: RollingVillage
}

const NUMBER_OF_ROUNDS = 9;

function Score(props: Props){
    const { game } = props;


    const pointsSummary = game.getPointsSummary();

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="w-full rounded-[2rem] border-4 border-white/30 bg-gradient-to-b from-white/80 to-white/65 p-4 shadow-[0_30px_40px_rgba(15,33,20,0.22)]">
                <div className="parchment-title text-center text-[0.7rem] tracking-[0.45em]">Tabela punktów</div>
                <div className="mt-4 -mx-1 overflow-x-auto pb-2 sm:mx-0 sm:overflow-visible sm:pb-0">
                    <div className="grid min-w-[540px] grid-cols-9 gap-2 sm:min-w-0">
                        {new Array(NUMBER_OF_ROUNDS).fill(null).map((_, index) => (
                            <div
                                key={`score-round-${index}-header`}
                                className="flex aspect-square items-center justify-center rounded-xl border border-white/50 bg-gradient-to-b from-[rgba(255,255,255,0.9)] to-[rgba(255,255,255,0.65)] text-xs font-black tracking-[0.3em] text-foreground/70"
                            >
                                {index + 1}
                            </div>
                        ))}
                        {Object.values(game.getPoints()).map((value, index) => (
                            <div
                                key={`score-round-${index}`}
                                className="flex aspect-square items-center justify-center rounded-xl border border-foreground/10 bg-[rgba(93,143,76,0.12)] text-lg font-semibold text-[color:var(--leaf-700)]"
                            >
                                {value}
                            </div>
                        ))}
                        {new Array(NUMBER_OF_ROUNDS - Object.values(game.getPoints()).length).fill(null).map((_, index) => (
                            <div
                                key={`score-round-empty-${index}`}
                                className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-foreground/15 text-lg text-foreground/25"
                            >
                                -
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {pointsSummary && (
                <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between">
                    <Dialog>
                        <DialogTrigger asChild className="my-2">
                            <Button variant="outline" size="lg" className="uppercase tracking-[0.3em]">
                                <ListCollapse size={18}/> Szczegóły ({pointsSummary.total} pkt)
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-[1.5rem] border-4 border-white/30 bg-gradient-to-b from-white/95 to-white/80">
                            <DialogHeader>
                                <DialogTitle className="text-center text-2xl">Zestawienie punktów</DialogTitle>
                                <DialogDescription className="mt-4 space-y-2 text-base text-foreground">
                                    <p><b>Rundy:</b> {pointsSummary.rounds}</p>
                                    <p><b>Fabryki:</b> {pointsSummary.factories}</p>
                                    <p><b>Place:</b> {pointsSummary.plazas}</p>
                                    <p className="mt-4 border-t border-dashed border-foreground/30 pt-2 text-lg font-bold">
                                        Razem: {pointsSummary.total} pkt
                                    </p>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                    <Button variant="outline" onClick={() => game.reset()} className="uppercase tracking-[0.25em]">
                        <RotateCcw size={16}/> Graj od nowa
                    </Button>
                </div>
            )}
        </div>
        
    )
}

export default Score