function Game () {
    this.drawer = new CanvasDrawer();
    this.modelArr = [];
    this.width = 0;
    this.height = 0;
    this.numberOfColors = 0;
    this.isFirstClick = true;
    this.firstClickedTile = {};
    this.secondClickedTile = {};
    this.groups = [];
}

Game.prototype.VALUES = {
    EMPTY : 8
};

Game.prototype.start = function(width, height, numberOfColors) {
    var currentColor,
        tiles,
        hasGroups, hasMove,
        startRow = 0,
        startColumn = 0;

    this.width = width;
    this.height = height;
    this.numberOfColors = numberOfColors;
    this.modelArr = [];

    for (var i = 0; i < this.width; i++) {
        tiles = [];
        for (var j = 0; j < this.height; j++){
            currentColor = Math.floor(Math.random()*this.numberOfColors);
            tiles.push({color : currentColor});
        }
        this.modelArr.push(tiles);
    }
    hasGroups = this.findGroup(startRow, this.height - 1, startColumn, this.width - 1);
    hasMove = this.hasMove(startRow, this.height - 1, startColumn, this.width - 1);
    this.groups = [];
    //console.log(hasGroups);
    if (hasGroups || !hasMove) {
        this.start(width, height, numberOfColors);
    }
};

Game.prototype.findGroup = function (startRow, finishRow, startColumn, finishColumn) {
    var numberOfMatches = 0,
        startPositionOfMatches = {},
        finishPositionOfMatches = {};
    //find horizontal groups
    for (var i = startRow; i <= finishRow; i++) {
        for (var j = startColumn; j < finishColumn ; j++) {
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
                }
            }  else if (this.groups.length > 0) {
                return this.groups.length;
            } else {
                numberOfMatches = 0;
            }
        }
        numberOfMatches = 0;
    }
    //find vertical groups
    for (j = startColumn; j <= finishColumn; j++) {
        for (i = startRow; i < finishRow ; i++) {
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
                }
            }    else if (this.groups.length > 0) {
                return this.groups.length;
            }   else {
                numberOfMatches = 0;
            }
        }
        numberOfMatches = 0;
    }
    //console.log(this.groups);
    return this.groups.length;
};

Game.prototype.swap = function (x1, y1, x2, y2 ) {
        var tempSwap = this.modelArr[x1][y1].color;
        this.modelArr[x1][y1].color = this.modelArr[x2][y2].color;
        this.modelArr[x2][y2].color = tempSwap;
};

