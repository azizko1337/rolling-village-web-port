"use client";

import Cell from "@/components/Building/Cell";
import BuildingComponent from "@/components/Building/Cell";
import RollingVillage from "@/game/RollingVillage";
import Image from "next/image";
import { useEffect, useState, useReducer } from "react";
import Board from "@/components/Board/Board";
import Score from "@/components/Score/Score";
import Dice from "@/game/Dice";
import Link from "next/link";
import RemainingBuildings from "@/components/Board/RemainingBuildings";
import { Button } from "@/components/ui/button"
import { MoveLeft } from "lucide-react";
import GameState from "@/components/Board/GameState";

function Game() {
    const [, forceRerender] = useReducer(x => x + 1, 0);
    const [game, setGame] = useState(new RollingVillage());

    useEffect(() => {
      let active = true;
      const loop = () => {
        if (!active) return;
        game.tick();
        if (game.getIsAwaitingDiceRoll()) {
          game.setRollDice(Dice.roll());
        }
        forceRerender();
        requestAnimationFrame(loop);
      };
      loop();
      return () => { active = false; };
    }, [game]);

  return (
    <div className="min-h-screen w-full p-4">
      
        <Link href="/">
          <Button variant="outline"> <MoveLeft size={10}/> Menu</Button>
        </Link>

        {/* <h1>Rolling Village</h1>
        <h3>Faza gry: {game.getGamePhase()}</h3>
        <h3>Faza rundy: {game.getRoundPhase()}</h3>
        <h3>Stan kostki: {game.getDiceRoll().join(", ")}</h3>
        <h3>Runda: {game.getRound()}</h3> */}

        <div className="flex justify-center my-4">
          <GameState game={game}/>
        </div>

        <div className="flex flex-col items-center gap-6 w-full max-w-[768px] mx-auto">
          <div className="w-full flex justify-center gap-10">
            <Board game={game}/>
            <RemainingBuildings game={game}/>
          </div>
          <div className="w-full flex justify-center">
            <Score game={game}/>
          </div>
        </div>
        
        
    </div>
  );
}

export default Game