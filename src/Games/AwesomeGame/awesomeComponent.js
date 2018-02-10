import GameWrapper from "../GameWrapper";
import React from "react";
import "./style.css";
import _ from "underscore";

class Dungeon extends GameWrapper {
    constructor(props){
        super(props);
        this.state ={
            grid: props.grid,
        }
    }
    componentWillMount(){

        this.props.updateGrid(this.createDungeon())

        // this.state.grid = this.createDungeon();
    }
    componentDidUpdate(prevProps){
        //check if grid changes and then updates state
        if(JSON.stringify(prevProps.grid) !== JSON.stringify(this.props.grid)){
            console.log('update');
            this.setState({grid: this.props.grid})
        }
    }
    isValidRoomPlacement (grid, {x, y, width = 1, height = 1}) {

        // check if on the edge of or outside of the grid
        if (y < 1 || y + height > grid.length - 1) {
            return false;
        }
        if (x < 1 || x + width > grid[0].length - 1) {
            return false;
        }

        // here you go from y-1 to y+height+1 and check id they are any floors
        for (let i = y - 1; i < y + height + 1; i++) {
            for (let j = x - 1; j < x + width + 1; j++) {
                if (grid[i][j].type === 'floor') {
                    return false;
                }
            }
        }
        // all grid cells are clear
        return true;
    }
    placeCells(grid, {x, y, width = 1, height = 1, id}, type = 'floor'){
        for (let i = y; i < y + height; i++) {
            for (let j = x; j < x + width; j++) {
                grid[i][j] = {x: i, y: j,type, id};
            }
        }
        return grid;
    }
    createRoomsFromSeed(grid, {x, y, width, height}, range = this.props.roomSizeRange){
        // range for generating the random room heights and widths
        const [min, max] = range;

        // generate room values for each edge of the seed room
        const roomValues = [];

        const north = { height: _.random(min, max), width: _.random(min, max) };
        north.x = _.random(x, x + width - 1);
        north.y = y - north.height - 1;
        north.doorx = _.random(north.x, (Math.min(north.x + north.width, x + width)) - 1);
        north.doory = y - 1;
        north.id= 'N';
        roomValues.push(north);

        const east = { height: _.random(min, max), width: _.random(min, max) };
        east.x = x + width + 1;
        east.y = _.random(y, height + y - 1);
        east.doorx = east.x - 1;
        east.doory = _.random(east.y, (Math.min(east.y + east.height, y + height)) - 1);
        east.id= 'E';
        roomValues.push(east);

        const south = { height: _.random(min, max), width: _.random(min, max) };
        south.x = _.random(x, width + x - 1);
        south.y = y + height + 1;
        south.doorx = _.random(south.x, (Math.min(south.x + south.width, x + width)) - 1);
        south.doory = y + height;
        south.id='S';
        roomValues.push(south);

        const west = { height: _.random(min, max), width: _.random(min, max) };
        west.x = x - west.width - 1;
        west.y = _.random(y, height + y - 1);
        west.doorx = x - 1;
        west.doory = _.random(west.y, (Math.min(west.y + west.height, y + height)) - 1);
        west.id='W';
        roomValues.push(west);

        const placedRooms = [];
        roomValues.forEach(room => {
            if (this.isValidRoomPlacement(grid, room)) {
                // place room
                grid = this.placeCells(grid, room);
                // place door
                grid = this.placeCells(grid, {x: room.doorx, y: room.doory}, 'door');
                // need placed room values for the next seeds
                placedRooms.push(room);
            }
        });
        // console.log(placedRooms);
        return {grid, placedRooms};
    }
    createDungeon(){
        console.log('true');
        //1. empty grid
        let grid = [];
        for (let i = 0; i < this.props.gridHeight; i++) {
            grid.push([]);
            for (let j = 0; j < this.props.gridWidth; j++) {
                grid[i].push({type: 0, opacity: _.random(0.3, 0.8)});
            }
        }

        //2. random vals for 1st room

        const [min, max] = this.props.roomSizeRange;
        const firstRoom = {
            x: _.random(1, this.props.gridWidth  - max - 15),
            y: _.random(1, this.props.gridHeight- max - 15),
            height: _.random(min, max),
            width: _.random(min, max),
            id: 'O'
        };

        //3.place 1st room onto grid
        grid = this.placeCells(grid, firstRoom);

        //4. use 1st room as seed and recursively add rooms
        const growMap = (grid, seedRooms, counter = 1, maxRooms = this.props.maxRooms) => {
            //think about the last and second-to-last iteration
            if (counter + seedRooms.length > maxRooms || !seedRooms.length) {
                return grid;
            }

            //grid will be an obj that has an grid property and placedRooms property
            grid = this.createRoomsFromSeed(grid, seedRooms.pop());

            // ... is an spread operator
            // [1,2,3].push(...[4,5,6]) result in [1,2,3,4,5,6] not [1,2,3,[4,5,6]]

            seedRooms.push(...grid.placedRooms);
            counter += grid.placedRooms.length;
            return growMap(grid.grid, seedRooms, counter);
        };

        return growMap(grid, [firstRoom]);
    }
    createEl(id, color, opacity, type){
        let bg = 'none';
        let border = '1px solid #4d2c19';
        if(type === 'ground'){
            bg = 'radial-gradient( circle, #94551e, #612f08 90%)';
        } else if(type === 'grass'){
            bg = 'radial-gradient( circle, #7cde68, #4f7d38 90%)';
            border = '1px dashed #16401c';
        }

        if(type === 'weapon'){
            return <span style={{ opacity: opacity,  height:'15px',
                width: '15px', border: '1px solid #4d2c19', background: 'radial-gradient(circle, #94551e, #612f08 90%)'}}><img  height='15px' src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/149366/cherry.png"/>
        </span>
        }

        if(type === 'boss'){
            return <span style={{ opacity: opacity, height:'15px',
                width: '15px', border: '1px solid #4d2c19', background: 'radial-gradient(circle, #94551e, #612f08 90%)'}}><img width="15px" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/149366/boss.png"/></span>
        }
        if(type === 'health'){
            return <span style={{opacity: opacity, height:'15px',
                width: '15px', border: '1px solid #4d2c19', background: 'radial-gradient( circle, #94551e, #612f08 90%)'}}>
       <img width="13px" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/149366/health.png" />
       </span>
        }
        if(type === 'enemy'){
            return <span style={{  opacity: opacity, height:'15px',
                width: '15px', border: '1px solid #4d2c19', background: 'radial-gradient( circle, #94551e, #612f08 90%)'}}><img width="15px" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/149366/enemy.png"/></span>
        }
        if(type === 'player'){
            return  <span style={{ opacity: opacity,  height:'15px',
                width: '15px', border: '1px solid #4d2c19', background: 'radial-gradient( circle, #94551e, #612f08 90%)'}}><img width="15px" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/149366/red-ghost.png"/></span>
        }
        return React.createElement(
            'td',
            {className: 'cell',
                style: {
                    height:'13px',
                    width: '13px',
                    backgroundColor: color,
                    border: border,
                    opacity: opacity,
                    backgroundImage: bg,
                },
            }

        )
    }
    render() {
        return(
            <table style={{background: "black"}}>
                {
                    this.props.grid.map((row, x) => {
                        const el = []
                        row.map((cell, y) => {
                            if(cell.type === 'floor' || cell.type === 'door'){
                                el.push(this.createEl(cell.id, '#eee', cell.opacity, 'ground'));
                            } else if(cell.type === 'player'){
                                el.push(this.createEl(cell.id, 'red', cell.opacity, 'player'));
                            }else if(cell.type === 'boss'){
                                el.push(this.createEl(cell.id, 'blue', cell.opacity,'boss'));
                            }
                            else if(cell.type === 'enemy'){
                                el.push(this.createEl(cell.id, 'green', cell.opacity, 'enemy'));
                            } else if(cell.type === 'weapon'){
                                el.push(this.createEl(cell.id, 'orange', cell.opacity,'weapon'));
                            }else if(cell.type === 'health'){
                                el.push(this.createEl(cell.id, 'pink', cell.opacity, 'health' ));
                            }
                            else{
                                el.push(this.createEl(cell.id, 'lavender', cell.opacity, 'grass'));
                            }
                        })
                        return <tr  style={{display: 'flex', flexDirection:'row'}}>{el}</tr>
                    })
                }
            </table>
        )
    }
}


