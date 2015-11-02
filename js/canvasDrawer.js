function CanvasDrawer () {
    this.cellSize = 40;
    this.colors = ['red', 'orange', 'yellow', 'green', 'aqua', 'blue', 'purple', 'silver', 'white'];
    this.canvasField = document.getElementById("canvasGameField");
    this.ctx = this.canvasField.getContext('2d');
}

CanvasDrawer.prototype.drawField = function (modelArr) {
    var canvasArr = modelArr,
        cellSize = this.cellSize,
        ctx = this.ctx,
        width = canvasArr.length,
        height = canvasArr[0].length,
        colorOfTile,
        mousePositionX,
        mousePositionY,
        offset = 0.5;

    this.canvasField.width = cellSize*width + offset*2;
    this.canvasField.height = cellSize*height + offset*2;

    for (var j = 0; j < height; j++) {
        for (var i = 0; i < width; i++) {
            colorOfTile = this.colors[canvasArr[i][j].color];
            ctx.fillStyle = colorOfTile;
            ctx.fillRect(i*cellSize + 1, j*cellSize + 1, cellSize - 1, cellSize - 1);

        }
    }
    this.canvasField.onclick = function(e) {
        mousePositionX = Math.floor(e.offsetX/cellSize);
        mousePositionY = Math.floor(e.offsetY/cellSize);
        game.onCellClick(mousePositionX, mousePositionY);
    };
};

CanvasDrawer.prototype.animateSwap = function (x1, y1, x2, y2, modelArr, callback) {

    var ctx = this.ctx,
        cellSize = this.cellSize,
        shiftX = x2 - x1,
        shiftY = y2 - y1,
        color1 = this.colors[modelArr[x1][y1].color],
        color2 = this.colors[modelArr[x2][y2].color],
        topLeftCornerX = Math.min(x1, x2)*cellSize + 1,
        topLeftCornerY = Math.min(y1, y2)*cellSize + 1,
        widthOfSwappedGroup = cellSize - 1 + cellSize*Math.abs(x2 - x1),
        heightOfSwappedGroup = cellSize - 1 + cellSize*Math.abs(y2 - y1),
        x1Coordinate = x1 * cellSize + 1,
        x2Coordinate = x2 * cellSize + 1,
        y1Coordinate = y1 * cellSize + 1,
        y2Coordinate = y2 * cellSize + 1;

    var animateS = function() {

      //  console.log('animateS', x1Coordinate + shiftX, y1Coordinate + shiftY, cellSize - 1, cellSize - 1);
        ctx.clearRect(topLeftCornerX, topLeftCornerY, widthOfSwappedGroup, heightOfSwappedGroup);

        ctx.fillStyle = color2;
        ctx.fillRect(x1Coordinate + shiftX, y1Coordinate + shiftY, cellSize - 1, cellSize - 1);
        ctx.fillStyle = color1;
        ctx.fillRect(x2Coordinate - shiftX, y2Coordinate - shiftY, cellSize - 1, cellSize - 1);

        if (shiftX > 0) { // оптимизировать
            shiftX++;
        }
        else if (shiftX < 0) {
            shiftX--;
        }
        else if (shiftY > 0) {
            shiftY++;
        }
        else if (shiftY < 0) {
            shiftY--;
        }
        var timer = setTimeout(animateS, 50);
        if (Math.abs(shiftX) == cellSize + 1 || Math.abs(shiftY) == cellSize + 1) {
            clearTimeout(timer);

            if (callback) {
                callback();
            }
        }
    };
    animateS();
};

CanvasDrawer.prototype.animateNewGroup = function (group, modelArr, callback) {
    var canvasArr = modelArr,
        ctx = this.ctx,
        cellSize = this.cellSize,
        shiftY = 1,
        colorOfTile,
        startX = group[0].startX,
        finishX = group[0].finishX,
        startY = group[0].startY,
        finishY = group[0].finishY,
        widthOfGroup = (finishX - startX + 1)*cellSize,
        heightOfGroup = (finishY - startY +1)*cellSize,
        self = this;
    ctx.clearRect(startX*cellSize, startY*cellSize, widthOfGroup , heightOfGroup);

    var animateS = function() {
        for (var i = startX; i <= finishX; i++) {
            for (var j = startY; j <= finishY; j++) {
                colorOfTile = self.colors[canvasArr[i][j].color];
                ctx.fillStyle = colorOfTile;
                ctx.fillRect(i * cellSize + 1, j * cellSize + 1, cellSize - 1, shiftY);
            }
        }
        shiftY++;
        var timer =  setTimeout(animateS, 50);
        if (shiftY == cellSize) {
            clearTimeout(timer);

            if (callback) {
                callback();
            }
        }
    };
    animateS();
};

CanvasDrawer.prototype.animateHorizontalGroups = function (swappedArr, callback) {
    var ctx = this.ctx,
        cellSize = this.cellSize,
        shiftY = 0,
        startX = swappedArr[0][0],
        finishX = swappedArr[0].length,
        startY = 0,
        finishY = swappedArr.length;
    console.log(swappedArr);


    var animateS = function() {
        for (var i = startY; i <= finishY; i++) {
            for (var j = startX; j <= finishX; j++) {
                var colorOfTile = self.colors[swappedArr[i][j].color];
                ctx.fillStyle = colorOfTile;
                ctx.fillRect(i * cellSize + 1, j * cellSize + 1 + shiftY, cellSize - 1, cellSize -1);
            }
        }
        shiftY++;
        var timer =  setTimeout(animateS, 50);
        if (shiftY == cellSize) {
            clearTimeout(timer);

            if (callback) {
                callback();
            }
        }
    };
    animateS();

}; 