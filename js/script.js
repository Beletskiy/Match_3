function Game () {
    this.drawer = new CanvasDrawer();
    this.modelArr = null;
    this.width = 0;
    this.height = 0;
    this.numberOfColors = 0;
}

/*Game.prototype.colors = {
    RED : 1,
    ORANGE : 2,
    YELLOW : 3,
    GREEN : 4,
    BLUE : 5,
    PURPLE : 6,
    GRAY : 7,
    BLACK : 8
}; */

Game.prototype.start = function(width, height, numberOfColors) {
    var currentColor,
        tiles,
        startRow = 0,
        startColumn = 0;

    this.modelArr = [];
    this.width = width;
    this.height = height;
    this.numberOfColors = numberOfColors;

    for (var i = 0; i < this.width; i++) {
        tiles = [];
        for (var j = 0; j < this.height; j++){
            currentColor = Math.floor(Math.random()*this.numberOfColors);
            tiles.push({color : currentColor});
        }
        this.modelArr.push(tiles);
    }
    this.findGroups(startRow, this.height - 1, startColumn, this.width - 1);
    //console.log(this.modelArr);
};

Game.prototype.findGroups = function (startRow, numberOfRows, startColumn, numberOfColumns) {
    var numberOfMatches = 0,
        groups = [],
        startPositionOfMatches = {},
        finishPositionOfMatches = {};
    //find horizontal groups
    for (var i = startRow; i <= numberOfRows; i++) {
        for (var j = startColumn; j < numberOfColumns ; j++) {
            if (this.modelArr[j][i].color == this.modelArr[j+1][i].color) {
                numberOfMatches++;
                if (numberOfMatches >= 2) {
                    finishPositionOfMatches.x = j + 1;
                    startPositionOfMatches.x = finishPositionOfMatches.x - numberOfMatches;
                    startPositionOfMatches.y = finishPositionOfMatches.y = i;
                    if (numberOfMatches > 2) {
                        groups.pop();
                    }
                    groups.push({startX: startPositionOfMatches.x, startY: startPositionOfMatches.y,
                        finishX: finishPositionOfMatches.x, finishY: finishPositionOfMatches.y });
                    console.log(groups);
                }
            }   else {
                numberOfMatches = 0;
            }
        }
        numberOfMatches = 0;
    }
    //find vertical groups


};

game = new Game();
game.start(10,5,8);
game.drawer.drawField(game.modelArr);

