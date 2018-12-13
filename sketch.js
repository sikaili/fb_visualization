p5.disableFriendlyErrors = true;
document.addEventListener('touchmove', function (n) {
  n.preventDefault();
}, {
  passive: false
});
document.addEventListener('dblclick', () => {
  nuit = !nuit
}, {
  passive: false
});
var tapedTwice = false;

function Dclick(event) {
  if (!tapedTwice) {
    tapedTwice = true;
    setTimeout(function () {
      tapedTwice = false;
    }, 300);
    return false;
  }
  event.preventDefault();
}

let ee = 0;
let state = -1;
let doubleClick, ts = [];
let mic, osc, filt;
let locss = [];
let cityA = [],
  placeA = [];
let cityArray = [];
let placeArray = [];
let img, font;
let mouseP = [];
let nuit = true;
let predict = [];
let locs;
let [m, n] = [
  [],
  []
];
let stage = -1;
backgroundColor = [255, 255, 255, 60];
cityHabitText = [255, 255, 20, 50];
// text habit city
cityTextFill = [255, 255, 0, 100];
// circles habit city
cityHabitFill = [100, 0, 0, 10];
parcoursCirclesFill = [0, 0, 110, 50];
rightTextBlue = [0, 0, 150, 80];
rightTextRed = [150, 0, 0, 100];
cityHighlight = rightTextRed;
city = [0, 0, 180, 20];
parcoursStroke = [200, 200, 20, 80];
parcoursFill = [130, 10, 10, 180];
innerCercleS = [50, 0, 100, 80];
navBar = [30, 50, 150, 100];

function preload() {
  table = loadTable("assets/e5.csv", "csv", "header");
  // font = loadFont('assets/SpaceMono-Regular.ttf');
  // font = loadFont('assets/iosevka-regular.ttf')
  font = loadFont('assets/AndaleMono.ttf');
  sound = loadSound("assets/click.m4a");

}

function setup() {
  masterVolume(0.2)
  textFont(font);
  // noCursor();
  sound.play();
  // get information from tables
  for (let e = 0; e < 210; e++) {
    let m = split(table.getString(e, 1), ",");
    let str = split(table.getString(e, 5), ",")[0];
    str = str.split(":")[0];
    let point = {
      n: split(table.getString(e, 0), ","),
      x: split(table.getString(e, 1), ","),
      y: split(table.getString(e, 2), ","),
      place: split(table.getString(e, 3), ",")[0],
      city: split(table.getString(e, 6), ",")[0],
      date: split(table.getString(e, 4), ","),
      time: split(table.getString(e, 5), ","),
      hour: str,
      size: Math.random() * 20
    }
    locss.push(point);
    let mm = point.city;
    let nn = point.place;
    // city & place names without duplites
    cityA.indexOf(mm) === -1 ? cityA.push(mm) : "";
    placeA.indexOf(nn) === -1 ? placeA.push(nn) : "";
  }
  createCanvas(windowWidth, windowHeight);

  // calculate data x-y range
  let [minx, maxx, miny, maxy] = [Infinity, -Infinity, Infinity, -Infinity];
  locss.forEach(point => {
    point.x > maxx ? maxx = point.x : ""
    point.y > maxy ? maxy = point.y : ""
    point.y < miny ? miny = point.y : ""
    point.x < minx ? minx = point.x : ""
  })
  // MAP TO SCREEN
  if (height > width) {
    locss.map(point => {
      point.x = map(point.x, minx, maxx, width * 0.9 - 50, width * 0.1 + 100);
      point.y = map(point.y, miny, maxy, height * 0.3, height * 0.91);
    })
  } else {
    locss.map(point => {
      point.x = map(point.x, minx, maxx, width * 0.9 - 100, width * 0.1 + 100);
      point.y = map(point.y, miny, maxy, height * 0.23 + 50, height * 0.9 - 50);
    })
  }

  locs = locss.slice(0, 1);

  for (let i = 0; i < cityA.length; i++) {
    cityArray[i] = locs.filter(obj => obj.city === cityA[i]);
  }
  for (let i = 0; i < placeA.length; i++) {
    placeArray[i] = locs.filter(obj => obj.place === placeA[i]);
  }
  // 3rd arrays with items sorted by frequency
  m = [...cityArray];
  m = m.sort((a, b) => (b.length - a.length));
  n = [...placeArray];
  n = n.sort((a, b) => (b.length - a.length));
  //fake predict
  // for(let i =0;i<locss.length;i++){
  //   let t = {
  //     x:locss[i].x+random(-1,1)*(locss.length-i),
  //     y:locss[i].x+random(-1,1)*(locss.length-i)
  //   }
  //   predict.push(t);
  // }
  // mouseY = height;
  // mouseX = 0;
}

function sizeT(n) {
  let tSmall = 15;
  let tMid = 30;
  let tInt = 40;
  let scl = 1.2;
  if (n === 0) {
    if (height > width) {
      return tSmall * scl;
    }
    return tSmall;
  }
  if (n === 1) {
    if (height > width) {
      return tMid * scl;
    }
    return tMid;
  }
  if (n === -1) {
    if (height > width) {
      return tInt * scl;
    }
    return tInt;
  }
  if (n === -2) {
    if (height > width) {
      return tInt / 1.5;
    }
    return tInt / 1.5;
  }
}

