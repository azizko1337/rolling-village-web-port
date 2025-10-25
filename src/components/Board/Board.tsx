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
        console.log(game.getIsAwaitingPlayerAction());
        game.build(building, position);
        forceRerender();
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
                    <span className="grow flex items-center justify-center">3, 4</span>
                    <span className="grow flex items-center justify-center">5, 6</span>
                    <span className="grow flex items-center justify-center">7</span>
                    <span className="grow flex items-center justify-center">8, 9</span>
                    <span className="grow flex items-center justify-center">10, 11</span>
                    <span className="grow flex items-center justify-center">10, 11</span>
                </div>
                <div className="grid grid-cols-6 grid-rows-5 w-full border">
                {
                    game.getBoard().map((building, index) => (
                        <Cell 
                            key={`building-${index}`} 
                            building={building} 
                            position={index} 
                            allowedBuildings={["house", "forest"]} 
                            onBuild={handleBuild} />
                    ))
                }
                </div>
            </div>
        </div>
    )
}

export default Board