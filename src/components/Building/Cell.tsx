
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

type Props = {
    building: Building
    position: number
    allowedBuildings: Building[]
    onBuild: (building: Building, position: number) => void
    isBonusPhase?: boolean
}

const MAP_POINTS = {
    0: 3,
    2: 2,
    3: 2,
    5: 3,
    7: 1,
    10: 1,
    12: 2,
    14: 1,
    15: 1,
    17: 2,
    19: 1,
    22: 1,
    24: 3,
    26: 2,
    27: 2,
    29: 3,
}

function Cell (props: Props) {
    const [showMenu, setShowMenu] = useState(false);

    function handleClick(){
        const uniqueBuildings = Array.from(new Set(props.allowedBuildings));
        
        if (props.isBonusPhase && uniqueBuildings.length > 0) {
            setShowMenu(true);
            return;
        }
        
        if (uniqueBuildings.length === 1 && uniqueBuildings[0]) {
            props.onBuild(uniqueBuildings[0], props.position);
        } else if (uniqueBuildings.length > 1) {
            setShowMenu(true);
        }
    }

    function handleBuildingSelect(building: Building){
        props.onBuild(building, props.position);
        setShowMenu(false);
    }

    function buildingToImage(building: Building){
        switch(building){
            case "factory":
                return "/game/building/factory.gif";
            case "forest":
                return "/game/building/forest.gif";
            case "house":
                return "/game/building/house.png";
            case "lake":
                return "/game/building/lake.gif";
            case "plaza":
                return "/game/building/plaza.png";
            default:
                return null;
        }
    }

    const isBuildingAllowed = props.allowedBuildings.filter(building => building).length > 0 && !props.building;

    return (
        <div
            className={clsx(
                "relative aspect-square rounded-xl border-2 border-white/15 bg-[rgba(255,255,255,0.08)] shadow-[inset_0_0_18px_rgba(0,0,0,0.2)] backdrop-blur-sm transition-all duration-300",
                isBuildingAllowed && "tile-highlight"
            )}
        >
            <button
                className={clsx(
                    "tile-button group h-full w-full overflow-hidden",
                    isBuildingAllowed && "cursor-pointer"
                )}
                disabled={!isBuildingAllowed}
                onClick={handleClick}
            >
                {props.building && (
                    <Image
                        src={buildingToImage(props.building)!}
                        alt="Building"
                        fill={true}
                        className="object-contain p-1 drop-shadow-[0_12px_15px_rgba(0,0,0,0.4)]"
                    />
                )}
                {!props.building && (
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold tracking-[0.25em] text-white/40">
                        ·
                    </span>
                )}
                {isBuildingAllowed && (
                    <span className="pointer-events-none absolute inset-0 rounded-lg border-2 border-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                )}
            </button>
            {
                showMenu && (
                    <>
                        <menu className="absolute top-1/2 left-1/2 z-[20] w-60 -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-foreground/10 bg-card/95 p-4 text-sm shadow-xl">
                            <h3 className="parchment-title mb-3 text-center text-[0.7rem] tracking-[0.4em]">Wybierz budynek</h3>
                            <div className="flex flex-wrap justify-center gap-3">
                                {
                                    Array.from(new Set(props.allowedBuildings)).map((building, index) => (
                                        <button 
                                            key={`select-building-${index}`} 
                                            className="relative h-16 w-16 rounded-xl border-2 border-foreground/15 bg-white/70 p-2 shadow-[0_10px_15px_rgba(35,62,29,0.2)] transition-all hover:-translate-y-1 hover:bg-white"
                                            onClick={() => handleBuildingSelect(building)}
                                        >
                                            {buildingToImage(building) && (
                                                <Image 
                                                    src={buildingToImage(building)!} 
                                                    alt={building || "empty"}
                                                    fill={true} 
                                                    className="object-contain p-1"
                                                />
                                            )}
                                        </button>
                                    ))
                                }
                            </div>
                        </menu>
                        <div className="fixed w-screen h-screen top-0 left-0 z-10" onClick={() => setShowMenu(false)}></div>
                    </>
                )
            }
            {
                MAP_POINTS[props.position as keyof typeof MAP_POINTS] && (
                    <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white/60 bg-gradient-to-b from-white/90 to-white/60 text-[0.65rem] font-black text-foreground shadow-md">
                        {MAP_POINTS[props.position as keyof typeof MAP_POINTS]}
                    </div>
                )
            }
        </div>
        
    )
}

export default Cell;