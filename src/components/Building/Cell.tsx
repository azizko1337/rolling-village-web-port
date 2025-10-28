
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

type Props = {
    building: Building
    position: number
    allowedBuildings: Building[]
    onBuild: (building: Building, position: number) => void
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
    const [showBuildingMenu, setShowBuildingMenu] = useState(false);

    function handleClick(){
        setShowBuildingMenu(!showBuildingMenu);
    }

    function handleBuild(building: Building){
        props.onBuild(building, props.position);
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
        <div className="relative aspect-[1] border bg-background">
            <button 
                className={clsx("w-full h-full relative", isBuildingAllowed && "cursor-pointer hover:bg-gray-200")}
                disabled={!isBuildingAllowed}
                onClick={handleClick}
            >
                {props.building && (
                    <Image src={buildingToImage(props.building)!} alt="Building" fill={true} />
                )}
            </button>
            {
                showBuildingMenu && (
                    <>
                        <menu className="absolute top-1/2 left-1/2 -translate-x-1/2 z-[20] bg-card border p-2 rounded-lg">
                            <h3 className="w-full text-center text-md">Wybierz budynek</h3>
                            <div className="w-full h-full flex">
                                {
                                    props.allowedBuildings.map((building, index) => (
                                        <button key={`select-building-${index}`} 
                                                className="relative w-26 p-2 border aspect-square z-20 cursor-pointer"
                                                onClick={() => handleBuild(building)}
                                        >
                                            {
                                                buildingToImage(building) && (
                                                    <Image src={buildingToImage(building)!} 
                                                    alt={building || "empty"}
                                                    fill={true} 
                                                    className="object-contain"/>
                                                )
                                            }
                                            
                                        </button>
                                    ))
                                }
                            </div>
                            
                        </menu>
                        <div className="fixed w-screen h-screen top-0 left-0 z-10" onClick={() => setShowBuildingMenu(false)}></div>   
                    </>
                )
            }
            {
                MAP_POINTS[props.position!]! && (
                    <div className="absolute top-1 right-1 w-6 h-6 bg-white border rounded-full flex items-center justify-center text-xs font-bold">
                        {MAP_POINTS[props.position!]! as number}
                    </div>
                )
            }
        </div>
        
    )
}

export default Cell;