class Player extends GameWrapper{
    constructor(props){
        super(props);
        this.state = {
            grid: props.grid,
            playerPos: null,
            currentEnemy: null,
            gameStatus: this.props.gameStatus,
        };
    }
    componentDidUpdate(prevProps){
        //check if grid changes and then updates state
        if(JSON.stringify(prevProps.grid) !== JSON.stringify(this.props.grid)){
            this.state.grid = this.props.grid;
            this.addPlayer();
            this.createFog();
            // this.setState({grid: this.props.grid})

        }
    }componentDidMount(){
        window.addEventListener('keydown', (e) => {this.handleKey(e)});
    }
    componentDidUnmount(){
        window.removeEventListener('keydown', (e) => {this.handleKey(e)});
    }
    addPlayer(){
        // initialize player pos
        if(!this.state.playerPos){
            for (let [index, val] of this.state.grid.entries()) {
                // console.log('val',val[index])

                if(val[index].type === 'floor'){
                    // this.props.grid[]
                    val[index].type = 'player';
                    let opts = Object.assign({},  val[index], {level: 1, xp: 100, weapon: 'Cherry Bomb L1', attack: 1});
                    this.state.grid[opts.x][opts.y] = opts;
                    // console.log('new', this.state.grid[opts.x][opts.y]);
                    this.state.playerPos = opts;

                    break;
                    // return this.state.playerPos
                }
            }
        }
        this.props.updateGrid(this.state.grid);
// this.setState({playerPos: this.state.playerPos })
    }
    updatePos(oldX, oldY, newX, newY){
        let grid = this.state.grid;
        // console.log(grid[newX][newY]);

        if(grid[newX][newY].type === 'floor' || grid[newX][newY].type === 'weapon' || grid[newX][newY].type === 'door' || grid[newX][newY].type === 'health'  ){
            let addStats = {};
            console.log(grid[newX][newY].type)
            //change old pos to floor
            grid[oldX ][oldY].type = 'floor';

            //make sure player keeps current weapon if she revisits previous weapon spot
            if(grid[newX][newY].type !== 'weapon' && grid[oldX][oldY].weapon !== grid[newX][newY].weapon){
                //player keeps same weapon
                grid[newX][newY].weapon =  grid[oldX][oldY].weapon;

            }
            if(grid[newX][newY].type === 'health'){
                console.log('health',  grid[newX][newY])
                grid[newX][newY].xp = this.state.playerPos.xp+= 20;
            }else{
                grid[newX][newY].xp = this.state.playerPos.xp;
            }
            grid[newX][newY].type = 'player';

            grid[newX][newY].level = this.state.playerPos.level;
            //adds the xp, weapons, and level to new player cell
            addStats = Object.assign({},...grid[oldX][oldY],grid[newX][newY]);


            //update state
            this.state.playerPos = addStats;
            grid[newX][newY] = addStats;
            console.log(grid[newX][newY])

            //change new pos to player

            //update grid
            this.props.updateGrid(grid, this.state.playerPos)
        } else if( grid[newX][newY].type === 'boss'){
            console.log('hitBoss')
            this.state.boss = grid[newX][newY];
            this.hitBoss(grid[newX][newY])
        } else if (grid[newX][newY].type === 'enemy'){
            this.state.currentEnemy = grid[newX][newY];
            this.hitEnemy(grid[newX][newY])
        }
        this.setState({playerPos: this.state.playerPos, boss: this.state.boss})
    }
    attack(level, attack){
        const max = level * 3 * (attack ? attack : 1);
        const min = (level * 3) - 2;
        const points = Math.floor(Math.random() * ((max)) - min ) + min
        console.log('points', points)
        return points;
    }
    hitEnemy(enemy){
        const player = this.state.playerPos;
        player.xp -= this.attack(enemy.level);
        enemy.xp -= this.attack(player.level, player.attack);
        if(player.xp <= 0){
            //end game
            this.state.grid[player.x][player.y].type = 'floor';
            player.xp = 0;
            this.setState({currentEnemy: null, boss: null});
            this.state.gameStatus = true;
            this.props.updateGrid(this.state.grid, null, 'lose')
        } else if (enemy.xp <= 0){
            enemy.type = 'floor';
            player.xp += 50;
            player.level += 1;
            this.setState({currentEnemy: null, boss: null});
            this.props.updateGrid(this.state.grid);
        } else {
            // attack xp points

        }

        console.log('player xp',player.xp);
        console.log('enemy xp',enemy.xp);
    }
    hitBoss(boss){
        this.setState({playerPos: this.state.playerPos})
        const player = this.state.playerPos;

        player.xp -= this.attack(boss.level);
        boss.xp -= this.attack(player.level);

        if(player.xp <= 0){
            //end game
            this.state.grid[player.x][player.y].type = 'floor';
            player.xp = 0;
            this.state.gameStatus = true;
            this.setState({currentEnemy: null, boss: null});
            this.props.updateGrid(this.state.grid, null, 'lose')
        } else if( boss.xp <= 0){
            boss.type = 'floor';
            this.setState({currentEnemy: null, boss: null});
            this.state.gameStatus = true;
            this.props.updateGrid(this.state.grid, null, 'win')
        }

        console.log('player xp',player.xp);
        console.log('boss xp',boss.xp);
    }
    createFog(){

        this.state.grid.forEach((row, x) => {
            row.forEach((cell, y) => {
                cell.distanceFromPlayer = (Math.abs(this.state.playerPos.x - x)) + (Math.abs(this.state.playerPos.y - y));


                if(cell.distanceFromPlayer > 8 ){
                    cell.opacity = 0
                }else if(cell.distanceFromPlayer > 6){
                    cell.opacity = 0.5
                }  else if(cell.distanceFromPlayer > 4){
                    cell.opacity = 0.7
                }else if(cell.distanceFromPlayer > 2){
                    cell.opacity = 0.9
                } else{
                    cell.opacity = 1;
                }
            })
        })
        this.props.updateGrid(this.state.grid);
    }
    handleKey(e){

        let playerPos = this.state.playerPos;
        let grid = this.state.grid;
        if(!this.state.gameStatus){
            e.preventDefault();
            if(e.keyCode === 37){
                this.updatePos(playerPos.x, playerPos.y, playerPos.x, playerPos.y -1);
            } else if (e.keyCode === 39){
                this.updatePos(playerPos.x, playerPos.y, playerPos.x, playerPos.y + 1);
            } else if (e.keyCode === 38){
                this.updatePos(playerPos.x, playerPos.y, playerPos.x - 1, playerPos.y);
            } else if(e.keyCode === 40) {
                this.updatePos(playerPos.x, playerPos.y, playerPos.x + 1, playerPos.y);
            }
            this.createFog();
        }
    }
    render() {
        return(
            <div style={{display: 'block',
                opacity: '.8',
                position: 'absolute',
                zIndex: '1',
                top: '0',
                right: '0',
                padding: '10px',
            }}>
                <div style={{marginBottom: '5px'}}>

                    <img width="25px" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/149366/red-ghost.png"/>
                    <div>Level: {this.state.playerPos ? this.state.playerPos.level : false}</div>
                    <div>Health: {this.state.playerPos ? this.state.playerPos.xp : false}</div>
                    <div>Weapon: {this.state.playerPos ? this.state.playerPos.weapon : false}</div>
                </div>
                { this.state.currentEnemy ?
                    <div style={{marginBottom: '5px'}}>
                        <img width="25px" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/149366/enemy.png"/>
                        <div>Level: {this.state.currentEnemy.level}</div>
                        <div>Health: {this.state.currentEnemy.xp}</div>
                    </div> : false
                }
                { this.state.boss ? <div>
                    <img width="25px" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/149366/boss.png"/>
                    <div>Boss's level: {this.state.boss.level}</div>
                    <div>Boss's health: {this.state.boss.xp}</div>
                </div> : false
                }

            </div>
        )
    }
}

