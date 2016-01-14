/*
 *《拼图游戏》
 * 提供一幅正方形的图像，要求实现一个4x4的拼图游戏，规则如下：
 * a) 将图片分割成4x4的16个子图片。
 * b) 去掉右下角的一块。
 * c) 打乱剩下的方块顺序。
 * d) 点击空出位置相邻的方块可以将其移动到空出的位置。
 * e) 将剩下的方块全部回归原位则算胜利。
 * 额外功能：
 * f) 添加移动过渡动画。
 * g) 点击空出位置所在行或列的方块可以移动多个方块。
 */

// 每行滑块数
var _pieceCount = document.getElementById('slide').value;
document.getElementById('slide').onchange = function(){
  _pieceCount = document.getElementById('slide').value;
};

// 原始Div类
function DivClass() {
  this.div = {};
  this.emptyLocation = _pieceCount * _pieceCount - 1;
}

DivClass.prototype.createDiv = function() {
  for(var i = 0; i < _pieceCount; i++) {
    for(var j = 0; j < _pieceCount; j++) {
      this.div[_pieceCount * i + j] = new baseDiv(i ,j);
      this.div[_pieceCount * i + j] = this.div[_pieceCount * i + j].create(this.div[_pieceCount * i + j]);
      document.getElementById('puzzle').appendChild(this.div[_pieceCount * i + j]);
    }
  }
};
DivClass.prototype.randomDiv = function() {
  var tempNum = [-(_pieceCount), -1, 1, _pieceCount], randomNum = 0, toNum = _pieceCount*_pieceCount - 1;
  for (var i = 0; i < 500; i++ ) {
    randomNum = tempNum[ Math.floor(Math.random() * 4) % 4];
    toNum += parseInt(randomNum);
    while (toNum < 0 || toNum >= _pieceCount*_pieceCount - 1 || ((randomNum === 1) && (toNum % _pieceCount === 0)) || ((randomNum === -1) && ((toNum + 1) % _pieceCount === 0))) {
      toNum -= parseInt(randomNum);
      randomNum = tempNum[ Math.floor(Math.random() * 4) % 4];
      toNum += parseInt(randomNum);
    }
    DivClass.prototype.exchangeDiv(this.div[this.emptyLocation], this.div[toNum]);
    // 记录空白位置
    this.emptyLocation = toNum;
  }
};
DivClass.prototype.exchangeDiv = function(formPiece, toPiece) {
  var tempObject, tempNum;
  // 交换图片
  tempObject = formPiece.style.background;
  formPiece.style.background = toPiece.style.background;
  toPiece.style.background = tempObject;
  //交换编号
  tempNum = formPiece.num;
  formPiece.num = toPiece.num;
  toPiece.num = tempNum;
};
DivClass.prototype.moveDiv = function(e) {
  var Xtemp = Math.floor((e.pageX - 516) / (360 / _pieceCount)), Ytemp = Math.floor((e.pageY - 6) / (360 / _pieceCount));
  var location = Xtemp + Ytemp * _pieceCount;
  if (Math.abs((this.emptyLocation - location) / _pieceCount) === 1 || (Math.abs(this.emptyLocation - location) === 1)) {
    if ((this.emptyLocation % _pieceCount === 0 || location % _pieceCount === 0) && (this.emptyLocation + location + 1) % _pieceCount === 0) {
      return;
    }
    DivClass.prototype.exchangeDiv(this.div[this.emptyLocation], this.div[location]);
    this.emptyLocation = location;
  }
  else if (Math.abs(this.emptyLocation - location) < _pieceCount) {
    if (Math.floor(this.emptyLocation / _pieceCount) !== Math.floor(location / _pieceCount)) {
      return;
    }
    else if (this.emptyLocation > location) {
      var temp = this.emptyLocation - location;
      for (var i = 1; i <= temp; i++) {
        DivClass.prototype.exchangeDiv(this.div[this.emptyLocation], this.div[this.emptyLocation - 1]);
        this.emptyLocation = this.emptyLocation - 1;
      }
    }
    else if (this.emptyLocation < location) {
      temp = location - this.emptyLocation;
      for (var i = 1; i <= temp; i++) {
        DivClass.prototype.exchangeDiv(this.div[this.emptyLocation], this.div[this.emptyLocation + 1]);
        this.emptyLocation = this.emptyLocation + 1;
      }
    }
  }
  else if (Math.abs(this.emptyLocation - location) % _pieceCount === 0) {
    if (this.emptyLocation > location) {
      temp = this.emptyLocation - location;
      for (var i = 1; i <= temp / _pieceCount; i++) {
        DivClass.prototype.exchangeDiv(this.div[this.emptyLocation], this.div[this.emptyLocation - parseInt(_pieceCount)]);
        this.emptyLocation = this.emptyLocation - parseInt(_pieceCount);
      }
    }
    else if (this.emptyLocation < location) {
      temp = location - this.emptyLocation;
      for (var i = 1; i <= temp / _pieceCount; i++) {
        DivClass.prototype.exchangeDiv(this.div[this.emptyLocation], this.div[this.emptyLocation + parseInt(_pieceCount)]);
        this.emptyLocation = this.emptyLocation + parseInt(_pieceCount);
      }
    }
  }
};
DivClass.prototype.judgeDiv = function() {
  var result = true;
  for (var i = 0; i < _pieceCount*_pieceCount - 1; i++) {
    if ((this.div[i]).num > (this.div[i + 1]).num) {
      result = false;
    }
  }
  if (result === true) {
    alert('成功过关！');
  }
};

// 创建的Div基类
function baseDiv(i, j) {
  this.num = _pieceCount * i + j;
  this.pieceWidth = 360 / _pieceCount;
  this.style = {};
  this.style.width = this.style.height = this.pieceWidth;
  this.style.background = 'url(' + document.getElementById('picture').src+ ')';
  this.style.backgroundPosition = (0 - this.pieceWidth * j) + ' ' + (0 - this.pieceWidth * i);
  this.style.left = this.pieceWidth * j;
  this.style.top = this.pieceWidth * i;
  this.style.position = 'absolute';
  if (i === _pieceCount - 1 && j === _pieceCount - 1) {
    this.style.background = '#ffffff';
  }
};
baseDiv.prototype.create = function(o) {
  var temp = document.createElement('div');
  temp.num = o.num;
  temp.pieceWidth = o.pieceWidth;
  temp.style.width = o.style.width;
  temp.style.height = o.style.height;
  temp.style.background = o.style.background;
  temp.style.backgroundPosition = o.style.backgroundPosition;
  temp.style.left = o.style.left;
  temp.style.top = o.style.top;
  temp.style.position = o.style.position;
  return temp;
};

document.getElementById('startbtn').onclick = function() {
  var newDiv = new DivClass();
  newDiv.createDiv();
  newDiv.randomDiv();
  document.getElementById('puzzle').onclick = function(e) {
    newDiv.moveDiv(e);
    newDiv.judgeDiv();
  }
};

document.getElementById('choosebtn').onclick = function() {
  // 改变开始按钮文本
  document.getElementById('startbtn').innerHTML = '开始游戏';
  // 改变图片
  var i = document.getElementById('picture').src.charAt(document.getElementById('picture').src.length-5);
  i++;
  if (i === 5) {
    i = 1;
  }
  document.getElementById('picture').src = 'pic/' + i + '.jpg';
};
