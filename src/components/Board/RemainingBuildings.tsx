"use client";

import RollingVillage from "@/game/RollingVillage";
import Image from "next/image";

type Props = {
    game: RollingVillage
}

function RemainingBuildings(props: Props){
    const { game } = props;

    if(game.getGamePhase() === "gameover"){
        const pointsSummary = game.getPointsSummary();
        
        return (
            <div className="w-full max-w-[400px] shrink-0 h-[500px] lg:h-[600px] shadow-2xl relative transform -rotate-2 rounded-l-lg border-l-8 border-gray-300 flex flex-col notebook-open bg-white">
                <div className="absolute -left-7 top-0 bottom-0 w-10 flex flex-col justify-evenly z-10">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="w-8 h-3 bg-gray-600 rounded-full mb-2 ml-2 ring-1 ring-black"></div>
                    ))}
                </div>

                <div className="p-8 h-full flex flex-col font-['Patrick_Hand'] text-black">
                    <h2 className="text-4xl mb-6 border-b-2 border-gray-800 pb-2 text-center">Podsumowanie</h2>
                    
                    <div className="flex-grow flex flex-col items-center justify-center gap-8">
                        <div className="text-center">
                            <div className="text-7xl font-bold text-green-700 mb-2">{pointsSummary?.total}</div>
                            <div className="text-3xl text-gray-600">punktów</div>
                        </div>
                        
                        <div className="w-full space-y-4 text-2xl">
                            <div className="flex justify-between px-6 border-b border-gray-300 pb-2">
                                <span className="text-gray-600">Rundy:</span>
                                <span className="font-bold">{pointsSummary?.rounds}</span>
                            </div>
                            <div className="flex justify-between px-6 border-b border-gray-300 pb-2">
                                <span className="text-gray-600">Fabryki:</span>
                                <span className="font-bold">{pointsSummary?.factories}</span>
                            </div>
                            <div className="flex justify-between px-6 border-b border-gray-300 pb-2">
                                <span className="text-gray-600">Place:</span>
                                <span className="font-bold">{pointsSummary?.plazas}</span>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => game.reset()} 
                            className="menu-btn text-2xl py-3 border-4 hover:bg-green-50 mt-6"
                        >
                            Zagraj jeszcze raz
                        </button>
                    </div>
                    
                    <div className="mt-auto text-lg text-gray-500 text-center transform rotate-1">Gratulacje!</div>
                </div>
            </div>
        );
    }

    const buildingToImage = (building: Building | null) => {
        switch(building){
            case "factory": return "/game/building/factory.gif";
            case "forest": return "/game/building/forest.gif";
            case "house": return "/game/building/house.png";
            case "lake": return "/game/building/lake.gif";
            case "plaza": return "/game/building/plaza.png";
            default: return "";
        }
    };

    const buildingToName = (building: Building | null) => {
        switch(building){
            case "factory": return "Fabryka";
            case "forest": return "Las";
            case "house": return "Dom";
            case "lake": return "Jezioro";
            case "plaza": return "Plac";
            default: return "";
        }
    };

    return (
        <div className="w-full max-w-[400px] shrink-0 h-[400px] lg:h-[600px] shadow-2xl relative transform -rotate-2 rounded-l-lg border-l-8 border-gray-300 flex flex-col notebook-open bg-white">
            <div className="absolute -left-7 top-0 bottom-0 w-10 flex flex-col justify-evenly z-10">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-8 h-3 bg-gray-600 rounded-full mb-2 ml-2 ring-1 ring-black"></div>
                ))}
            </div>

            <div className="p-8 h-full flex flex-col font-['Patrick_Hand'] text-black overflow-auto">
                <h2 className="text-4xl mb-4 border-b-2 border-gray-800 pb-2 text-center">Budynki</h2>
                
                <div className="flex gap-2 border-b border-gray-400 pb-1 mb-4 text-gray-600 text-xl uppercase tracking-wide">
                    <span className="flex-1 text-center">Typ</span>
                    <span className="w-24 text-center">Ulica</span>
                </div>

                <div className="space-y-2 flex-grow overflow-y-auto">
                    {game.getRoundPhase() === "bonus" ? (
                        <>
                            <div className="text-center text-purple-600 font-bold mb-3 text-2xl">FAZA BONUSOWA!</div>
                            {game.getAvailableBonusBuildings().map((building, index) => (
                                <div key={index} className="flex items-center gap-2 w-full hover:bg-gray-50 p-1 rounded transition">
                                    <div className="flex-1 flex items-center justify-start gap-3 border border-gray-300 rounded p-2 bg-white shadow-sm shrink-0">
                                        {building && buildingToImage(building) && (
                                            <div className="w-10 h-10 relative">
                                                <Image 
                                                    src={buildingToImage(building)} 
                                                    alt={buildingToName(building)} 
                                                    fill={true}
                                                    className="object-contain"
                                                />
                                            </div>
                                        )}
                                        <span className="text-2xl leading-none">{buildingToName(building)}</span>
                                    </div>
                                    <div className="w-24 flex items-center justify-center text-xl text-purple-600 font-bold">★</div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <>
                            {(() => {
                                const buildingGroups = new Map<Building, number[]>();
                                game.getRemainingPlacements().forEach(placement => {
                                    if (placement.building) {
                                        if (!buildingGroups.has(placement.building)) {
                                            buildingGroups.set(placement.building, []);
                                        }
                                        buildingGroups.get(placement.building)!.push(placement.column);
                                    }
                                });

                                return Array.from(buildingGroups.entries()).map(([building, columns], index) => {
                                    const sortedColumns = [...new Set(columns)].sort((a, b) => a - b);
                                    const displayColumns = sortedColumns.length === 6 ? '*' : sortedColumns.join(', ');
                                    
                                    return (
                                        <div key={index} className="flex items-center gap-2 w-full hover:bg-gray-50 p-1 rounded transition">
                                            <div className="flex-1 flex items-center justify-start gap-3 border border-gray-300 rounded p-2 bg-white shadow-sm shrink-0">
                                                {buildingToImage(building) && (
                                                    <div className="w-10 h-10 relative">
                                                        <Image 
                                                            src={buildingToImage(building)} 
                                                            alt={buildingToName(building)} 
                                                            fill={true}
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                )}
                                                <span className="text-2xl leading-none">{buildingToName(building)}</span>
                                            </div>
                                            <div className="w-24 flex items-center justify-center text-2xl font-bold text-gray-700">{displayColumns}</div>
                                        </div>
                                    );
                                });
                            })()}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RemainingBuildings
