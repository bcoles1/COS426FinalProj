class ScoreTime {
    constructor() {
        this.element = document.createElement("div");
        this.element.setAttribute('style', 'font-size: 40px;border-style: ridge;background-color: rgb(201, 76, 76); padding: 5px ;position: absolute; top: 2%;left: 42%; z-index: 100; cursor: pointer; text-align: center; display: block');
        this.element.innerText = "Red 0 - 0 Blue";
        document.body.append(this.element);

        this.redScore = 0;
        this.blueScore = 0;
    }
    updateScore(redScore, blueScore) {
        if(redScore ==3 || blueScore == 3) {
            this.element.style.display = "none";
        }
        this.redScore = redScore;
        this.blueScore = blueScore;
        this.element.innerText = "Red " + this.redScore + "  -  " + this.blueScore + "Blue";
        
    }
}

export default ScoreTime;