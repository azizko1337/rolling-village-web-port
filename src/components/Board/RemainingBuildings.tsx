"use client";

import Cell from "@/components/Building/Cell";
import BuildingComponent from "@/components/Building/Cell";
import RollingVillage from "@/game/RollingVillage";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useReducer } from "react";
import React from "react";

type Props = {
    game: RollingVillage
}

const NUMBER_OF_ROUNDS = 9;

function RemainingBuildings(props: Props){
    const { game } = props;

    return (
        <div className="h-full ">
            <h2 className="h-10 flex items-center justify-center">Dostępne budynki:</h2>
            <div className="grid grid-cols-2 max-h-[400px] overflow-y-auto">
                <div className="w-full aspect-square relative border-t border-t-black border-l-black border-l border-t-black border-l-black border-b-black border-b-4">
                    <Image src="/game/ui/column.webp" alt="Kolumna" fill={true} />
                </div>
                <div className="w-full aspect-square relative border-t border-t-black border-l-black border-r border-t-black border-r-black border-b-black border-b-4">
                    <Image src="/game/ui/construction.png" alt="Budynek" fill={true} />
                </div>
                {
                    game.getRoundPhase() === "bonus" ? (
                        <>
                            {
                                game.getAvailableBonusBuildings().map((building, index) => (
                                    <React.Fragment key={index}>
                                        <div className="w-full aspect-square flex items-center justify-center border-b border-l bg-background">
                                            *
                                        </div>
                                        <div className="w-full aspect-square relative border-b border-r bg-background">
                                            {building && (
                                                <Image 
                                                    src={
                                                        building === "factory" ? "/game/building/factory.gif" :
                                                        building === "forest" ? "/game/building/forest.gif" :
                                                        building === "house" ? "/game/building/house.png" :
                                                        building === "lake" ? "/game/building/lake.gif" :
                                                        building === "plaza" ? "/game/building/plaza.png" :
                                                        ""
                                                    } 
                                                    alt="Building" 
                                                    fill={true} 
                                                />
                                            )}
                                        </div>
                                    </React.Fragment>
                                ))
                            }
                        </>
                    ) : (
                        <>
                            {
                                game.getRemainingPlacements().map((placement, index) => (
                                    <React.Fragment key={index}>
                                        <div className="w-full aspect-square flex items-center justify-center border-b border-l bg-background">
                                            {placement.column}
                                        </div>
                                        <div className="w-full aspect-square relative border-b border-r bg-background">
                                            {placement.building && (
                                                <Image 
                                                    src={
                                                        placement.building === "factory" ? "/game/building/factory.gif" :
                                                        placement.building === "forest" ? "/game/building/forest.gif" :
                                                        placement.building === "house" ? "/game/building/house.png" :
                                                        placement.building === "lake" ? "/game/building/lake.gif" :
                                                        placement.building === "plaza" ? "/game/building/plaza.png" :
                                                        ""
                                                    } 
                                                    alt="Building" 
                                                    fill={true} 
                                                />
                                            )}
                                        </div>
                                    </React.Fragment>
                                ))
                            }
                        </>
                    )
                }
                
            </div>
        </div>
        
        
    )
}

export default RemainingBuildings