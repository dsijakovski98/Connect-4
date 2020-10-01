class Column {

  constructor(x, y, w, slots, firstAvailable) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = height;
    this.slots = slots;
    this.available = firstAvailable;
    this.color = color(245, 245, 220);
    this.selected = false;
    this.winningIndex = -1;
    this.pods = [];
    this.offset = this.h / this.slots;
  }


  show() {
    stroke(this.selected ? color(255) : color(0));
    strokeWeight(3);
    // fill(255);
    fill(this.color);
    rect(this.x, this.y, this.w, this.h);
    // line(this.x, this.y, this.x, this.y + this.h);
    this.showLines();
    this.showPods();
    if(!gameOver){
      this.hoverShow();
    }
  }

  showLines() {
    strokeWeight(2);
    stroke(this.selected ? color(255) : color(0))
    let offset = 0;
    for (let i = 0; i < this.slots - 1; i++) {
      offset += (this.h / this.slots);
      line(this.x, this.y + offset, this.x + this.w, this.y + offset);
    }
  }

  showPods() {
    for (let i = 0; i < this.pods.length; i++) {
      this.pods[i].show();
    }
  }
  
  hoverShow(){
    if(this.hovered(mouseX)){
      ellipseMode(CENTER)
      fill(player ? color(255,0,0) : color(31))
      ellipse(this.x + this.w/2, this.offset * this.available - this.offset/2, podSize)
    }
  }

  // HOVER EVENT LISTENER
  hovered(mX) {
    if (mX < this.x + this.w && mX > this.x) {
      return true;
    }
    return false;
  }
  checkHover() {
    if(gameOver){
      this.color = color(255);
      return;
    }

    if (this.hovered(mouseX)) {
      if (!this.selected)
        this.color = color(190);
    } else {
      if (!this.selected)
        this.color = color(255);
    }
  }

}