function draw() {
  // splice array, create cityArray&placeArray
  locs = (abs(mouseX - pmouseX) > 0 || abs(mouseY - pmouseY) > 0) && stage === 0 ? Choose(locss) : locs;
  if (abs(mouseX - pmouseX) > 0 || abs(mouseY - pmouseY) > 0) {
    // 2nd arrays with frequency
    for (let i = 0; i < cityA.length; i++) {
      cityArray[i] = locs.filter(obj => obj.city === cityA[i]);
    }
    for (let i = 0; i < placeA.length; i++) {
      placeArray[i] = locs.filter(obj => obj.place === placeA[i]);
    }
    // 3rd arrays with items sorted by frequency
    m = [...cityArray];
    m = m.sort((a, b) => (b.length - a.length));
    n = [...placeArray];
    n = n.sort((a, b) => (b.length - a.length));
  }
  // mode nuit et jour
  // if(locs[locs.length-1].hour>19||locs[locs.length-1].hour<8){
  //   nuit = true;
  // }else{
  //   nuit = false;
  // }
  // switch color
  scolor(nuit);
  let vmin;
  width > height ? vmin = height : vmin = width;
  background(backgroundColor);
  // Texts
  // info text Right
  if (locs) {
    const top = sizeT(-1) * 1.5;
    const left = width - sizeT(-1) * 0.7;
    push();
    strokeWeight(0);
    textAlign(RIGHT);
    console.log()
    if (locs.length < 50) {
      // console.log(m);
      textSize(sizeT(1) * 1.5);
      fill(rightTextBlue);
      text("Data of Jane Joe", left, top + Math.random());
      textSize(sizeT(0) * 1.5);
      fill(rightTextRed);
      text("From 03/07/18 to 23/07/18", left, top + sizeT(-1) + Math.random());
      // textSize(sizeT(1));
      // fill(rightTextBlue);
      // text("We believe you live in:",left,top+sizeT(-1)*2+Math.random());
      // fill(rightTextRed);
      // textSize(sizeT(0)*1.5);
      // text(cityA[Math.floor(random(5,20))],left,top+sizeT(-1)*3+Math.random());
    } else {
      textSize(sizeT(1) * 1.5);
      fill(rightTextBlue);
      text("Data of Jane Joe", left, top + Math.random());
      textSize(sizeT(0) * 1.5);
      fill(rightTextRed);
      text("From 03/07/18 to 23/07/18", left, top + sizeT(-1) + Math.random());
      // textSize(sizeT(1));
      // fill(rightTextBlue);
      // text("Algorithm thinks she live in:", left, top + sizeT(-1) * 2 + Math.random());
      // fill(rightTextRed);
      // textSize(sizeT(0) * 1.5);
      // text(m[0][0].place, left, top + sizeT(-1) * 3 + Math.random());
      // textSize(sizeT(1));
      // fill(rightTextBlue);
      // text("Her secondary residence is:", left, top + sizeT(-1) * 4 + Math.random());
      // textSize(sizeT(0) * 1.5);
      // fill(rightTextRed);
      // text(m[1][0].place, left, top + sizeT(-1) * 5 + Math.random());
    }
    // date time Left
    textAlign(LEFT);
    fill(rightTextRed[0], rightTextRed[1], rightTextRed[2], Math.random() * 1000);
    textSize(sizeT(1) * 1.4)
    text(locs[locs.length - 1].date + "\n" + locs[locs.length - 1].time, 15, height * 0.82);
    textSize(sizeT(0));
    // text("Total facebook connections:" + locs[locs.length - 1].n, 15, height * 0.82 + sizeT(-1) * 2.3 + Math.random() * 2);

    // provocative sentences
    if (mouseX > width * 0.4) {
      fill(rightTextRed[0], rightTextRed[1], rightTextRed[2], Math.random() * 1000);
      text("Each time you connect,\nFacebook knows where you are", 15, height * 0.82 + sizeT(-1) * 3 + Math.random() * 2);
    }
    pop();
    // Left City List
    if (m.length > 10) {
      for (let i = 0; i < m.length; i++) {
        if (!m[i][0] || i > 4) {
          continue
        }
        // console.log(m[i][0].city)
        if (locs[locs.length - 1].city == m[i][0].city) {
          fill(cityHighlight);
          stroke(cityHighlight);
        } else {
          fill(city);
          stroke(city);

        }
        textSize(sizeT(0) * 1.2);
        if (height > width) {
          textSize(10);
        }
        text(m[i][0].city + ": " + m[i].length + " ", 15, 45 + i * sizeT(-2));
      }
    }
    //  left place list
    // if (n.length > 10) {
    //   for (let i = 0; i < n.length; i++) {
    //     if (!n[i][0] || i > 2) {
    //       continue
    //     }
    //     if (locs[locs.length - 1].place == n[i][0].place) {
    //       fill(cityHighlight);
    //       stroke(cityHighlight);
    //     } else {
    //       fill(city);
    //       stroke(city);
    //     }
    //     text(n[i][0].place + " " + n[i].length + " ", 15, height * 0.85 - sizeT(-1) * 5 + i * sizeT(-2));
    //   }
    // }
  }
  // LINES, CIRCLES
  beginShape();
  fill(0, 0);
  strokeWeight(2.5 - Math.random() * 2);
  // color stroke
  // dynamic
  nuit ? stroke(parcoursStroke[0], parcoursStroke[1] + Math.random() * 200, parcoursStroke[2], parcoursStroke[3]) : stroke(parcoursStroke[0], parcoursStroke[1] - Math.random() * 200, parcoursStroke[2], parcoursStroke[3]);
  let x = 0;
  let y = 0;
  for (let i = 0; i < locs.length; i++) {
    vertex(locs[i].x, locs[i].y);
    // get No. of this city
    let d = cityA.indexOf(locs[i].city);
    // draw parcours points
    push();
    noStroke();
    // color blue parcours circles 
    nuit ? fill(parcoursCirclesFill[0], parcoursCirclesFill[1], parcoursCirclesFill[2] - Math.random() * 10, parcoursCirclesFill[3]) : fill(parcoursCirclesFill[0], parcoursCirclesFill[1], parcoursCirclesFill[2] + Math.random() * 10, parcoursCirclesFill[3]);
    ellipse(locs[i].x, locs[i].y, 10 + Math.random() * 10 + locs[i].size);
    textSize(sizeT(0) + Math.random() / 2);
    textAlign(CENTER);
    // Draw frequented cities
    if (cityArray[d].length > 4) {
      fill(cityHabitFill);
      let r = constrain(cityArray[d].length * 8, 0, 300) + random(-10, 10) * cityArray[d].length / 1.3;
      if (cityArray[d].length > 30) {
        fill(cityHabitFill[0], cityHabitFill[1], cityHabitFill[2], cityHabitFill[3] / 5);
        r = constrain(cityArray[d].length * 8, 0, 300) + random(-10, 10) * cityArray[d].length / 4;
      }
      ellipse(cityArray[d][0].x, cityArray[d][0].y, r);
      // invert
      nuit ? fill(cityHabitText[0] + cityArray[d].length * 1, cityHabitText[1] + cityArray[d].length * 5, cityHabitText[2], cityHabitText[3]) : fill(cityHabitText[0] + cityArray[d].length * 1, cityHabitText[1] + cityArray[d].length * 5, cityHabitText[2], cityHabitText[3]);
      textSize(constrain(cityArray[d].length * 1.8, 10, 45));
      cityArray[d][0].y > height / 2 ? text(locs[i].city + " ", cityArray[d][0].x, cityArray[d][0].y - cityArray[d].length) : text(locs[i].city + " ", cityArray[d][0].x, cityArray[d][0].y + cityArray[d].length * 4 + Math.random() * 2);
    }
    pop();
    push();
    nuit ? stroke(innerCercleS[0], innerCercleS[1] - Math.random() * 155, innerCercleS[2], innerCercleS[3]) : stroke(innerCercleS[0], innerCercleS[1] + Math.random() * 155, innerCercleS[2], innerCercleS[3]);
    ellipse(locs[i].x, locs[i].y, 10 + Math.random() * 5);
    pop();
  }
  endShape();
  push();
  // on Circle text
  fill(cityTextFill);
  textAlign(CENTER);
  ellipse(locs[locs.length - 1].x, locs[locs.length - 1].y, 50 - Math.random() * 25);
  fill(parcoursFill);
  noStroke();
  textSize(sizeT(0) * 1.2);
  text(locs[locs.length - 1].place, locs[locs.length - 1].x, locs[locs.length - 1].y + sizeT(-1) * 1.5);
  pop();
  // push();
  // fill(255,0,0);
  // ellipse(predict[locs.length-1].x,predict[locs.length-1].y,75-random(25));
  // pop();

  // bar de navigation
  if (height > width) {
    push();
    stroke(0, 0);
    fill(navBar);
    rect(width - 15, mouseY, 15, height - mouseY);
    pop();
  } else {
    push();
    stroke(0, 0);
    fill(navBar);
    rect(0, height - 15, mouseX, 15);
    pop();
  }
  // mouseX>50?stage=1:stage=0;
  // console.log(stage);
  stageControl();


}

const Choose = (array) => {
  let e = Math.floor(constrain(map(mouseX, 0, width, 0, array.length), 0, array.length)) + 1;
  if (height > width) {
    e = Math.floor(constrain(map(height - mouseY, 0, height, 0, array.length), 0, array.length)) + 1;
  }
  if (ee != e) {
    sound.rate(1 + Math.random() / 100);
    sound.play();
    ee = e;
  }
  return array.slice(0, e);
}
document.touchmove = function (n) {
  n.preventDefault();
}