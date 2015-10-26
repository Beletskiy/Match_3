function Game () {
    this.drawer = new CanvasDrawer();
    this.modelArr = null;
    this.width = 0;
    this.height = 0;
    this.numberOfColors = 0;
}

Game.prototype.start = function(width, height, numberOfColors) {
    var currentColor,
        tiles,
        startRow = 0,
        hasGroups, hasMove,
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
    hasGroups = this.findGroups(startRow, this.height - 1, startColumn, this.width - 1);
    hasMove = this.hasMove(startRow, this.height - 1, startColumn, this.width - 1);

    console.log(hasGroups);
    if (hasGroups || !hasMove) {
        this.start(width, height, numberOfColors);
    }
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
                   // console.log(groups);
                }
            }   else {
                numberOfMatches = 0;
            }
        }
        numberOfMatches = 0;
    }
    //find vertical groups
    for (j = startColumn; j <= numberOfColumns; j++) {
        for (i = startRow; i < numberOfRows ; i++) {
            if (this.modelArr[j][i].color == this.modelArr[j][i + 1].color) {
                numberOfMatches++;
                if (numberOfMatches >= 2) {
                    finishPositionOfMatches.y = i + 1;
                    startPositionOfMatches.y = finishPositionOfMatches.y - numberOfMatches;
                    startPositionOfMatches.x = finishPositionOfMatches.x = j;
                    if (numberOfMatches > 2) {
                        groups.pop();
                    }
                    groups.push({startX: startPositionOfMatches.x, startY: startPositionOfMatches.y,
                        finishX: finishPositionOfMatches.x, finishY: finishPositionOfMatches.y });
                 //   console.log(groups);
                }
            }   else {
                numberOfMatches = 0;
            }
        }
        numberOfMatches = 0;
    }
    return groups.length;
};

Game.prototype.swap = function (x1, y1, x2, y2 ) {
        var tempSwap = this.modelArr[x1][y1].color;
        this.modelArr[x1][y1].color = this.modelArr[x2][y2].color;
        this.modelArr[x2][y2].color = tempSwap;
};

Game.prototype.hasMove = function (startRow, numberOfRows, startColumn, numberOfColumns) {

    var hasGroups = 0;
    // Check horizontal swaps
    for (var j = startRow; j < numberOfRows; j++) {
        for (var i = startColumn; i < numberOfColumns - 1; i++) {
            this.swap(i, j, i + 1, j);
            hasGroups = this.findGroups(startRow, numberOfRows, startColumn, numberOfColumns);
            this.swap(i, j, i + 1, j);
            if (hasGroups) {
                return true;
            }
        }
    }
    // Check vertical swaps
    for (i = startColumn; i < numberOfColumns; i++) {
        for (j = startRow; j < numberOfRows - 1; j++) {
            this.swap(i, j, i , j + 1);
            hasGroups = this.findGroups(startRow, numberOfRows, startColumn, numberOfColumns);
            this.swap(i, j, i , j + 1);
            if (hasGroups) {
                return true;
            }
        }
    }
};

game = new Game();
game.start(10,5,8);
game.drawer.drawField(game.modelArr);

