"use client";

import { useEffect, useState, useReducer } from "react";
import { useSearchParams } from "next/navigation";
import Board from "@/components/Board/Board";
import Score from "@/components/Score/Score";
import Dice from "@/game/Dice";
import RemainingBuildings from "@/components/Board/RemainingBuildings";
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
    <div className="flex items-center justify-center relative min-h-screen overflow-auto lg:overflow-hidden bg-[#5D4037]">
      <div className="hidden lg:block">
        <Ruler />
        <CoffeeMug />
        <Pencil1 />
        <Pencil2 />
        <Compass />
        <Triangle />
      </div>

      <div className="zoom-container flex flex-col lg:flex-row items-center gap-6 z-20 w-full min-h-screen lg:h-full p-2 lg:p-6 justify-center max-w-[1800px]">
        <div className="order-2 lg:order-1">
          <RemainingBuildings game={game} />
        </div>

        <div className="relative order-1 lg:order-2 w-full max-w-[750px]">
          <div className="tape hidden lg:block" style={{top: '-15px', left: '-30px', transform: 'rotate(-45deg)'}}></div>
          <div className="tape hidden lg:block" style={{top: '-15px', right: '-30px', transform: 'rotate(45deg)'}}></div>
          <div className="tape hidden lg:block" style={{bottom: '-15px', left: '-30px', transform: 'rotate(45deg)'}}></div>
          <div className="tape hidden lg:block" style={{bottom: '-15px', right: '-30px', transform: 'rotate(-45deg)'}}></div>

          <div className="graph-paper bg-grid-pattern p-4 lg:p-16 w-full lg:w-[750px] min-h-[600px] lg:h-[900px] relative flex flex-col shadow-2xl rounded-lg lg:rounded-none">
            <div className="absolute top-4 lg:top-8 right-4 lg:right-10 font-['Rock_Salt'] text-xl lg:text-2xl text-gray-500 opacity-60 transform rotate-3 leading-tight text-right">
              Rolling<br/>Village
            </div>

            <div className="w-full border-b-2 border-gray-800 pb-3 mb-4 mt-8 lg:mt-0">
              <h1 className="text-3xl lg:text-5xl font-bold text-gray-800 tracking-wider leading-tight">
                PROJEKT MIASTA<br/>
                <span className="text-xl lg:text-3xl text-gray-600">{city}</span>
              </h1>
            </div>

            <div className="flex-1 flex items-center justify-center">
               <Board game={game} />
            </div>


            <div className="absolute bottom-4 lg:bottom-8 right-10 font-['Patrick_Hand'] text-2xl lg:text-3xl text-blue-800 transform -rotate-6 opacity-80">
              {architect}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 w-full lg:w-auto lg:h-full justify-center order-3">
          <Score game={game} />
        </div>

      </div>
    </div>
  );
}

export default Game
