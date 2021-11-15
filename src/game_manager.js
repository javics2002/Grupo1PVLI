export default class GameManager {
constructor(name){
    this.levelName = this.scene.key;
    this.timeSinceStart;
    this.timeLeft;
    this.recordTime;
}

create() {

let levelNameText = this.add.text(100, 50, this.levelName,
{
    fontFamily: 'Caveat',
    fontSize: 50,
    color: '#ffffff'
});
}

}