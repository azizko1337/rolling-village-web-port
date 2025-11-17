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
        <div className="flex w-full max-w-[512px]">
            <div className="flex flex-col px-2 pt-10">
                <span className="grow flex items-center justify-center">3, 4</span>
                <span className="grow flex items-center justify-center">5, 6</span>
                <span className="grow flex items-center justify-center">7</span>
                <span className="grow flex items-center justify-center">8, 9</span>
                <span className="grow flex items-center justify-center">10, 11</span>
            </div>
            <div className="flex flex-col w-full">
                <div className="flex h-10">
                    <span className="grow flex items-center justify-center">1</span>
                    <span className="grow flex items-center justify-center">2</span>
                    <span className="grow flex items-center justify-center">3</span>
                    <span className="grow flex items-center justify-center">4</span>
                    <span className="grow flex items-center justify-center">5</span>
                    <span className="grow flex items-center justify-center">6</span>
                </div>
                <div className="grid grid-cols-6 grid-rows-5 w-full border">
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