class Characters extends GameWrapper{
    constructor(props){
        super(props);
        this.state = {
            grid: props.grid,
            boss: [],
            enemies: [],
            weapons: [],
            health: [],
        }
    }
    componentDidUpdate(prevProps){
        //check if grid changes and then updates state
        if(JSON.stringify(prevProps.grid) !== JSON.stringify(this.props.grid)){
            this.state.grid = this.props.grid
            // this.setState({grid: this.props.grid})
            this.addBoss();
            this.addEnemies();
            this.addWeapons();
            this.addHealthPotion();
        }
    }
    createHealthPotion(){
        const healthPotion = {
            xp: 20,
        }

        while(this.state.weapons.length < 3){
            this.state.health.push(healthPotion);
        }
    }
    addHealthPotion(){
        this.createHealthPotion();
        const floorArray = this.getFloors();

        this.state.weapons.forEach(healthStats => {
            let healthPotion = floorArray[Math.floor(Math.random()*floorArray.length)];
            healthPotion.type = 'health';
            let opts = Object.assign({}, healthStats, ...healthPotion )
            console.log('healthPotion', opts)
            this.state.grid[healthPotion.x][healthPotion.y] = opts;

        })
        this.props.updateGrid(this.state.grid);
    }
    createWeapons(){
        const weaponArray =[
            {weapon:'Cherry Bomb L1', attack: 1},
            {weapon: 'Cherry Bomb L3', attack: 3},
            {weapon: 'Cherry Bomb L2', attack: 2}
        ];
        while(this.state.weapons.length <= 3){
            this.state.weapons.push(
                weaponArray[Math.floor(Math.random() * 4)]
            )
        }

    }
    addWeapons(){
        this.createWeapons();
        const floorArray = this.getFloors();

        this.state.weapons.forEach(weaponStats => {
            let weapon = floorArray[Math.floor(Math.random()*floorArray.length)];
            weapon.type = 'weapon';
            let opts = Object.assign({}, weaponStats, ...weapon )
            console.log('weapons', opts)
            this.state.grid[weapon.x][weapon.y] = opts;

        })
        this.props.updateGrid(this.state.grid);
    }
    createEnemies(){
        const enemy = {
            level: Math.floor(Math.random() * (3 - 1)) + 1,
            xp: 50,
            color: 'green',
        }
        while(this.state.enemies.length < 5){
            this.state.enemies.push(enemy)
        }

    }
    addEnemies(){

        this.createEnemies();
        const floorArray = this.getFloors();
        // const enemies = floorArray[Math.floor(Math.random()*floorArray.length)];

        this.state.enemies.forEach(enemyStats => {
            let enemy = floorArray[Math.floor(Math.random()*floorArray.length)];
            enemy.type = 'enemy';
            let opts = Object.assign({}, enemyStats, ...enemy )
            this.state.grid[enemy.x][enemy.y] = opts;

        })
        this.props.updateGrid(this.state.grid);
    }
    createBoss(){
        const boss = {
            level: 4,
            xp: 300,
            color: 'blue',
            attack: 10,
        }
        this.state.boss.push(boss)

    }
    getFloors(){
        //get all floors and push them into an array
        const floorArray = [];
        let grid = this.state.grid

        //check to make sure character doens't block doorway
        function checkForDoors(cell){
            if (grid[cell.x -1][cell.y].type === 'door'){
                return false;
            } else if(grid[cell.x + 1][cell.y].type === 'door'){
                return false
            } else if(grid[cell.x][cell.y + 1].type === 'door'){
                return false
            } else if(grid[cell.x][cell.y - 1].type === 'door'){
                return false;
            } else {
                return true
            }

        }
        grid.forEach((row, x) => {
            row.forEach((cell, y) => {
                if(cell.id && cell.type === 'floor' && checkForDoors(cell)){

                    floorArray.push(cell)
                }
            })
        })


        return floorArray
    }
    addBoss(){
        this.createBoss();
        const floorArray = this.getFloors()


        const bossPos = floorArray[Math.floor(Math.random()*floorArray.length)];
        bossPos.type = 'boss';

        // add boss stats
        const opts = Object.assign({}, bossPos, ...this.state.boss);
        this.state.grid[bossPos.x][bossPos.y] = opts;
        this.props.updateGrid(this.state.grid)

    }
    render(){
        return (
            <div/>
        )
    }
}


