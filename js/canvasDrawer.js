function CanvasDrawer () {
    this.cellSize = 40;
    this.canvasField = document.getElementById("canvasGameField");
    this.ctx = this.canvasField.getContext('2d');
}

CanvasDrawer.prototype.drawField = function (modelArr) {
    var canvasArr = modelArr,
        cellSize = this.cellSize,
        ctx = this.ctx,
        width = canvasArr.length,
        height = canvasArr[0].length,
        offset = 0.5;

    this.canvasField.width = this.cellSize*width + offset*2;
    this.canvasField.height = this.cellSize*height + offset*2;

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(offset, offset, width*cellSize , height*cellSize );

    for (var j = 0; j < height; j++) {
        for (var i = 0; i < width; i++) {

        }
    }
    ctx.stroke();
};