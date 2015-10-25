function CanvasDrawer () {
    this.cellSize = 40;
    this.colors = ['red', 'orange', 'yellow', 'green', 'aqua', 'blue', 'purple', 'silver'];
    this.canvasField = document.getElementById("canvasGameField");
    this.ctx = this.canvasField.getContext('2d');
}

CanvasDrawer.prototype.drawField = function (modelArr) {
    var canvasArr = modelArr,
        cellSize = this.cellSize,
        ctx = this.ctx,
        width = canvasArr.length,
        height = canvasArr[0].length,
        colorOfTile;
        offset = 0.5;

    this.canvasField.width = this.cellSize*width + offset*2;
    this.canvasField.height = this.cellSize*height + offset*2;

    /*ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.strokeRect(offset, offset, width*cellSize , height*cellSize ); */

    for (var j = 0; j < height; j++) {
        for (var i = 0; i < width; i++) {
            colorOfTile = this.colors[canvasArr[i][j][0]];
            this.ctx.fillStyle = colorOfTile;
            this.ctx.fillRect(i*this.cellSize, j*this.cellSize, this.cellSize, this.cellSize);
        }
    }
};