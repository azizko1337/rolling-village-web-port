"use client";

import RollingVillage from "@/game/RollingVillage";
import { useEffect, useState, useReducer } from "react";
import Board from "@/components/Board/Board";
import Score from "@/components/Score/Score";
import Dice from "@/game/Dice";
import Link from "next/link";
import RemainingBuildings from "@/components/Board/RemainingBuildings";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import GameState from "@/components/Board/GameState";

function Game() {
    const [, forceRerender] = useReducer(x => x + 1, 0);
    const [game] = useState(() => new RollingVillage());

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
    <div className="min-h-screen w-full px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="outline" size="sm" className="uppercase tracking-[0.3em]">
              <MoveLeft size={16} /> Menu
            </Button>
          </Link>
          <p className="parchment-title hidden text-[0.65rem] sm:block">Nowa planszowa odsłona Rolling Village</p>
        </div>

        <div className="board-paper p-5">
          <div className="board-surface flex flex-col gap-6">
            <div className="flex justify-center">
              <GameState game={game} />
            </div>

            <div className="flex flex-col gap-8 lg:flex-row">
              <Board game={game} />
              <RemainingBuildings game={game} />
            </div>

            <div className="flex justify-center">
              <Score game={game} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game