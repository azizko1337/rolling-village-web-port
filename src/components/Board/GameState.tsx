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
            <div className="flex gap-1">
                {diceRoll.map((value, index) => {
                    const DiceIcon = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6][value - 1];
                    return <DiceIcon size={36} key={index} />;
                })}
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-1">
            <div className="text-2xl text-green-700 font-bold">Runda: {game.getRound()}</div>
            <div className="flex items-center gap-2 text-lg text-gray-700">
                <span>Kostki:</span>
                {renderDice()}
            </div>
            {game.getIsAwaitingPlayerAction() && (
                <div className="text-sm text-blue-600 font-bold">Twój ruch!</div>
            )}
            {game.getRoundPhase() === "bonus" && (
                <div className="text-sm text-purple-600 font-bold">Bonus!</div>
            )}
            {game.getGamePhase() === "gameover" && (
                <div className="text-xl text-red-600 font-bold">
                    Koniec! {game.getPointsSummary()?.total} pkt
                </div>
            )}
        </div>
    )
}

export default GameState