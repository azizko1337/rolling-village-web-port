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

function GameState(props: Props){
    const { game } = props;

    return (
        <div className="flex flex-col gap-1 border p-5">
            <h1 className="w-full text-center font-bold text-lg">Runda: {game.getRound()}</h1>
            {game.getIsAwaitingPlayerAction()  && <h2>Oczekiwanie na Twój ruch</h2>}
            {game.getRoundPhase() === "bonus" && <h2>Postaw swój bonusowy budynek!</h2>}
            {game.getGamePhase() === "gameover" && <h2>Gra zakończona! Twój wynik końcowy to <b>{game.getPointsSummary()?.total} punkty</b>.</h2>}
        </div>
    )
}

export default GameState