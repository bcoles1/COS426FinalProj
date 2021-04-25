class ScoreTime {
    constructor(gameTime) {
        this.element = document.createElement("div");
        this.element.id = "ScoreTime";
        this.element.innerText = "Red 0 - 0 Blue \n" + gameTime;
        this.element.style.color = 'black';
        this.element.style.fontFamily = 'Ansale Mono';
        this.element.style.position = 'fixed';
        this.element.style.textAlign = 'center';
        document.body.append(this.element);

        this.redScore = 0;
        this.blueScore = 0;
        this.time = gameTime;
    }
    updateScore(redScore, blueScore) {
        this.element.innerText = "Red " + this.redScore + " - " + this.blueScore +"\n" + this.time;
        this.redScore = redScore;
        this.blueScore = blueScore;
    }

    updateTime() {
        var newTime = this.time -1;
        this.element.innerText = "Red " + this.redScore + " - " + this.blueScore +"\n" + newTime;
        this.time = newTime;
        return newTime;
        
    }
}

export default ScoreTime;