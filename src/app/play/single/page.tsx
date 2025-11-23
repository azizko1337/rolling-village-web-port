"use client";

import { useEffect, useState, useReducer } from "react";
import { useSearchParams } from "next/navigation";
import Board from "@/components/Board/Board";
import Score, { RoundInfo, ScoreTable } from "@/components/Score/Score";
import Dice from "@/game/Dice";
import RemainingBuildings from "@/components/Board/RemainingBuildings";
import RollingVillage from "@/game/RollingVillage";
import { CoffeeMug, Ruler, Pencil1, Pencil2, Compass, Triangle } from "@/components/ui/Decorations";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Scroll, Trophy } from "lucide-react";
import { use } from 'react'

function Game({
  searchParams,
}: {
  searchParams: Promise<{ city?: string, architect?: string }>;
}) {
    const [, forceRerender] = useReducer(x => x + 1, 0);
    const params = use(searchParams)
    const [game, setGame] = useState(new RollingVillage());
    const architect = params.architect || 'Architekt';
    const city = params.city || 'Nowe Miasto';

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

      <div className="zoom-container flex flex-col lg:flex-row items-center gap-6 z-20 w-full min-h-screen lg:h-full p-0 lg:p-6 justify-center max-w-[1800px]">
        <div className="hidden lg:block order-2 lg:order-1">
          <RemainingBuildings game={game} />
        </div>

        <div className="relative order-1 lg:order-2 w-[95%] lg:w-full lg:max-w-[750px] h-auto lg:h-auto">
          <div className="tape hidden lg:block" style={{top: '-15px', left: '-30px', transform: 'rotate(-45deg)'}}></div>
          <div className="tape hidden lg:block" style={{top: '-15px', right: '-30px', transform: 'rotate(45deg)'}}></div>
          <div className="tape hidden lg:block" style={{bottom: '-15px', left: '-30px', transform: 'rotate(45deg)'}}></div>
          <div className="tape hidden lg:block" style={{bottom: '-15px', right: '-30px', transform: 'rotate(-45deg)'}}></div>

          <div className="graph-paper bg-grid-pattern p-2 lg:p-16 w-full lg:w-[750px] min-h-[90vh] lg:min-h-[600px] lg:h-[900px] relative flex flex-col shadow-2xl rounded-lg lg:rounded-none my-4 lg:my-0">
            <div className="absolute top-4 lg:top-8 right-4 lg:right-10 font-['Rock_Salt'] text-xl lg:text-2xl text-gray-500 opacity-60 transform rotate-3 leading-tight text-right">
              Rolling<br/>Village
            </div>

            <div className="lg:hidden flex justify-center pt-2 mb-2">
                <RoundInfo game={game} className="scale-75 origin-top" />
            </div>

            <div className="w-full border-b-2 border-gray-800 pb-3 mb-4 mt-2 lg:mt-0">
              <h1 className="text-3xl lg:text-5xl font-bold text-gray-800 tracking-wider leading-tight">
                PROJEKT MIASTA<br/>
                <span className="text-xl lg:text-3xl text-gray-600">{city}</span>
              </h1>
            </div>

            <div className="flex-1 flex items-center justify-center flex-col gap-4">
               <Board game={game} />
               
               <div className="flex gap-4 z-50">
                  <Button 
                      onClick={() => game.undo()} 
                      disabled={!game.canUndo()}
                      variant="secondary"
                      className="w-32"
                  >
                      Cofnij
                  </Button>
                  <Button 
                      onClick={() => game.confirm()} 
                      disabled={!game.canConfirm()}
                      className="w-32 bg-green-700 hover:bg-green-800 text-white"
                  >
                      Zatwierdź
                  </Button>
               </div>
            </div>


            <div className="absolute bottom-4 lg:bottom-8 right-10 font-['Patrick_Hand'] text-2xl lg:text-3xl text-blue-800 transform -rotate-6 opacity-80">
              {architect}
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-col gap-6 w-full lg:w-auto lg:h-full justify-center order-3">
          <Score game={game} />
        </div>

        <div className="fixed right-0 top-1/4 flex flex-col gap-2 z-50 lg:hidden">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="secondary" className="rounded-l-xl rounded-r-none h-12 w-12 p-0 shadow-xl border-l-2 border-y-2 border-gray-800 bg-amber-100">
                        <Scroll className="h-6 w-6 text-amber-900" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-auto bg-transparent border-none shadow-none p-0 flex justify-center" showCloseButton={false}>
                    <DialogTitle className="sr-only">Podsumowanie</DialogTitle>
                    <RemainingBuildings game={game} />
                </DialogContent>
            </Dialog>

            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="secondary" className="rounded-l-xl rounded-r-none h-12 w-12 p-0 shadow-xl border-l-2 border-y-2 border-gray-800 bg-yellow-100">
                        <Trophy className="h-6 w-6 text-yellow-900" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-auto bg-transparent border-none shadow-none p-0 flex justify-center" showCloseButton={false}>
                    <DialogTitle className="sr-only">Wynik</DialogTitle>
                    <div className="flex flex-col gap-4 items-center">
                        <ScoreTable game={game} />
                    </div>
                </DialogContent>
            </Dialog>
        </div>

      </div>
    </div>
  );
}

export default Game
