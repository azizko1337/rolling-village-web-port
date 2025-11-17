"use client";

import Cell from "@/components/Building/Cell";
import BuildingComponent from "@/components/Building/Cell";
import RollingVillage from "@/game/RollingVillage";
import Image from "next/image";
import { useEffect, useState, useReducer } from "react";
import Board from "@/components/Board/Board";
import Score from "@/components/Score/Score";
import Dice from "@/game/Dice";

function Game() {
    const [, forceRerender] = useReducer(x => x + 1, 0);
    const [game, setGame] = useState(new RollingVillage());

    useEffect(() => {
        const interval = setInterval(() => {
            game.tick();
            if(game.getIsAwaitingDiceRoll()){
                game.setRollDice([1, 4]); // For testing purposes, fixed dice roll
            }
            forceRerender();
        }, 3000);
        return () => clearInterval(interval);
      }, []);

  const buildingNameMap: Record<string, string> = {
    house: "Dom",
    forest: "Las",
    lake: "Jezioro",
    factory: "Fabryka",
    plaza: "Plac"
  };

  const getRemainingPlacementsText = () => {
    if (game.getRoundPhase() === "bonus") {
      const available = game.getAvailableBonusBuildings();
      if (available.length === 0) return "Brak dostępnych bonusów";
      return `Bonus: ${available.filter(b => b).map(b => buildingNameMap[b!]).join(", ")}`;
    }

    const remaining = game.getRemainingPlacements();
    if (remaining.length === 0) return "Brak budynków do postawienia";
    const plazas = remaining.filter(p => p.building === "plaza");
    const others = remaining.filter(p => p.building && p.building !== "plaza");
    
    const parts: string[] = [];
    
    others.forEach(p => {
      parts.push(`${buildingNameMap[p.building!]} → ${p.column}`);
    });
    
    if (plazas.length > 0) {
      parts.push("Plac (dowolne pole)");
    }
    
    return parts.join(" | ");
  };

  return (
    <div className="">
        <h1>Rolling Village</h1>
        <h3>Faza gry: {game.getGamePhase()}</h3>
        <h3>Faza rundy: {game.getRoundPhase()}</h3>
        <h3>Stan kostki: {game.getDiceRoll().join(", ")}</h3>
        <h3>Pozostałe budynki: {getRemainingPlacementsText()}</h3>
        <h3>Runda: {game.getRound()}</h3>
        <Board game={game}/>
        <Score game={game}/>
    </div>
  );
}

export default Game