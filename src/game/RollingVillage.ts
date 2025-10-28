type Building = "house" | "forest" | "lake" | "factory" | "plaza" | null;
type GamePhase = "setup" | "main" | "gameover";
type RoundPhase = "build" | "bonus" | "calculate";


const MAP_POINTS = { // { position: points }
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

const MAP_ROWS = { // {dice sum: row index}
    3: 0,
    4: 0,
    5: 1,
    6: 1,
    7: 2,
    8: 3,
    9: 3,
    10: 4,
    11: 4
}

class RollingVillage {
    private ROW_WIDTH = 6;
    private ROWS = 5;
    private BOARD_SIZE = this.ROWS * this.ROW_WIDTH;

    private board: Array<Building> = Array(this.BOARD_SIZE).fill(null);
    private round: number = 0;
    private gamePhase: GamePhase = "setup";
    private roundPhase: RoundPhase = "build";
    private points: Record<number, number> = {}
    private diceRoll: DiceRoll = [1, 1];
    private isAwaitingPlayerAction: boolean = true;
    private isFirstBuildingPlaced: boolean = false;
    private isAwaitingDiceRoll: boolean = true;

    // playing api

    public tick(){
        if(!this.isReadyForTick()) return;

        if(this.gamePhase === "setup"){
            this.gamePhase = "main";
            this.isAwaitingDiceRoll = true;
            this.isAwaitingPlayerAction = true;
            this.round += 1;
        }else if(this.gamePhase === "main"){
            if(this.roundPhase === "build"){
                this.roundPhase = "bonus";
                if(this.round !== 0 && this.round%3 === 0){
                    this.isAwaitingDiceRoll = true;
                    this.isAwaitingPlayerAction = true;
                }
            } else if(this.roundPhase === "bonus"){
                this.roundPhase = "calculate";
            } else if(this.roundPhase === "calculate"){
                this.points[this.round] = this.calculatePoints();
                    this.round += 1;
                    this.roundPhase = "build";
                    this.isAwaitingPlayerAction = true;
                    this.isAwaitingDiceRoll = true;
                
                if(this.round > 9){
                    this.round = 9;
                    this.gamePhase = "gameover";
                    this.isAwaitingDiceRoll = false;
                    this.isAwaitingPlayerAction = false;
                }
            }
        }else if(this.gamePhase === "gameover"){
            
        }
    }

    public build(building: Building, position: number){
        console.log("build", building, position);
        if(!this.isAwaitingPlayerAction) return;
        if(this.roundPhase !== "build" && this.roundPhase !== "bonus") return;
        if(position < 0 || position >= this.BOARD_SIZE) return;

        this.board[position] = building;
        if(this.roundPhase === "bonus"){
            this.isAwaitingPlayerAction = false; 
        }else{
            if(this.isFirstBuildingPlaced){
                this.isFirstBuildingPlaced = false;
                this.isAwaitingPlayerAction = false;
            }else{
                this.isFirstBuildingPlaced = true;
            }
        }
        
    }

    public isReadyForTick(): boolean{
        return !this.isAwaitingPlayerAction && !this.isAwaitingDiceRoll;
    }

    public setRollDice(diceRoll: DiceRoll): void {
        if(!this.isAwaitingDiceRoll) return;

        this.diceRoll = diceRoll;
        this.isAwaitingDiceRoll = false;
    }

    // getters

    public getIsAwaitingPlayerAction(): boolean {
        return this.isAwaitingPlayerAction;
    }
    
    public getIsAwaitingDiceRoll(): boolean {
        return this.isAwaitingDiceRoll;
    }

    public getIsGameOver(): boolean {
        return this.gamePhase === "gameover";
    }

    public getBoard(): Array<Building> {
        return this.board;
    }

    public getRound(): number {
        return this.round;
    }

    public getGamePhase(): GamePhase {
        return this.gamePhase;
    }

    public getRoundPhase(): RoundPhase {
        return this.roundPhase;
    }

    public getPoints(): Record<number, number> {
        return this.points;
    }

    public getDiceRoll(): DiceRoll {
        return this.diceRoll;
    }
    
    // internal utils

    private calculatePoints(): number {
        let points = 0;

        for(const position of Object.keys(this.board)){
            const building = this.board[parseInt(position)];
            const row = MAP_ROWS[(this.diceRoll[0] + this.diceRoll[1]) as keyof typeof MAP_ROWS];
            if(building && this.isBuildingConnectedToRow(parseInt(position), building, row)){
                points += MAP_POINTS[parseInt(position) as keyof typeof MAP_POINTS] || 0;
            }
        }
        
        return points;
    }

    private isBuildingConnectedToRow(position: number, building: Building, row: number, _alreadyCheckedPositions: number[] = []): boolean{
        if(_alreadyCheckedPositions.includes(position)) return false;
        if(this.board[position] !== building) return false;

        if(Math.floor(position/this.ROW_WIDTH) === row) return true;

        const isColEdgeLeft = (pos: number): boolean => {
            return pos % this.ROW_WIDTH === 0
        }
        const isColEdgeRight = (pos: number): boolean => {
            if(pos + 1 > this.BOARD_SIZE) return true;
            return (pos + 1) % this.ROW_WIDTH === 0
        }
        const isColEdgeTop = (pos: number): boolean => {
            return pos - this.ROW_WIDTH < 0
        }
        const isColEdgeBottom = (pos: number): boolean => {
            return pos + this.ROW_WIDTH > this.BOARD_SIZE
        }

        return (
            (isColEdgeTop(position) ? false : this.isBuildingConnectedToRow(position - this.ROW_WIDTH, building, row, [..._alreadyCheckedPositions, position])) ||
            (isColEdgeBottom(position) ? false : this.isBuildingConnectedToRow(position + this.ROW_WIDTH, building, row, [..._alreadyCheckedPositions, position])) ||
            (isColEdgeLeft(position) ? false : this.isBuildingConnectedToRow(position - 1, building, row, [..._alreadyCheckedPositions, position])) ||
            (isColEdgeRight(position) ? false : this.isBuildingConnectedToRow(position + 1, building, row, [..._alreadyCheckedPositions, position]))
        )
    }
}

export default RollingVillage;
