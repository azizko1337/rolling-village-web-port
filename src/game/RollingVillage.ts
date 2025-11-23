type Building = "house" | "forest" | "lake" | "factory" | "plaza" | null;
type GamePhase = "setup" | "main" | "gameover";
type RoundPhase = "build" | "bonus" | "calculate";

type BuildingPlacement = {
    building: Building;
    column: number;
}

type PointsSummary = {
    rounds: number,
    factories: number,
    plazas: number,
    total: number
}

type TurnSnapshot = {
    board: Array<Building>;
    remainingPlacements: BuildingPlacement[];
    isFirstBuildingPlaced: boolean;
    usedBonusBuildings: Set<Building>;
    selectedRow: number | null;
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
    private pointsSummary: PointsSummary | null = null;
    private selectedRow: number | null = null;
    private turnSnapshot: TurnSnapshot | null = null;

    // playing api

    public reset(): void {
        this.board = Array(this.BOARD_SIZE).fill(null);
        this.round = 0;
        this.gamePhase = "setup";
        this.roundPhase = "build";
        this.points = {};
        this.diceRoll = [1, 1];
        this.isAwaitingPlayerAction = true;
        this.isFirstBuildingPlaced = false;
        this.isAwaitingDiceRoll = true;
        this.allowedPlacements = [];
        this.remainingPlacements = [];
        this.usedBonusBuildings = new Set();
        this.pointsSummary = null;
        this.selectedRow = null;
        this.turnSnapshot = null;
    }

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
                    this.saveSnapshot();
                    this.isAwaitingPlayerAction = true;
                }
            } else if(this.roundPhase === "bonus"){
                this.roundPhase = "calculate";
                const sum = this.diceRoll[0] + this.diceRoll[1];
                if (sum === 2 || sum === 12) {
                    this.isAwaitingPlayerAction = true;
                    this.selectedRow = null;
                    this.saveSnapshot();
                }
            } else if(this.roundPhase === "calculate"){
                this.points[this.round] = this.calculatePoints();
                
                if(this.round === 9){
                    this.gamePhase = "gameover";
                    this.isAwaitingDiceRoll = false;
                    this.isAwaitingPlayerAction = false;
                    this.pointsSummary = this.summarizePoints();
                }else{
                    this.roundPhase = "build";
                    this.isAwaitingPlayerAction = true;
                    this.isAwaitingDiceRoll = true;
                    this.round += 1;
                }
            }
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
            if (this.turnSnapshot && this.usedBonusBuildings.size > this.turnSnapshot.usedBonusBuildings.size) {
                console.log("Only one bonus building allowed per bonus phase");
                return;
            }

            if(building && this.usedBonusBuildings.has(building)) {
                console.log("This bonus building was already used");
                return;
            }
            
            this.board[position] = building;
            if(building) {
                this.usedBonusBuildings.add(building);
            }
            // this.isAwaitingPlayerAction = false; // Wait for confirm
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
        } else if(this.getIsFactorySituation()){
            this.remainingPlacements = this.remainingPlacements.filter(p => p.building !== building);
        } 
        else {
            if(this.gamePhase === "setup"){
                if(this.isFirstBuildingPlaced){
                    this.remainingPlacements = []
                } else if(this.diceRoll[0] === this.diceRoll[1]){
                    this.remainingPlacements = this.remainingPlacements.filter(p => (p.building !== building))
                } else{
                    this.remainingPlacements = this.remainingPlacements.filter(p => (p.building !== building && p.column !== column));
                }
            }else{
                console.log(1)
                this.remainingPlacements = this.remainingPlacements.filter(p => p.building !== building);
            }
        }
        console.log(13)
        
        if(this.remainingPlacements.length === 0) {
            // this.isAwaitingPlayerAction = false; // Wait for confirm
            this.isFirstBuildingPlaced = false;
        } else {
            this.isFirstBuildingPlaced = true;
        }
    }

    public isReadyForTick(): boolean{
        return !this.isAwaitingPlayerAction && !this.isAwaitingDiceRoll && this.gamePhase !== "gameover";
    }

    public setRollDice(diceRoll: DiceRoll): void {
        if(!this.isAwaitingDiceRoll) return;

        this.diceRoll = diceRoll;
        this.isAwaitingDiceRoll = false;

        this.allowedPlacements = this.calculateAllowedPlacements(diceRoll);
        this.remainingPlacements = [...this.allowedPlacements];
        this.saveSnapshot();
    }

    // getters

    public getIsFactorySituation(): boolean {
        const [dice1, dice2] = this.diceRoll;
        const building1 = this.diceValueToBuilding(dice1);
        const building2 = this.diceValueToBuilding(dice2);
        return (dice1 !== dice2 && building1 === building2 && this.gamePhase !== "setup");
    }

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

    public getScoredRow(): number | null {
        if (this.gamePhase === "setup") return null;
        const sum = this.diceRoll[0] + this.diceRoll[1];
        if (sum === 2 || sum === 12) {
            return this.selectedRow;
        }
        return MAP_ROWS[sum as keyof typeof MAP_ROWS] ?? null;
    }

    public isPlacementAllowed(building: Building, position: number): boolean {
        const column = (position % this.ROW_WIDTH) + 1; // Convert position to column (1-6)
        return this.remainingPlacements.some(
            placement => placement.building === building && placement.column === column
        );
    }

    public getAvailableBonusBuildings(): Building[] {
        if (this.turnSnapshot && this.usedBonusBuildings.size > this.turnSnapshot.usedBonusBuildings.size) {
            return [];
        }
        const allBuildings: Building[] = ["house", "forest", "lake"];
        return allBuildings.filter(b => !this.usedBonusBuildings.has(b));
    }

    public getPointsSummary(): PointsSummary | null {
        return this.pointsSummary;
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

    private findAlternativeColumns(targetColumn: number, reservedInColumn: Record<number, number> = {}): number[] {
        const reserved = reservedInColumn[targetColumn] || 0;
        const emptyCells = this.getEmptyCellsInColumn(targetColumn) - reserved;
        
        if (emptyCells > 0) {
            return [targetColumn];
        }

        //Full column?
        for(let i=1; i<=this.ROW_WIDTH/2; i++){
            let leftColumn = targetColumn - i;
            if (leftColumn < 1) leftColumn += this.ROW_WIDTH;

            let rightColumn = targetColumn + i;
            if (rightColumn > this.ROW_WIDTH) rightColumn -= this.ROW_WIDTH;

            // If we reached the opposite side (e.g. distance 3 in a 6-col grid), both point to same column
            if (leftColumn === rightColumn) {
                const reservedLeft = reservedInColumn[leftColumn] || 0;
                if (this.getEmptyCellsInColumn(leftColumn) - reservedLeft > 0) {
                    return [leftColumn];
                }
                continue;
            }

            const reservedLeft = reservedInColumn[leftColumn] || 0;
            const reservedRight = reservedInColumn[rightColumn] || 0;

            const leftEmpty = this.getEmptyCellsInColumn(leftColumn) - reservedLeft;
            const rightEmpty = this.getEmptyCellsInColumn(rightColumn) - reservedRight;

            if (leftEmpty <= 0 && rightEmpty <= 0) {
                continue;
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

        //no columns available, most likely not possible in standard gameplay
        return []
    }

    private calculateAllowedPlacements(diceRoll: DiceRoll): BuildingPlacement[] {
        if(this.gamePhase === "gameover") return [];

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
        
        const reserved: Record<number, number> = {};
        if (this.gamePhase !== "setup" && alternativeColumns1.length === 1) {
             const col = alternativeColumns1[0];
             reserved[col] = (reserved[col] || 0) + 1;
        }

        const building2 = this.diceValueToBuilding(dice2);
        const targetColumn2 = dice1;
        const alternativeColumns2 = this.findAlternativeColumns(targetColumn2, reserved);
        
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
            const regularBuildingColumns = new Set(placements1.map(p => p.column));
            const plazaPlacements: BuildingPlacement[] = [1, 2, 3, 4, 5, 6]
                .filter(col => {
                    if (regularBuildingColumns.has(col) && regularBuildingColumns.size === 1) {
                        if (this.getEmptyCellsInColumn(col) === 1) {
                            return false;
                        }
                    }
                    return true;
                })
                .map(col => ({
                    building: "plaza" as Building,
                    column: col
                }));
            
            return [...placements1, ...plazaPlacements];
        }else if(this.getIsFactorySituation()){
            const factoryPlacements1 = alternativeColumns1.map(col => ({
                building: "factory" as Building,
                column: col
            }));
            const factoryPlacements2 = alternativeColumns2.map(col => ({
                building: "factory" as Building,
                column: col
            }));

            return [...placements1, ...placements2, ...factoryPlacements1, ...factoryPlacements2];
        }

        return [...placements1, ...placements2];
    }

    private calculatePoints(): number {
        let points = 0;

        for(const position of Object.keys(this.board)){
            const building = this.board[parseInt(position)];
            if(building === "house" || building === "forest" || building === "lake"){
                const row = this.getScoredRow();
                if(row !== null && building && this.isBuildingConnectedToRow(parseInt(position), building, row)){
                    points += MAP_POINTS[parseInt(position) as keyof typeof MAP_POINTS] || 0;
                }
            }
        }
        
        return points;
    }

    private calculateFactoriesPoints(): number {
        const isColEdgeLeft = (pos: number): boolean => {
            return pos % this.ROW_WIDTH === 0
        }
        const isColEdgeRight = (pos: number): boolean => {
            if(pos + 1 > this.BOARD_SIZE) return true;
            return (pos + 1) % this.ROW_WIDTH === 0
        }

        let points = 0;
        for(const position of Object.keys(this.board)){
            const building = this.board[parseInt(position)];

            if(building === "factory"){
                const buildingAbove = this.board[parseInt(position) - this.ROW_WIDTH] ?? null;
                const buldingBelow = this.board[parseInt(position) + this.ROW_WIDTH] ?? null;
                const buildingLeft = !isColEdgeLeft(+position) ? this.board[parseInt(position) - 1] : null;
                const buildingRight = !isColEdgeRight(+position) ? this.board[parseInt(position) + 1] : null;

                const buildingsNearby = [buildingAbove, buldingBelow, buildingLeft, buildingRight].filter(b => b !== null) as Building[];

                const isNextToHouse = buildingsNearby.includes("house");
                const isNextToPlaza = buildingsNearby.includes("plaza");
                const isNextToLake = buildingsNearby.includes("lake");
                const isNextToForest = buildingsNearby.includes("forest");
                
                if(isNextToHouse || isNextToPlaza){
                    const housesNearby = buildingsNearby.filter(b => b === "house").length;
                    points -= housesNearby * 2;

                    const plazasNearby = buildingsNearby.filter(b => b === "plaza").length;
                    points -= plazasNearby * 5;
                }else if(isNextToLake || isNextToForest){
                    points += 10;
                }
            }
        }
        return points;
    }

    private calculatePlazasPoints(): number {
        const isColEdgeLeft = (pos: number): boolean => {
            return pos % this.ROW_WIDTH === 0
        }
        const isColEdgeRight = (pos: number): boolean => {
            if(pos + 1 > this.BOARD_SIZE) return true;
            return (pos + 1) % this.ROW_WIDTH === 0
        }

        let points = 0;
        for(const position of Object.keys(this.board)){
            const building = this.board[parseInt(position)];

            if(building === "plaza"){
                const buildingAbove = this.board[parseInt(position) - this.ROW_WIDTH] ?? null;
                const buldingBelow = this.board[parseInt(position) + this.ROW_WIDTH] ?? null;
                const buildingLeft = !isColEdgeLeft(+position) ? this.board[parseInt(position) - 1] : null;
                const buildingRight = !isColEdgeRight(+position) ? this.board[parseInt(position) + 1] : null;

                const buildingsNearby = [buildingAbove, buldingBelow, buildingLeft, buildingRight].filter(b => b !== null) as Building[];

                if(buildingsNearby.includes("house") && buildingsNearby.includes("forest") && buildingsNearby.includes("lake")){
                    points += 10;
                }
            }
        }
        return points;
    }

    private summarizePoints(): PointsSummary {
        let roundsPoints = 0;
        const factoriesPoints = this.calculateFactoriesPoints();
        const plazasPoints = this.calculatePlazasPoints();

        for(const round in this.points){
            roundsPoints += this.points[round];
        }

        const totalPoints = roundsPoints + factoriesPoints + plazasPoints;

        return {
            rounds: roundsPoints,
            factories: factoriesPoints,
            plazas: plazasPoints,
            total: totalPoints
        }
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

    public selectRow(row: number) {
        if (this.roundPhase !== "calculate") return;
        const sum = this.diceRoll[0] + this.diceRoll[1];
        if (sum !== 2 && sum !== 12) return;
        
        if (row < 0 || row >= this.ROWS) return;

        this.selectedRow = row;
        // this.isAwaitingPlayerAction = false; // Wait for confirm
    }

    public saveSnapshot(): void {
        this.turnSnapshot = {
            board: [...this.board],
            remainingPlacements: [...this.remainingPlacements],
            isFirstBuildingPlaced: this.isFirstBuildingPlaced,
            usedBonusBuildings: new Set(this.usedBonusBuildings),
            selectedRow: this.selectedRow
        };
    }

    public undo(): void {
        if (!this.turnSnapshot) return;
        this.board = [...this.turnSnapshot.board];
        this.remainingPlacements = [...this.turnSnapshot.remainingPlacements];
        this.isFirstBuildingPlaced = this.turnSnapshot.isFirstBuildingPlaced;
        this.usedBonusBuildings = new Set(this.turnSnapshot.usedBonusBuildings);
        this.selectedRow = this.turnSnapshot.selectedRow;
        this.isAwaitingPlayerAction = true;
    }

    public confirm(): void {
        if (!this.isAwaitingPlayerAction) return;

        // Check if we can confirm
        if (this.roundPhase === "build") {
            if (this.remainingPlacements.length === 0) {
                this.isAwaitingPlayerAction = false;
            }
        } else if (this.roundPhase === "bonus") {
             // In bonus phase, we just place one building (or none if we skip? logic says we place one)
             // The build method for bonus phase adds to usedBonusBuildings.
             // We can assume if the board state changed from snapshot, we did something.
             // Or we can check if we placed a building.
             // The current logic for bonus phase in `build` is:
             // this.board[position] = building;
             // this.usedBonusBuildings.add(building);
             
             // If we want to enforce that a building was placed:
             // But maybe the user can skip? The original code didn't seem to allow skip explicitly, 
             // but `build` was the only way to proceed.
             // If `build` was called, `isAwaitingPlayerAction` was set to false.
             // So we should check if an action was taken.
             
             // Simple check: has the board changed?
             // Or just check if we are in a state where we *should* have acted.
             
             // Let's assume the user must perform the action.
             // For bonus, `build` is called once.
             // So if `turnSnapshot` differs from current state?
             
             // Actually, `build` modifies `usedBonusBuildings`.
             if (this.usedBonusBuildings.size > this.turnSnapshot!.usedBonusBuildings.size) {
                 this.isAwaitingPlayerAction = false;
             }
        } else if (this.roundPhase === "calculate") {
            const sum = this.diceRoll[0] + this.diceRoll[1];
            if (sum === 2 || sum === 12) {
                if (this.selectedRow !== null) {
                    this.isAwaitingPlayerAction = false;
                }
            }
        }
    }

    public canUndo(): boolean {
        return this.turnSnapshot !== null && this.isAwaitingPlayerAction;
    }

    public canConfirm(): boolean {
        if (!this.isAwaitingPlayerAction) return false;

        if (this.roundPhase === "build") {
            return this.remainingPlacements.length === 0;
        } else if (this.roundPhase === "bonus") {
             // Assuming we must place a building in bonus phase if available
             // If usedBonusBuildings size increased?
             if (!this.turnSnapshot) return false;
             return this.usedBonusBuildings.size > this.turnSnapshot.usedBonusBuildings.size;
        } else if (this.roundPhase === "calculate") {
            const sum = this.diceRoll[0] + this.diceRoll[1];
            if (sum === 2 || sum === 12) {
                return this.selectedRow !== null;
            }
        }
        return false;
    }
}

export default RollingVillage;
