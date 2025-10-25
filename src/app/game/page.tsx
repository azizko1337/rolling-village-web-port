"use client";

import Cell from "@/components/Building/Cell";
import BuildingComponent from "@/components/Building/Cell";
import RollingVillage from "@/game/RollingVillage";
import Image from "next/image";
import { useEffect, useState, useReducer } from "react";
import Board from "@/components/Board/Board";

function Game() {
    const [, forceRerender] = useReducer(x => x + 1, 0);
    const [game, setGame] = useState(new RollingVillage());

    useEffect(() => {
        const interval = setInterval(() => {
            console.log("tick")
            game.tick();
            if(game.getIsAwaitingDiceRoll()){
                game.setRollDice([2, 4]);
            }
            forceRerender();
        }, 3000);
        return () => clearInterval(interval);
      }, []);

  return (
    <div className="">
        <h1>Rolling Village</h1>
        <h3>Faza gry: {game.getGamePhase()}</h3>
        <h3>Faza rundy: {game.getRoundPhase()}</h3>
        <h3>Stan kostki: {game.getDiceRoll().join(", ")}</h3>
        <h3>Runda: {game.getRound()}</h3>
        <Board game={game}/>
        
        
    </div>
  );
}

export default Game