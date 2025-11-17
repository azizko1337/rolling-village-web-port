type Building = "house" | "forest" | "lake" | "factory" | "plaza" | null;
type GamePhase = "setup" | "main" | "gameover";
type RoundPhase = "build" | "bonus" | "calculate";

type BuildingPlacement = {
    building: Building;
    column: number;
}

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
    private allowedPlacements: BuildingPlacement[] = [];
    private remainingPlacements: BuildingPlacement[] = [];
    private usedBonusBuildings: Set<Building> = new Set();

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
        if(!this.isAwaitingPlayerAction) return;
        if(this.roundPhase !== "build" && this.roundPhase !== "bonus") return;
        if(position < 0 || position >= this.BOARD_SIZE) return;
        if(this.board[position] !== null) {
            console.log("Cell already occupied");
            return;
        }
        
        if(this.roundPhase === "bonus") {
            if(building && this.usedBonusBuildings.has(building)) {
                console.log("This bonus building was already used");
                return;
            }
            
            this.board[position] = building;
            if(building) {
                this.usedBonusBuildings.add(building);
            }
            this.isAwaitingPlayerAction = false;
            return;
        }
        
        const column = (position % this.ROW_WIDTH) + 1;
        
        const placementIndex = this.remainingPlacements.findIndex(
            p => p.building === building && p.column === column
        );
        
        if(placementIndex === -1) {
            console.log("Placement not allowed - must use remaining placements");
            return;
        }

        this.board[position] = building;
        if(building === "plaza") {
            this.remainingPlacements = this.remainingPlacements.filter(p => p.building !== building);
        } else {
            if(this.gamePhase === "setup"){
                if(this.diceRoll[0] === this.diceRoll[1]){
                    this.remainingPlacements = this.remainingPlacements.filter(p => (p.building !== building))
                }else{
                    this.remainingPlacements = this.remainingPlacements.filter(p => (p.building !== building && p.column !== column));
                }
            }else{
                this.remainingPlacements = this.remainingPlacements.filter(p => (p.building !== building || p.column !== column));
            }
        }
        
        if(this.remainingPlacements.length === 0) {
            this.isAwaitingPlayerAction = false;
            this.isFirstBuildingPlaced = false;
        } else {
            this.isFirstBuildingPlaced = true;
        }
    }

    public isReadyForTick(): boolean{
        return !this.isAwaitingPlayerAction && !this.isAwaitingDiceRoll;
    }

    public setRollDice(diceRoll: DiceRoll): void {
        if(!this.isAwaitingDiceRoll) return;

        this.diceRoll = diceRoll;
        this.isAwaitingDiceRoll = false;
        this.allowedPlacements = this.calculateAllowedPlacements(diceRoll);
        this.remainingPlacements = [...this.allowedPlacements];
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

    public getAllowedPlacements(): BuildingPlacement[] {
        return this.allowedPlacements;
    }

    public getRemainingPlacements(): BuildingPlacement[] {
        return this.remainingPlacements;
    }

    public isPlacementAllowed(building: Building, position: number): boolean {
        const column = (position % this.ROW_WIDTH) + 1; // Convert position to column (1-6)
        return this.remainingPlacements.some(
            placement => placement.building === building && placement.column === column
        );
    }

    public getAvailableBonusBuildings(): Building[] {
        const allBuildings: Building[] = ["house", "forest", "lake"];
        return allBuildings.filter(b => !this.usedBonusBuildings.has(b));
    }
    
    private diceValueToBuilding(value: DiceValue): Building {
        if (value === 1 || value === 4) return "house";
        if (value === 2 || value === 5) return "forest";
        return "lake";
    }

    private getEmptyCellsInColumn(column: number): number {
        let count = 0;
        for (let row = 0; row < this.ROWS; row++) {
            const position = row * this.ROW_WIDTH + (column - 1);
            if (this.board[position] === null) {
                count++;
            }
        }
        return count;
    }

    private findAlternativeColumns(targetColumn: number): number[] {
        const emptyCells = this.getEmptyCellsInColumn(targetColumn);
        
        if (emptyCells > 0) {
            return [targetColumn];
        }

        //Full column?
        const leftColumn = targetColumn - 1;
        const rightColumn = targetColumn + 1;

        const leftEmpty = (leftColumn >= 1) ? this.getEmptyCellsInColumn(leftColumn) : -1;
        const rightEmpty = (rightColumn <= 6) ? this.getEmptyCellsInColumn(rightColumn) : -1;

        if (leftEmpty <= 0 && rightEmpty <= 0) {
            return [];
        }

        if (leftEmpty > 0 && rightEmpty <= 0) {
            return [leftColumn];
        }

        if (rightEmpty > 0 && leftEmpty <= 0) {
            return [rightColumn];
        }

        if (leftEmpty > rightEmpty) {
            return [leftColumn];
        } else if (rightEmpty > leftEmpty) {
            return [rightColumn];
        } else {
            return [leftColumn, rightColumn];
        }
    }

    private calculateAllowedPlacements(diceRoll: DiceRoll): BuildingPlacement[] {
        const [dice1, dice2] = diceRoll;
        
        const building1 = this.diceValueToBuilding(dice1);
        const targetColumn1 = dice2;
        const alternativeColumns1 = this.findAlternativeColumns(targetColumn1);
        
        let placements1: BuildingPlacement[] = [];
        if(this.gamePhase === "setup"){
            for(const building of ["house", "forest", "lake"] as Building[]){
                const allowedPlacementsForCurrentBuilding = alternativeColumns1.map(col => ({
                    building: building,
                    column: col
                }))
                placements1.push(...allowedPlacementsForCurrentBuilding);
            }
        }else{
            placements1 = alternativeColumns1.map(col => ({
                building: building1,
                column: col
            }));
        }
        

        const building2 = this.diceValueToBuilding(dice2);
        const targetColumn2 = dice1;
        const alternativeColumns2 = this.findAlternativeColumns(targetColumn2);
        
        let placements2: BuildingPlacement[] = [];
        if(this.gamePhase === "setup"){
            if(this.diceRoll[0] !== this.diceRoll[1]){
                for(const building of ["house", "forest", "lake"] as Building[]){
                    const allowedPlacementsForCurrentBuilding = alternativeColumns2.map(col => ({
                        building: building,
                        column: col
                    }))
                    placements2.push(...allowedPlacementsForCurrentBuilding);
                }
            }
        }else{
            placements2 = alternativeColumns2.map(col => ({
            building: building2,
            column: col
        }));
        }

        if (dice1 === dice2 && this.gamePhase !== "setup") {
            const plazaPlacements: BuildingPlacement[] = [1, 2, 3, 4, 5, 6].map(col => ({
                building: "plaza" as Building,
                column: col
            }));
            
            return [...placements1, ...plazaPlacements];
        }

        return [...placements1, ...placements2];
    }

    private calculatePoints(): number {
        let points = 0;

        for(const position of Object.keys(this.board)){
            const building = this.board[parseInt(position)];
            if(building === "factory" || building === "forest" || building==="lake"){
                const row = MAP_ROWS[(this.diceRoll[0] + this.diceRoll[1]) as keyof typeof MAP_ROWS];
                if(building && this.isBuildingConnectedToRow(parseInt(position), building, row)){
                    points += MAP_POINTS[parseInt(position) as keyof typeof MAP_POINTS] || 0;
                }
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
