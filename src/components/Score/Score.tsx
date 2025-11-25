"use client";

import RollingVillage from "@/game/RollingVillage";
import {Dice1, Dice2, Dice3, Dice4, Dice5, Dice6} from "lucide-react";

type Props = {
    game: RollingVillage
}

const NUMBER_OF_ROUNDS = 9;

export function RoundInfo({ game, className }: { game: RollingVillage, className?: string }) {
    const renderDice = () => {
        const diceRoll = game.getDiceRoll();
        return (
            <div className="flex gap-3 justify-center">
                {diceRoll.map((value, index) => {
                    const DiceIcon = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6][value - 1];
                    return <DiceIcon size={48} key={index} className="text-gray-800" />;
                })}
            </div>
        );
    };

    const isRowSelectionMode = game.getRoundPhase() === "calculate" && 
                               game.getIsAwaitingPlayerAction() && 
                               game.getScoredRow() === null;

    return (
        <div className={`flex flex-col gap-4 ${className}`}>
            {isRowSelectionMode && (
                <div className="w-64 bg-red-100 border-2 border-red-400 p-4 text-center text-red-800 font-bold animate-pulse transform rotate-1 shadow-lg">
                    Wybierz rząd do punktowania!
                </div>
            )}
            <div className="w-64 bg-yellow-200 shadow-lg transform rotate-2 p-6 flex flex-col gap-4" style={{clipPath: 'polygon(0 0, 100% 0, 100% 95%, 95% 100%, 0 100%)'}}>
                <div className="text-center">
                    <div className="text-sm text-gray-600 uppercase tracking-wide mb-1">Runda</div>
                    <div className="text-5xl font-bold text-gray-800">{game.getRound()}</div>
                </div>
                <div className="border-t-2 border-yellow-400 pt-3">
                    <div className="text-sm text-gray-600 uppercase tracking-wide mb-2 text-center">Kostki</div>
                    {renderDice()}
                </div>
            </div>
        </div>
    );
}

export function ScoreTable({ game }: { game: RollingVillage }) {
    const points = game.getPoints();
    return (
        <div className="w-64 h-48 binder-page-horizontal transform -rotate-2 flex flex-col p-2">
            <div className="text-center font-bold text-gray-600 mb-1 tracking-widest text-2xl uppercase">Punkty</div>
            <div className="grid grid-cols-3 grid-rows-3 gap-1 h-full w-full">
                {Array.from({ length: NUMBER_OF_ROUNDS }).map((_, index) => {
                    const hasPoint = points[index + 1] !== undefined;
                    return (
                        <div 
                            key={index} 
                            className={`calendar-cell ${hasPoint ? 'calendar-cell-highlight' : 'bg-white'}`}
                        >
                            <span className="calendar-cell-number">{index + 1}</span>
                            <span className="text-lg font-bold">{hasPoint ? points[index + 1] : '-'}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function Score(props: Props){
    const { game } = props;

    return (
        <div className="flex flex-row lg:flex-col gap-6 pt-0 lg:pt-10 flex-wrap justify-center">
            <RoundInfo game={game} />
            <ScoreTable game={game} />
        </div>
    )
}

export default Score
