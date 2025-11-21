
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
        <div className={clsx(
            "relative aspect-[1] border-2 border-dashed border-gray-300 bg-white/70 transition-all", 
            isBuildingAllowed && "border-yellow-400 bg-yellow-100/50 cursor-pointer hover:bg-yellow-200/70 hover:border-yellow-500"
        )}>
            <button 
                className={clsx("w-full h-full relative", isBuildingAllowed && "cursor-pointer")}
                disabled={!isBuildingAllowed}
                onClick={handleClick}
            >
                {props.building && (
                    <Image src={buildingToImage(props.building)!} alt="Building" fill={true} className="p-1" />
                )}
            </button>
            {
                showMenu && (
                    <>
                        <menu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[20] bg-white border-2 border-gray-800 p-3 rounded-lg shadow-2xl">
                            <h3 className="w-full text-center text-sm mb-2 font-['Patrick_Hand'] text-xl">Wybierz budynek</h3>
                            <div className="flex gap-2">
                                {
                                    Array.from(new Set(props.allowedBuildings)).map((building, index) => (
                                        <button 
                                            key={`select-building-${index}`} 
                                            className="relative w-16 h-16 p-2 border-2 border-gray-300 rounded cursor-pointer hover:bg-gray-100 hover:border-gray-500 transition"
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
                    <div className="absolute top-1 right-1 w-6 h-6 bg-white border-2 border-gray-800 rounded-full flex items-center justify-center text-xs font-bold">
                        {MAP_POINTS[props.position as keyof typeof MAP_POINTS]}
                    </div>
                )
            }
        </div>
    )
}

export default Cell;