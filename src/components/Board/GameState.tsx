"use client";

import Cell from "@/components/Building/Cell";
import BuildingComponent from "@/components/Building/Cell";
import RollingVillage from "@/game/RollingVillage";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useReducer } from "react";
import React from "react";
import {Dice1, Dice2, Dice3, Dice4, Dice5, Dice6} from "lucide-react";

type Props = {
    game: RollingVillage
}

function GameState(props: Props){
    const { game } = props;

    const renderDice = () => {
        const diceRoll = game.getDiceRoll();
        return (
            <div className="flex gap-3">
                {diceRoll.map((value, index) => {
                    const DiceIcon = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6][value - 1];
                    return (
                        <div key={index} className="bg-white text-black rounded-lg shadow-md p-1 border border-gray-300 transform hover:scale-110 transition-transform duration-200">
                            <DiceIcon size={40} strokeWidth={1.5} />
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-2 bg-card p-6 rounded-xl shadow-lg border-2 border-border min-w-[300px] animate-in fade-in slide-in-from-top-4 duration-500">
            <h1 className="w-full text-center font-bold text-2xl text-primary">Runda {game.getRound()}</h1>
            <div className="w-full flex flex-col items-center justify-center gap-2 my-2">
                <span className="text-muted-foreground font-medium uppercase tracking-wider text-xs">Wynik kości</span>
                <div className="bg-background/50 p-3 rounded-lg border border-border/30 shadow-inner">
                    {renderDice()}
                </div>
            </div>
            <div className="text-center font-medium text-foreground/90 min-h-[1.5em]">
                {game.getIsAwaitingPlayerAction()  && <span className="animate-pulse text-primary">Twój ruch!</span>}
                {game.getRoundPhase() === "bonus" && <span className="text-secondary font-bold animate-bounce">Postaw bonusowy budynek!</span>}
                {game.getGamePhase() === "gameover" && <span className="text-destructive font-bold">Gra zakończona! Wynik: {game.getPointsSummary()?.total} pkt.</span>}
            </div>
        </div>
    )
}

export default GameState