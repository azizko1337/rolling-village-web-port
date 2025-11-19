"use client";

import Cell from "@/components/Building/Cell";
import BuildingComponent from "@/components/Building/Cell";
import RollingVillage from "@/game/RollingVillage";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useReducer } from "react";

type Props = {
    game: RollingVillage
}

function Board(props: Props){
    const [, forceRerender] = useReducer(x => x + 1, 0);
    const { game } = props;

    

    function handleBuild(building: Building, position: number){
        game.build(building, position);
        forceRerender();
    }

    function getAllowedBuildingsForPosition(position: number): Building[] {
        if (!game.getIsAwaitingPlayerAction()) return [];
        
        
        if (game.getRoundPhase() === "bonus") {
            return game.getAvailableBonusBuildings();
        }
        
        
        const column = (position % 6) + 1;
        const remainingPlacements = game.getRemainingPlacements();
        
        const allowedBuildings = remainingPlacements
            .filter(placement => placement.column === column)
            .map(placement => placement.building);
        
        return allowedBuildings;
    }
    

    return (
        <div className="flex w-full max-w-[600px] p-6 bg-card rounded-xl shadow-2xl border-4 border-border relative">
            {/* Wood texture overlay or similar effect could go here */}
            <div className="flex flex-col px-2 pt-10 gap-1 font-bold text-foreground/80">
                <span className="grow flex items-center justify-center bg-background/50 rounded-l-md my-1 shadow-inner">3, 4</span>
                <span className="grow flex items-center justify-center bg-background/50 rounded-l-md my-1 shadow-inner">5, 6</span>
                <span className="grow flex items-center justify-center bg-background/50 rounded-l-md my-1 shadow-inner">7</span>
                <span className="grow flex items-center justify-center bg-background/50 rounded-l-md my-1 shadow-inner">8, 9</span>
                <span className="grow flex items-center justify-center bg-background/50 rounded-l-md my-1 shadow-inner">10, 11</span>
            </div>
            <div className="flex flex-col w-full">
                <div className="flex h-10 gap-1 font-bold text-foreground/80 mb-2">
                    <span className="grow flex items-center justify-center bg-background/50 rounded-t-md shadow-inner">1</span>
                    <span className="grow flex items-center justify-center bg-background/50 rounded-t-md shadow-inner">2</span>
                    <span className="grow flex items-center justify-center bg-background/50 rounded-t-md shadow-inner">3</span>
                    <span className="grow flex items-center justify-center bg-background/50 rounded-t-md shadow-inner">4</span>
                    <span className="grow flex items-center justify-center bg-background/50 rounded-t-md shadow-inner">5</span>
                    <span className="grow flex items-center justify-center bg-background/50 rounded-t-md shadow-inner">6</span>
                </div>
                <div className="grid grid-cols-6 grid-rows-5 w-full gap-1 p-1 bg-background/30 rounded-lg border-2 border-border/30">
                {
                    game.getBoard().map((building, index) => (
                        <Cell 
                            key={`building-${index}`} 
                            building={building} 
                            position={index} 
                            allowedBuildings={getAllowedBuildingsForPosition(index)} 
                            onBuild={handleBuild}
                            isBonusPhase={game.getRoundPhase() === "bonus"} />
                    ))
                }
                </div>
            </div>
        </div>
    )
}

export default Board