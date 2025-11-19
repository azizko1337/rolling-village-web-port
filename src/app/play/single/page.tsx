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
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 lg:gap-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/">
            <Button variant="outline" size="sm" className="uppercase tracking-[0.3em]">
              <MoveLeft size={16} /> Menu
            </Button>
          </Link>
          <p className="parchment-title hidden text-[0.65rem] sm:block">Nowa planszowa odsłona Rolling Village</p>
        </div>

        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)] xl:grid-cols-[minmax(0,1.85fr)_minmax(360px,1fr)]">
          <div className="order-2 lg:order-1">
            <Board game={game} />
          </div>
          <div className="order-1 lg:order-2 lg:sticky lg:top-8">
            <div className="flex flex-col gap-5 lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto lg:pr-2">
              <GameState game={game} />
              <RemainingBuildings game={game} />
              <Score game={game} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game