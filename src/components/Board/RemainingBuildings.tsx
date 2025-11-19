"use client";

import RollingVillage from "@/game/RollingVillage";
import Image from "next/image";
import React from "react";

type Props = {
    game: RollingVillage
}

function RemainingBuildings(props: Props){
    const { game } = props;

    if(game.getGamePhase() === "gameover"){
        return null;
    }

    const renderBuildingImage = (building: Building | null) => {
        if (!building) return null;
        const map = {
            factory: "/game/building/factory.gif",
            forest: "/game/building/forest.gif",
            house: "/game/building/house.png",
            lake: "/game/building/lake.gif",
            plaza: "/game/building/plaza.png",
        } as const;

        return (
            <Image
                src={map[building]}
                alt={`Budynek ${building}`}
                fill
                className="object-contain p-1"
            />
        );
    };

    const rows = game.getRoundPhase() === "bonus"
        ? game.getAvailableBonusBuildings().map(building => ({ label: "Bonus", building }))
        : game.getRemainingPlacements().map(placement => ({ label: `Kol. ${placement.column}`, building: placement.building }));

    return (
        <div className="w-full self-stretch rounded-[1.75rem] border-4 border-white/25 bg-gradient-to-b from-white/70 to-white/55 p-4 shadow-[0_30px_45px_rgba(19,37,22,0.2)]">
            <h2 className="parchment-title text-center text-[0.7rem] tracking-[0.4em]">Dostępne budynki</h2>
            <div className="mt-4 flex flex-col gap-3 overflow-y-auto pr-1 sm:pr-2 lg:max-h-[320px] xl:max-h-[420px]">
                {rows.map((row, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3 rounded-2xl border border-foreground/10 bg-white/70 p-3 shadow-[0_12px_18px_rgba(22,33,20,0.18)]"
                    >
                        <span className="flex h-12 w-16 items-center justify-center rounded-xl border-2 border-white/70 bg-gradient-to-b from-[rgba(255,255,255,0.8)] to-[rgba(255,255,255,0.5)] text-xs font-semibold uppercase tracking-[0.25em] text-foreground/70">
                            {row.label}
                        </span>
                        <div className="relative h-12 w-20">
                            {renderBuildingImage(row.building ?? null) || (
                                <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-foreground/30">
                                    -
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RemainingBuildings