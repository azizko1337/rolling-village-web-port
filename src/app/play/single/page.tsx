"use client";

import { useEffect, useState, useReducer } from "react";
import { useSearchParams } from "next/navigation";
import Board from "@/components/Board/Board";
import Score from "@/components/Score/Score";
import Dice from "@/game/Dice";
import RemainingBuildings from "@/components/Board/RemainingBuildings";
import GameState from "@/components/Board/GameState";
import RollingVillage from "@/game/RollingVillage";
import { CoffeeMug, Ruler, Pencil1, Pencil2, Compass, Triangle } from "@/components/ui/Decorations";

function Game() {
    const [, forceRerender] = useReducer(x => x + 1, 0);
    const [game, setGame] = useState(new RollingVillage());
    const searchParams = useSearchParams();
    const architect = searchParams.get('architect') || 'Architekt';
    const city = searchParams.get('city') || 'Nowe Miasto';

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
    <div className="flex items-center justify-center relative min-h-screen max-h-screen overflow-hidden">
      <Ruler />
      <CoffeeMug />
      <Pencil1 />
      <Pencil2 />
      <Compass />
      <Triangle />

      <div className="zoom-container flex flex-row items-center gap-6 z-20 w-full h-full p-6 justify-center max-w-[1800px]">
        <RemainingBuildings game={game} />

        <div className="relative">
          <div className="tape" style={{top: '-15px', left: '-30px', transform: 'rotate(-45deg)'}}></div>
          <div className="tape" style={{top: '-15px', right: '-30px', transform: 'rotate(45deg)'}}></div>
          <div className="tape" style={{bottom: '-15px', left: '-30px', transform: 'rotate(45deg)'}}></div>
          <div className="tape" style={{bottom: '-15px', right: '-30px', transform: 'rotate(-45deg)'}}></div>

          <div className="graph-paper bg-grid-pattern p-16 w-[750px] h-[900px] relative flex flex-col shadow-2xl">
            <div className="absolute top-8 right-10 font-['Rock_Salt'] text-2xl text-gray-500 opacity-60 transform rotate-3 leading-tight text-right">
              Rolling<br/>Village
            </div>

            <div className="w-full border-b-2 border-gray-800 pb-3 mb-4">
              <h1 className="text-5xl font-bold text-gray-800 tracking-wider leading-tight">
                PROJEKT MIASTA<br/>
                <span className="text-3xl text-gray-600">{city}</span>
              </h1>
            </div>

            <Board game={game} />


            <div className="absolute bottom-8 right-10 font-['Patrick_Hand'] text-3xl text-blue-800 transform -rotate-6 opacity-80">
              {architect}
            </div>
          </div>
        </div>

        <Score game={game} />

      </div>
    </div>
  );
}

export default Game
