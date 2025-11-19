
import clsx from "clsx";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import SelectBuildingMenu from "./SelectBuildingMenu";

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
    const selectableBuildings = useMemo(
        () => Array.from(new Set(props.allowedBuildings.filter((building): building is Exclude<Building, null> => Boolean(building)))),
        [props.allowedBuildings]
    );

    function handleClick(){
        if (props.isBonusPhase && selectableBuildings.length > 0) {
            setShowMenu(true);
            return;
        }
        
        if (selectableBuildings.length === 1 && selectableBuildings[0]) {
            props.onBuild(selectableBuildings[0], props.position);
        } else if (selectableBuildings.length > 1) {
            setShowMenu(true);
        }
    }

    function handleBuildingSelect(building: Exclude<Building, null>){
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

    const isBuildingAllowed = selectableBuildings.length > 0 && !props.building;
    const singleSelectableBuilding = selectableBuildings.length === 1 ? selectableBuildings[0] : null;
    const hasMultipleOptions = selectableBuildings.length > 1;
    const previewImage = singleSelectableBuilding ? buildingToImage(singleSelectableBuilding) : null;

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
                {isBuildingAllowed && previewImage && (
                    <Image
                        src={previewImage}
                        alt="Preview building"
                        fill={true}
                        className="pointer-events-none object-contain p-1 opacity-0 transition-opacity duration-200 group-hover:opacity-60"
                    />
                )}
                {isBuildingAllowed && hasMultipleOptions && (
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-white/70 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <MoreHorizontal className="h-6 w-6" aria-hidden={true} />
                    </span>
                )}
                {isBuildingAllowed && (
                    <span className="pointer-events-none absolute inset-0 rounded-lg border-2 border-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                )}
            </button>
            {
                showMenu && (
                    <SelectBuildingMenu 
                        allowedBuildings={selectableBuildings}
                        onSelect={handleBuildingSelect}
                        onClose={() => setShowMenu(false)}
                        buildingToImage={buildingToImage}
                    />
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