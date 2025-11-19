"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
    allowedBuildings: Building[];
    onSelect: (building: Exclude<Building, null>) => void;
    onClose: () => void;
    buildingToImage: (building: Building) => string | null;
};

function SelectBuildingMenu(props: Props) {
    const { allowedBuildings, onSelect, onClose, buildingToImage } = props;
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const availableBuildings = useMemo(
        () => Array.from(new Set(allowedBuildings.filter((building): building is Exclude<Building, null> => Boolean(building)))),
        [allowedBuildings]
    );

    if (!isMounted || availableBuildings.length === 0) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <button
                type="button"
                aria-label="Zamknij wybór budynku"
                className="absolute inset-0 bg-foreground/20 backdrop-blur-[1px]"
                onClick={onClose}
            />
            <menu className="relative z-10 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border-2 border-foreground/10 bg-card/95 p-4 text-sm shadow-[0_30px_70px_rgba(28,45,30,0.45)]">
                <h3 className="parchment-title mb-3 text-center text-[0.7rem] tracking-[0.4em]">Wybierz budynek</h3>
                <div className="flex flex-wrap justify-center gap-3">
                    {availableBuildings.map((building, index) => (
                        <button
                            key={`select-building-${index}`}
                            className="relative h-16 w-16 rounded-xl border-2 border-foreground/15 bg-white/80 p-2 shadow-[0_12px_18px_rgba(35,62,29,0.25)] transition-all hover:-translate-y-1 hover:bg-white"
                            onClick={() => onSelect(building)}
                        >
                            {buildingToImage(building) && (
                                <Image
                                    src={buildingToImage(building)!}
                                    alt={building}
                                    fill={true}
                                    className="object-contain p-1"
                                />
                            )}
                        </button>
                    ))}
                </div>
            </menu>
        </div>,
        document.body
    );
}

export default SelectBuildingMenu;