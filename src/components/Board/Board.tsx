"use client";

import Cell from "@/components/Building/Cell";
import RollingVillage from "@/game/RollingVillage";
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
        <div className="flex w-full">
            <div className="flex flex-col pt-6 lg:pt-8 pr-1 lg:pr-2 text-xs lg:text-base text-gray-600 font-['Patrick_Hand']">
                <span className="grow flex items-center justify-end">3, 4</span>
                <span className="grow flex items-center justify-end">5, 6</span>
                <span className="grow flex items-center justify-end">7</span>
                <span className="grow flex items-center justify-end">8, 9</span>
                <span className="grow flex items-center justify-end">10, 11</span>
            </div>
            
            <div className="flex flex-col w-full">
                <div className="flex h-6 lg:h-8 mb-1 text-xs lg:text-base text-gray-600 font-['Patrick_Hand']">
                    <span className="grow flex items-center justify-center">1</span>
                    <span className="grow flex items-center justify-center">2</span>
                    <span className="grow flex items-center justify-center">3</span>
                    <span className="grow flex items-center justify-center">4</span>
                    <span className="grow flex items-center justify-center">5</span>
                    <span className="grow flex items-center justify-center">6</span>
                </div>
                
                <div className="grid grid-cols-6 grid-rows-5 w-full border-4 border-gray-800 p-1 bg-white/50">
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
