
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

type Props = {
    building: Building
    position: number
    allowedBuildings: Building[]
    onBuild: (building: Building, position: number) => void
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

    const isBuildingAllowed = props.allowedBuildings.filter(building => building).length > 0;

    return (
        <div className="relative aspect-[1] border bg-background">
            <button 
                className={clsx("w-full h-full relative", isBuildingAllowed && "cursor-pointer hover:bg-gray-200")}
                disabled={!isBuildingAllowed}
                onClick={handleClick}
            >
                {props.building && (
                    <Image src="/public/game/building/forest.gif" alt="Building" fill={true} />
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
        </div>
        
    )
}

export default Cell;