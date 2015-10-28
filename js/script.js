function Game () {
    this.drawer = new CanvasDrawer();
    this.modelArr = null;
    this.width = 0;
    this.height = 0;
    this.numberOfColors = 0;
    this.isFirstClick = true;
    this.firstClickedTail = {};
    this.secondClickedTail = {};
    this.groups = [];
}

Game.prototype.start = function(width, height, numberOfColors) {
    var currentColor,
        tiles,
        hasGroups, hasMove,
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
    hasGroups = this.findGroups(startRow, this.height - 1, startColumn, this.width - 1);
    hasMove = this.hasMove(startRow, this.height - 1, startColumn, this.width - 1);
    this.groups = [];

    console.log(hasGroups);
    if (hasGroups || !hasMove) {
        this.start(width, height, numberOfColors);
    }
};

Game.prototype.findGroups = function (startRow, numberOfRows, startColumn, numberOfColumns) {
    var numberOfMatches = 0,
        //groups = [],
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
                        this.groups.pop();
                    }
                    this.groups.push({startX: startPositionOfMatches.x, startY: startPositionOfMatches.y,
                        finishX: finishPositionOfMatches.x, finishY: finishPositionOfMatches.y });
                  //  console.log(this.groups);
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
                        this.groups.pop();
                    }
                    this.groups.push({startX: startPositionOfMatches.x, startY: startPositionOfMatches.y,
                        finishX: finishPositionOfMatches.x, finishY: finishPositionOfMatches.y });
                   // console.log(this.groups);
                }
            }   else {
                numberOfMatches = 0;
            }
        }
        numberOfMatches = 0;
    }
    return this.groups.length;
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

Game.prototype.onCellClick = function (mousePositionX, mousePositionY) {
    var maxX, maxY,
        minX, minY;

    if (this.isFirstClick) {
        this.firstClickedTail.x = mousePositionX;
        this.firstClickedTail.y = mousePositionY;
        this.isFirstClick = false;

    }   else {
        this.secondClickedTail.x = mousePositionX;
        this.secondClickedTail.y = mousePositionY;
        this.isFirstClick = true;
    }
    if ((this.isFirstClick) && (this.isNeighbors(this.firstClickedTail.x, this.firstClickedTail.y,
        this.secondClickedTail.x, this.secondClickedTail.y))) {
        var fcx = this.firstClickedTail.x,
            fcy = this.firstClickedTail.y,
            scx = this.secondClickedTail.x,
            scy = this.secondClickedTail.y,
            self = this;
        this.swap(this.firstClickedTail.x, this.firstClickedTail.y, this.secondClickedTail.x, this.secondClickedTail.y);

        game.drawer.animateSwap(this.firstClickedTail.x, this.firstClickedTail.y,
            this.secondClickedTail.x, this.secondClickedTail.y, this.modelArr, function() {

                maxX = Math.max(fcx, scx);
                minX = Math.min(fcx, scx);
                maxY = Math.max(fcy, scy);
                minY = Math.min(fcy, scy);

                self.findGroups(minY, maxY, 0, self.width - 1); //find horizontal groups
                self.findGroups(0, self.height - 1, minX, maxX); // find vertical groups
                //console.log(this.groups);
                self.removeGroup(self.groups);

            });
        //game.drawer.drawField(this.modelArr);
    }
};

Game.prototype.removeGroup = function (groups) {
    var groupLength = groups.length;
    for (var i = 0; i < groupLength; i++) {
        console.log(this.groups[i]);
        for (var j = this.groups[i].startX; j <= this.groups[i].finishX; j++) {
            for (var k = this.groups[i].startY; k <= this.groups[i].finishY; k++) {
                this.modelArr[j][k].color = 8;
                game.drawer.drawField(this.modelArr);
            }
        }
    }
    this.shiftGroup(this.groups);
};

Game.prototype.shiftGroup = function (groups) {
    var groupLength = groups.length;
    for (var i = 0; i < groupLength; i++) {

        for (var j = this.groups[i].startX; j <= this.groups[i].finishX; j++) {
            for (var k = this.groups[i].startY; k <= this.groups[i].finishY; k++) {

                if (this.groups[i].startY == this.groups[i].finishY) {  //horizontal group
                   // if (k > 0) {
                        this.swap(j, k, j, k - 1);

                        //game.drawer.drawField(this.modelArr);
                    game.drawer.animateSwap(j, k, j, k - 1, this.modelArr);
                    /*}   /*else {
                        this.modelArr[j][0].color = Math.floor(Math.random()*this.numberOfColors);
                        game.drawer.drawField(this.modelArr);
                    } */
                } else {
                    this.swap(j, k, j , k );
                    game.drawer.drawField(this.modelArr);
                }

            }
        }
        this.groups.shift();
        this.findGroups(0, this.height - 1, 0, this.width -1); // оптимизировть
        this.removeGroup(this.groups);
    }

};

Game.prototype.isNeighbors = function (x1, y1, x2, y2) {
    var neighbors = [
        {
            x : 0,
            y : -1
        },
        {
            x : 0,
            y : 1
        },
        {
            x : 1,
            y : 0
        },
        {
            x : -1,
            y : 0
        }
        ],
        obj,
        neighborsLength = neighbors.length;
    for (var i = 0; i < neighborsLength; i++) {
        obj = neighbors[i];
        if (obj.x + x1 == x2 && obj.y + y1 == y2) {
            return true;
        }
    }
};

game = new Game();
game.start(10,7,8);
game.drawer.drawField(game.modelArr);

