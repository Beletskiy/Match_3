function Game () {
    this.drawer = new CanvasDrawer();
    this.modelArr = null;
    this.width = 0;
    this.height = 0;
    this.numberOfColors = 0;
}

Game.prototype.colors = {
    RED : 1,
    ORANGE : 2,
    YELLOW : 3,
    GREEN : 4,
    BLUE : 5,
    PURPLE : 6,
    GRAY : 7,
    BLACK : 8
};

Game.prototype.start = function(width, height, numberOfColors) {
    var color;

    this.modelArr = [];
    this.width = width;
    this.height = height;
    this.numberOfColors = numberOfColors;

    for (var i=0; i<this.width; i++) {
        var t = [];
        for (var j=0; j<this.height; j++){
            color = Math.round(Math.random()*this.numberOfColors);
            t.push([color]);
        }
        this.modelArr.push(t);
    }
    console.log(this.modelArr);
};
game = new Game();
game.start(10,5,8);
game.drawer.drawField(game.modelArr);

