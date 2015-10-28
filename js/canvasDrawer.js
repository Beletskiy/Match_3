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

CanvasDrawer.prototype.animateSwap = function (x1, y1, x2, y2, modelArr) {
    var ctx = this.ctx,
        cellSize = this.cellSize,
        shiftX = x2 - x1,
        shiftY = y2 - y1,
        color1 = this.colors[modelArr[x1][y1].color],
        color2 = this.colors[modelArr[x2][y2].color];
        //ctx.clearRect(Math.min(x1, x2), Math.max(y1, y2),cellSize, cellSize);
    var animateS = function() {
        console.log("call animate");

           // ctx.clearRect(x1 * cellSize  + shiftX , y1 * cellSize + shiftY , cellSize , cellSize);
           // ctx.clearRect(x2 * cellSize  - shiftX, y2 * cellSize - shiftY, cellSize , cellSize);

            ctx.fillStyle = color2;
            ctx.fillRect(x1 * cellSize + 1 + shiftX, y1 * cellSize + 1 + shiftY, cellSize - 1, cellSize - 1);
            ctx.fillStyle = color1;
            ctx.fillRect(x2 * cellSize + 1 - shiftX, y2 * cellSize + 1 - shiftY, cellSize - 1, cellSize - 1);

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
           var timer =  setTimeout(animateS, 20);
        if (Math.abs(shiftX) == cellSize + 1 || Math.abs(shiftY) == cellSize + 1) {
            clearTimeout(timer);
        }
    };
    animateS();
};