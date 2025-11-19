
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
            "relative aspect-[1] border-2 border-border/50 bg-card rounded-lg shadow-sm transition-all duration-300",
            isBuildingAllowed && "bg-accent/50 cursor-pointer hover:bg-accent hover:scale-105 hover:shadow-md hover:border-primary/50 animate-pulse-slow"
        )}>
            <button 
                className={clsx("w-full h-full relative rounded-lg overflow-hidden", isBuildingAllowed && "cursor-pointer")}
                disabled={!isBuildingAllowed}
                onClick={handleClick}
            >
                {props.building && (
                    <div className="animate-in zoom-in duration-300 w-full h-full relative">
                        <Image src={buildingToImage(props.building)!} alt="Building" fill={true} className="object-contain p-1 drop-shadow-sm" />
                    </div>
                )}
            </button>
            {
                showMenu && (
                    <>
                        <menu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[20] bg-popover border-2 border-primary p-3 rounded-xl shadow-xl animate-in fade-in zoom-in duration-200">
                            <h3 className="w-full text-center text-sm font-bold mb-2 text-foreground">Wybierz budynek</h3>
                            <div className="flex gap-2">
                                {
                                    Array.from(new Set(props.allowedBuildings)).map((building, index) => (
                                        <button 
                                            key={`select-building-${index}`} 
                                            className="relative w-16 h-16 p-2 border-2 border-transparent hover:border-primary rounded-lg cursor-pointer hover:bg-accent transition-colors"
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
                        <div className="fixed w-screen h-screen top-0 left-0 z-10 bg-black/20 backdrop-blur-[1px]" onClick={() => setShowMenu(false)}></div>
                    </>
                )
            }
            {
                MAP_POINTS[props.position as keyof typeof MAP_POINTS] && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary text-secondary-foreground border-2 border-border rounded-full flex items-center justify-center text-xs font-bold shadow-sm z-10">
                        {MAP_POINTS[props.position as keyof typeof MAP_POINTS]}
                    </div>
                )
            }
        </div>
        
    )
}

export default Cell;