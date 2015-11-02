Game.prototype.shiftGroup = function (i) {

    var self = this,
        activeGroup = this.groups[i],
        groupLength,
        startRow,
        finishRow,
        startColumn,
        finishColumn;

    if (activeGroup.startY == activeGroup.finishY) {                             //if horizontal group
        var k = activeGroup.startY;
        if (k == 0) {
            this.randomGenerateColorsForGroup(activeGroup);
            return;
        }
        for (var j = activeGroup.startX; j <= activeGroup.finishX; j++) {

            this.swap(j, k, j, k - 1);
            this.drawer.animateSwap(j, k, j, k - 1, this.modelArr, function () {
                self.drawer.drawField(self.modelArr); //  or redraw only need tiles
            });
        }
        startRow = activeGroup.startY - 1;
        finishRow = activeGroup.finishY - 1;
        startColumn = activeGroup.startX;
        finishColumn = activeGroup.finishX;
    }

    if (activeGroup.startX == activeGroup.finishX) {                                 //if vertical group

        groupLength = activeGroup.finishY - activeGroup.startY + 1;
        j = activeGroup.startX;
        for ( k = activeGroup.finishY; k >= activeGroup.startY; k--) {

            if ((k - groupLength) < 0) {
                this.groups.pop();
                this.groups.push({startX: j, startY: 0, finishX: j, finishY: groupLength - 1 });
                activeGroup = this.groups[i];
                this.randomGenerateColorsForGroup(activeGroup);
                return;
            }
            this.swap(j, k, j, k - groupLength);
            this.drawer.animateSwap(j, k, j, k - groupLength, this.modelArr, function () {
                self.drawer.drawField(self.modelArr);
            });
        }
        startRow = activeGroup.startY - groupLength;
        finishRow = activeGroup.finishY - groupLength;
        startColumn = activeGroup.startX;
        finishColumn = activeGroup.finishX;
    }
    this.groups.pop();
    this.groups.push({startX: startColumn, startY: startRow, finishX: finishColumn, finishY: finishRow });
    this.removeGroup(this.groups);
};
