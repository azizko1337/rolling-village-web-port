"use client";

import Cell from "@/components/Building/Cell";
import BuildingComponent from "@/components/Building/Cell";
import RollingVillage from "@/game/RollingVillage";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useReducer } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {RotateCcw, ListCollapse, List} from "lucide-react"

type Props = {
    game: RollingVillage
}

const NUMBER_OF_ROUNDS = 9;

function Score(props: Props){
    const [, forceRerender] = useReducer(x => x + 1, 0);
    const { game } = props;


    const pointsSummary = game.getPointsSummary();

    return (
        <div className="w-full flex-col flex items-center">
            <div className="grid grid-cols-9 w-full max-w-[512px] border">
                {
                    new Array(NUMBER_OF_ROUNDS).fill(null).map((_, index) => (
                        <div key={`score-round-${index}-header`} className="aspect-square border flex items-center justify-center">
                            {index+1}
                        </div>
                    ))
                }
                {
                    Object.values(game.getPoints()).map((value, index) => (
                        <div key={`score-round-${index}`} className="aspect-square border flex items-center justify-center">
                            {value}
                        </div>
                    ))
                }
                {
                    (new Array(NUMBER_OF_ROUNDS - Object.values(game.getPoints()).length).fill(null)).map((_, index) => (
                        <div key={`score-round-${index}`} className="aspect-square border flex items-center justify-center">
                            -
                        </div>
                    ))
                }
            </div>
            {pointsSummary && (
                <div className="flex gap-2 items-center">
                    <Dialog>
                        <DialogTrigger asChild className="my-4">
                            <Button variant="outline"><ListCollapse size={10}/> Szczegóły wyniku ({pointsSummary.total} pkt)</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="text-xl">Szczegóły wyniku</DialogTitle>
                                <DialogDescription className="mt-4 text-lg">
                                    <span><b>Punkty z rund:</b> {pointsSummary.rounds}</span><br/>
                                    <span><b>Punkty z fabryk:</b> {pointsSummary.factories}</span><br/>
                                    <span><b>Punkty z placów:</b> {pointsSummary.plazas}</span><br/>
                                    <span className="font-bold border-t border-t-2 mt-5 block">Suma punktów: {pointsSummary.total}</span><br/>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                    <Button variant="outline" onClick={() => game.reset()}>
                        <RotateCcw size={10}/> Graj od nowa
                    </Button>
                </div>
            )}
        </div>
        
    )
}

export default Score