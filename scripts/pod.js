class Pod {
  
  constructor(player, x = 0, y = 0, r = podSize, col = color(120)){
    this.col = x;
    this.row = y;
    this.r = r;
    this.color = col;
    this.str = color(0);
    this.player = player;
  }
  
  show(){
      fill(this.color);
      stroke(this.str);
      strokeWeight(3.5);
      ellipseMode(CENTER);
      ellipse(this.col, this.row, this.r);
  }

}