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
        <div className="board-paper w-full p-4 sm:p-5 soft-fade-in shadow-[0_30px_60px_rgba(33,55,34,0.25)]">
            <div className="board-surface flex flex-col">
                <div className="flex w-full gap-4">
                    <div className="flex flex-col justify-between pt-14 text-xs font-semibold tracking-[0.3em] text-foreground/65">
                        {[ ["3", "4"], ["5", "6"], ["7"], ["8", "9"], ["10", "11"] ].map((items, idx) => (
                            <span key={`row-label-${idx}`} className="flex flex-1 items-center justify-end pr-1">
                                ({items.join("·")})
                            </span>
                        ))}
                    </div>
                    <div className="flex w-full flex-col gap-3">
                        <div className="flex gap-3 text-xs font-semibold tracking-[0.3em] text-foreground/65">
                            {[1, 2, 3, 4, 5, 6].map(column => (
                                <span key={`column-${column}`} className="flex h-10 flex-1 items-center justify-center rounded-full bg-white/20">
                                    {column}
                                </span>
                            ))}
                        </div>
                        <div className="board-grid grid aspect-[6/5] grid-cols-6 grid-rows-5 gap-2 p-3">
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
            </div>
        </div>
    );
}

export default Board