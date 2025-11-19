"use client";

import RollingVillage from "@/game/RollingVillage";
import {Dice1, Dice2, Dice3, Dice4, Dice5, Dice6} from "lucide-react";

type Props = {
    game: RollingVillage
}

function GameState(props: Props){
    const { game } = props;

    const renderDice = () => {
        const diceRoll = game.getDiceRoll();
        return (
            <div className="flex gap-2">
                {diceRoll.map((value, index) => {
                    const DiceIcon = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6][value - 1];
                    return (
                        <div
                            key={index}
                            className="flex size-12 items-center justify-center rounded-2xl border-2 border-white/40 bg-white/80 shadow-[0_15px_20px_rgba(32,49,28,0.15)]"
                        >
                            <DiceIcon size={26} className="text-[color:var(--leaf-700)]" />
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="w-full rounded-[1.75rem] border-4 border-white/30 bg-gradient-to-b from-white/70 via-white/80 to-white/60 p-5 text-center shadow-[0_25px_45px_rgba(14,35,18,0.25)]">
            <p className="parchment-title text-[0.65rem]">Aktualna runda</p>
            <h1 className="text-2xl font-semibold text-[color:var(--leaf-700)] sm:text-3xl">Runda {game.getRound()} / 9</h1>
            <div className="mt-5 flex flex-col items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.4em] text-foreground/70">Kości</span>
                {renderDice()}
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-3 text-sm font-semibold">
                {game.getIsAwaitingPlayerAction() && (
                    <span className="rounded-full border border-foreground/20 bg-foreground/5 px-4 py-1 tracking-wide">
                        Twój ruch
                    </span>
                )}
                {game.getRoundPhase() === "bonus" && (
                    <span className="rounded-full border border-foreground/20 bg-[rgba(255,223,139,0.4)] px-4 py-1">
                        Bonusowy budynek
                    </span>
                )}
                {game.getGamePhase() === "gameover" && (
                    <span className="rounded-full border border-foreground/20 bg-[rgba(93,143,76,0.25)] px-4 py-1">
                        Wynik: {game.getPointsSummary()?.total} pkt
                    </span>
                )}
            </div>
        </div>
    )
}

export default GameState