export default class App extends GameWrapper{
    constructor(){
        super();
        this.state={
            gridHeight: 30,
            gridWidth: 50,
            maxRooms: 7,
            roomSizeRange: [5,12],
            playerPos: {},
            grid: [],
            gameWin: false,
            gameLose: false,
        }
    }
    updateGrid(grid, playerPos, status){
        // console.log(grid)
        if(status === 'lose'){
            this.state.gameLose = true;
        } else if (status === 'win'){
            this.state.gameWin = true;
        }
        this.setState({grid: grid, playerPos: playerPos});
    }
    render() {
        return(
            <div id="awesome-container">
                <Dungeon
                    grid={this.state.grid}
                    gridHeight={this.state.gridHeight}
                    gridWidth={this.state.gridWidth}
                    maxRooms={this.state.maxRooms}
                    roomSizeRange={this.state.roomSizeRange}
                    updateGrid={this.updateGrid.bind(this)}
                />
                <Player
                    grid={this.state.grid}
                    updateGrid={this.updateGrid.bind(this)}
                />
                <Characters
                    grid={this.state.grid}
                    updateGrid={this.updateGrid.bind(this)}
                    playerPos={this.state.playerPos}
                />
                <span style={{
                    position: 'absolute',
                    textAlign: 'center',
                    zIndex: '2',
                    bottom: '0',
                    width: '100%',
                    margin: 'auto',
                    left: '0',
                    right: '0',
                }}>Press arrow keys to move</span>
                { this.state.gameWin ?  <div style={{
                    position: 'absolute',
                    fontSize: '20px',
                    margin: 'auto',
                    top: '50%',
                    left: '25%',
                    right: '25%',
                    bottom: '50%',
                    textAlign: 'center',
                }}>You Win</div> : false}
                { this.state.gameLose  ?  <div><div style={{
                    display: 'flex',
                    width: '100%',
                    background: '#000',
                    height: '100%',
                    position: 'absolute',
                    fontSize: '20px',
                    margin: 'auto',
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    textAlign: 'center',
                    lineHeight: 'normal',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>Game Over</div></div> : false}

            </div>
        )
    }
}













