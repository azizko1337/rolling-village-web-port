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

const NUMBER_OF_ROUNDS = 9;

function Score(props: Props){
    const [, forceRerender] = useReducer(x => x + 1, 0);
    const { game } = props;


    const pointsSummary = game.getPointsSummary();

    return (
        <div>
            <div className="grid grid-cols-9 w-full max-w-[512px] border">
                {
                    new Array(NUMBER_OF_ROUNDS).fill(null).map((_, index) => (
                        <div key={`score-round-${index}-header`} className="aspect-square border flex items-center justify-center">
                            {index+1}
                        </div>
                    ))
                }
                {
                    Object.values(game.getPoints()).map((value, index) => (
                        <div key={`score-round-${index}`} className="aspect-square border flex items-center justify-center">
                            {value}
                        </div>
                    ))
                }
                {
                    (new Array(NUMBER_OF_ROUNDS - Object.values(game.getPoints()).length).fill(null)).map((_, index) => (
                        <div key={`score-round-${index}`} className="aspect-square border flex items-center justify-center">
                            -
                        </div>
                    ))
                }
            </div>
            {pointsSummary && (
                <div>
                    <div>Punkty z rund: {pointsSummary.rounds}</div>
                    <div>Punkty z fabryk: {pointsSummary.factories}</div>
                    <div>Punkty z placów: {pointsSummary.plazas}</div>
                    <div className="font-bold">Suma punktów: {pointsSummary.total}</div>
                </div>
            )}
        </div>
        
    )
}

export default Score