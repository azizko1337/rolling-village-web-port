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
        <div className="w-full flex-col flex items-center bg-card p-4 rounded-xl shadow-lg border-2 border-border mt-4">
            <h3 className="w-full text-center font-bold text-lg text-primary mb-2">Punktacja</h3>
            <div className="grid grid-cols-9 w-full max-w-[512px] gap-1 p-2 bg-background/50 rounded-lg border border-border/30">
                {
                    new Array(NUMBER_OF_ROUNDS).fill(null).map((_, index) => (
                        <div key={`score-round-${index}-header`} className="aspect-square flex items-center justify-center bg-secondary text-secondary-foreground rounded-md shadow-sm font-bold text-sm">
                            {index+1}
                        </div>
                    ))
                }
                {
                    Object.values(game.getPoints()).map((value, index) => (
                        <div key={`score-round-${index}`} className="aspect-square flex items-center justify-center bg-background rounded-md border border-border/50 shadow-sm text-sm font-medium">
                            {value}
                        </div>
                    ))
                }
                {
                    (new Array(NUMBER_OF_ROUNDS - Object.values(game.getPoints()).length).fill(null)).map((_, index) => (
                        <div key={`score-round-${index}`} className="aspect-square flex items-center justify-center bg-muted/20 rounded-md border border-border/10 text-muted-foreground">
                            -
                        </div>
                    ))
                }
            </div>
            {pointsSummary && (
                <div className="flex gap-2 items-center mt-4">
                    <Dialog>
                        <DialogTrigger asChild className="my-4">
                            <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                                <ListCollapse size={16}/> Szczegóły wyniku ({pointsSummary.total} pkt)
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card border-2 border-border shadow-2xl rounded-xl">
                            <DialogHeader>
                                <DialogTitle className="text-primary text-xl">Szczegóły wyniku</DialogTitle>
                                <DialogDescription className="mt-4 text-lg text-foreground/80">
                                    <div className="space-y-2">
                                        <div className="flex justify-between border-b border-border/30 pb-1"><span>Punkty z rund:</span> <span className="font-bold">{pointsSummary.rounds}</span></div>
                                        <div className="flex justify-between border-b border-border/30 pb-1"><span>Punkty z fabryk:</span> <span className="font-bold">{pointsSummary.factories}</span></div>
                                        <div className="flex justify-between border-b border-border/30 pb-1"><span>Punkty z placów:</span> <span className="font-bold">{pointsSummary.plazas}</span></div>
                                        <div className="flex justify-between pt-2 text-primary font-bold text-xl"><span>Suma punktów:</span> <span>{pointsSummary.total}</span></div>
                                    </div>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                    <Button variant="outline" onClick={() => game.reset()} className="gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors">
                        <RotateCcw size={16}/> Graj od nowa
                    </Button>
                </div>
            )}
        </div>
        
    )
}

export default Score