Game.prototype.hasMove = function (startRow, numberOfRows, startColumn, numberOfColumns) {

    // todo resolve this with potential groups, optimization

    var hasGroups = 0;
    // Check horizontal swaps
    for (var j = startRow; j < numberOfRows; j++) {
        for (var i = startColumn; i < numberOfColumns - 1; i++) {
            this.swap(i, j, i + 1, j);
            hasGroups = this.findGroup(startRow, numberOfRows, startColumn, numberOfColumns);
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
            hasGroups = this.findGroup(startRow, numberOfRows, startColumn, numberOfColumns);
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

    var fcx, fcy, scx, scy,
        self = this;

    if (this.isFirstClick) {
        this.firstClickedTile.x = mousePositionX;
        this.firstClickedTile.y = mousePositionY;
        this.isFirstClick = false;

    } else {
        this.secondClickedTile.x = mousePositionX;
        this.secondClickedTile.y = mousePositionY;
        this.isFirstClick = true;
    }
    if ((this.isFirstClick) && (this.isNeighbors(this.firstClickedTile, this.secondClickedTile))) {

        fcx = this.firstClickedTile.x;
        fcy = this.firstClickedTile.y;
        scx = this.secondClickedTile.x;
        scy = this.secondClickedTile.y;
        this.swap(fcx, fcy, scx, scy);

        this.drawer.animateSwap(fcx, fcy, scx, scy, this.modelArr, function() {

                maxX = Math.max(fcx, scx);
                minX = Math.min(fcx, scx);
                maxY = Math.max(fcy, scy);
                minY = Math.min(fcy, scy);

                self.findGroup(minY, maxY, 0, self.width - 1); //find horizontal group
                self.findGroup(0, self.height - 1, minX, maxX); // find vertical group

                self.removeGroup();
            });
    }
};

Game.prototype.removeGroup = function () {
    if (this.groups.length == 0) {
        return false;
    }
    for (var j = this.groups[0].startX; j <= this.groups[0].finishX; j++) {
        for (var k = this.groups[0].startY; k <= this.groups[0].finishY; k++) {
            this.modelArr[j][k].color = this.VALUES.EMPTY;
        }
    }
    this.shiftGroup(0);
};

Game.prototype.shiftGroup = function (i) {

    var self = this,
        activeGroup = this.groups[i],
        groupLength,
        startRow,
        finishRow,
        startColumn,
        finishColumn;

    /*    for (var j = this.groups[i].startX; j <= this.groups[i].finishX; j++) {
            for (var k = this.groups[i].startY; k <= this.groups[i].finishY; k++) {

                if (k == 0) {
                    console.log("k = 0");
                    this.randomGenerateColorsForGroup(this.groups[i]);
                }

                if (this.groups[i].startY == this.groups[i].finishY) {                 //if horizontal group

                        this.swap(j, k, j, k - 1);
                        game.drawer.animateSwap(j, k, j, k - 1, this.modelArr, function(){ //need special animation

                            game.drawer.drawField(self.modelArr); //  or redraw only need tails, organize fall new group from top
                            self.findGroup(0, self.height - 1, 0, self.width -1);
                            if (self.groups.length > 0) {
                                self.removeGroup(self.groups);
                             }
                        });
                        startRow = this.groups[i].startY - 1;
                        finishRow = this.groups[i].finishY - 1;
                        startColumn = this.groups[i].startX;
                        finishColumn = this.groups[i].finishX;

                } else if (this.groups[i].startX == this.groups[i].finishX) {          //if vertical group
                    var groupLength = this.groups[i].finishY - this.groups[i].startY + 1;
                    if ((k - groupLength) < 0) {

                    }
                    this.swap(j, k, j , k - groupLength );
                    game.drawer.animateSwap(j, k, j , k - groupLength , this.modelArr, function(){

                        game.drawer.drawField(self.modelArr); //  or redraw only need tails, organize fall new group from top
                        self.findGroup(0, self.height - 1, 0, self.width -1);
                        if (self.groups.length > 0) {
                            self.removeGroup(self.groups);
                        }
                    });
                }
            }
        } */
    if (this.groups[i].startY == this.groups[i].finishY) {                             //if horizontal group
        var k = this.groups[i].startY;
        if (k == 0) {
            this.randomGenerateColorsForGroup(this.groups[i]);
            return;
        }
        for (var j = this.groups[i].startX; j <= this.groups[i].finishX; j++) {

            this.swap(j, k, j, k - 1);
            this.drawer.animateSwap(j, k, j, k - 1, this.modelArr, function () { //need special animation

                self.drawer.drawField(self.modelArr); //  or redraw only need tails, organize fall new group from top
                self.findGroup(0, self.height - 1, 0, self.width - 1);
                self.removeGroup(self.groups);
            });
        }
        startRow = this.groups[i].startY - 1;
        finishRow = this.groups[i].finishY - 1;
        startColumn = this.groups[i].startX;
        finishColumn = this.groups[i].finishX;
    }

    if (this.groups[i].startX == this.groups[i].finishX) {                                 //if vertical group

        groupLength = this.groups[i].finishY - this.groups[i].startY + 1;
        j = this.groups[i].startX;
        for ( k = this.groups[i].finishY; k >= this.groups[i].startY; k--) {

            if ((k - groupLength) < 0) {
                this.randomGenerateColorsForGroup(this.groups[i]);
            }
            this.swap(j, k, j, k - groupLength);
            game.drawer.animateSwap(j, k, j, k - groupLength, this.modelArr, function () {

                self.drawer.drawField(self.modelArr); //  or redraw only need tiles, organize fall new group from top
                self.findGroup(0, self.height - 1, 0, self.width - 1);
                self.removeGroup(self.groups);
            });
        }
        startRow = this.groups[i].startY - groupLength;
        finishRow = this.groups[i].finishY - groupLength;
        startColumn = this.groups[i].startX;
        finishColumn = this.groups[i].finishX;
    }

    this.groups.pop();
    this.groups.push({startX: startColumn, startY: startRow, finishX: finishColumn, finishY: finishRow });
    this.removeGroup(this.groups);
};

Game.prototype.randomGenerateColorsForGroup = function (group) {
    for (var j = group.startX; j <= group.finishX; j++) {
        for (var i = group.startY; i <= group.finishY; i++) {
            this.modelArr[j][i].color = Math.floor(Math.random()*this.numberOfColors);
            console.log("rand color");
        }
    }
    this.groups.pop(); // todo WTF?
    this.drawer.drawField(this.modelArr); // or draw only group...
};

Game.prototype.isNeighbors = function (tile1, tile2) {
    var x1 = tile1.x,
        y1 = tile1.y,
        x2 = tile2.x,
        y2 = tile2.y,
        neighbors = [
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
game.start(10,6,4);
game.drawer.drawField(game.modelArr);

