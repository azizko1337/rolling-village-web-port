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

    if(game.getGamePhase() === "gameover"){
        return null;
    }

    return (
        <div className="h-full bg-card p-4 rounded-xl shadow-lg border-2 border-border">
            <h2 className="h-10 flex items-center justify-center font-bold text-lg text-primary mb-2">Dostępne budynki</h2>
            <div className="grid grid-cols-2 max-h-[400px] overflow-y-auto gap-2 p-2 bg-background/50 rounded-lg">
                <div className="w-full aspect-square relative bg-background rounded-lg border-2 border-border shadow-sm overflow-hidden">
                    <Image src="/game/ui/column.webp" alt="Kolumna" fill={true} className="object-contain p-2" />
                </div>
                <div className="w-full aspect-square relative bg-background rounded-lg border-2 border-border shadow-sm overflow-hidden">
                    <Image src="/game/ui/construction.png" alt="Budynek" fill={true} className="object-contain p-2" />
                </div>
                {
                    game.getRoundPhase() === "bonus" ? (
                        <>
                            {
                                game.getAvailableBonusBuildings().map((building, index) => (
                                    <React.Fragment key={index}>
                                        <div className="w-full aspect-square flex items-center justify-center bg-accent/20 rounded-lg border-2 border-dashed border-primary/50 text-primary font-bold text-xl">
                                            *
                                        </div>
                                        <div className="w-full aspect-square relative bg-background rounded-lg border-2 border-primary shadow-md overflow-hidden animate-pulse-slow">
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
                                                    alt="Budynek" 
                                                    fill={true} 
                                                    className="object-contain p-2"
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
                                        <div className="w-full aspect-square flex items-center justify-center bg-background rounded-lg border-2 border-border shadow-sm font-bold text-foreground/80">
                                            {placement.column}
                                        </div>
                                        <div className="w-full aspect-square relative bg-background rounded-lg border-2 border-border shadow-sm overflow-hidden hover:scale-105 transition-transform duration-200">
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
                                                    alt="Budynek" 
                                                    fill={true} 
                                                    className="object-contain p-2"
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