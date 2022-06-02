const submit_button = document.getElementById("submit");
const next_button = document.getElementById("next-button");
const prev_button = document.getElementById("prev-button");
const reset_button = document.getElementById("reset-button");
const formx1 = document.getElementById("x1");
const formy1 = document.getElementById("y1");
const formx2 = document.getElementById("x2");
const formy2 = document.getElementById("y2");
const errorx1 = document.getElementById("error-x1");
const errorx2 = document.getElementById("error-x2");
const errory1 = document.getElementById("error-y1");
const errory2 = document.getElementById("error-y2");
// get the canvas

let canvas = document.getElementById("canvas");
// get the context
let ctx = canvas.getContext("2d");
const height = 600;
const width = 1200;
canvas.height = height;
canvas.width = width;

const chosen_color = "green";
const possible_color = "blue";
// determine the number of divisions based on the distance between the two points
const divisions = 45;
const MAXX = 88;
const MINX = -100;
const MAXY = 44;
const MINY = 0;
const grid_color = "white";
const originx = 45;
const originy = 23;
const block_size = height / divisions;

// define the set of coordinates depict them as 2-d vectors
let point1 = [];
let point2 = [];
let decision_parameter;
let dp = [];
// fix the heights of the canvas
let slope = 0;
let currx, curry;
let dx, dy;
let last_move_direction = "";
let valid = 1;

// let submit_button = document.getElementById("submit");
// store the number of times next is called
let times_next_called = 0;

formx1.onchange = function () {
  let x1 = formx1.value;
  if (x1 < -45 || x1 > 44) {
    valid = 0;
    formx1.style.border = "1px solid red";
    errorx1.innerHTML = "x should be between " + "-45" + " and " + "44";
  } else {
    valid = 1;
    formx1.style.border = "none";
    errorx1.innerHTML = "";
  }
};
formy1.onchange = function () {
  let y1 = formy1.value;
  if (y1 < -23 || y1 > 21) {
    valid = 0;
    formy1.style.border = "1px solid red";
    errory1.innerHTML = "y should be between " + "-23" + " and " + "21";
  } else {
    valid = 1;
    formy1.style.border = "none";

    errory1.innerHTML = "";
  }
};
formx2.onchange = function () {
  let x2 = formx2.value;
  if (x2 < -45 || x2 > 44) {
    formx2.style.border = "1px solid red";
    valid = 0;
    errorx2.innerHTML = "x should be between " + "-45" + " and " + "44";
  } else {
    valid = 1;
    formx2.style.border = "none";
   
    errorx2.innerHTML = "";
  }
};
formy2.onchange = function () {
  let y2 = formy2.value;
  if (y2 < -23 || y2 > 21) {
    formy2.style.border = "1px solid red";
    valid = 0;
    errory2.innerHTML = "y should be between " + "-23" + " and " + "21";
  } else {
    valid = 1;
    formy2.style.border = "none";
  
    errory2.innerHTML = "";
  }
};
function makeAxis() {
  let maxx = (MAXX / 2 + 1 + 0.5) * block_size;
  let maxy = height - (MAXY / 2 + 1 + 0.5) * block_size;
  let miny = height - (MINY - 1 + 0.5) * block_size;
  let mxx = (MAXX + 1 + 0.5) * block_size;
  let mnx = (MINX - 1 + 0.5) * block_size;
  let mxy = height - (MAXY + 1 + 0.5) * block_size;
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "red";
  ctx.moveTo(maxx, miny);
  ctx.lineTo(maxx, mxy);
  ctx.stroke();
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "red";
  ctx.moveTo(mnx, maxy);
  ctx.lineTo(mxx, maxy);
  ctx.stroke();
}
function setParameters() {
  // get  & set the coordinates from the input form
  let x1 = Number(document.getElementById("x1").value);
  let y1 = Number(document.getElementById("y1").value);
  let x2 = Number(document.getElementById("x2").value);
  let y2 = Number(document.getElementById("y2").value);

  x1 = x1 + Number(originx);
  y1 = y1 + Number(originy);
  x2 = x2 + Number(originx);
  y2 = y2 + Number(originy);

  point1 = [x1, y1];
  point2 = [x2, y2];
  flag = 1;
  dy = Math.abs(y2 - y1);
  dx = Math.abs(x2 - x1);
  currx = point1[0];
  curry = point1[1];
  if (point1[0] == point2[0]) {
    if (point1[1] > point2[1]) slope = Number.MIN_SAFE_INTEGER;
    else slope = Number.MAX_SAFE_INTEGER;
  } else {
    slope = (point2[1] - point1[1]) / (point2[0] - point1[0]);
    if (slope > 1) {
      // set the parameter
      decision_parameter = 2 * dx - dy;
    } else if (slope >= 0 && slope <= 1) {
      decision_parameter = 2 * dy - dx;
    } else if (slope >= -1 && slope < 0) {
      decision_parameter = 2 * Math.abs(dy) - dx;
    } else if (slope < -1) {
      decision_parameter = 2 * Math.abs(dx) - Math.abs(dy);
    }
  }
  // dp.push(decision_parameter);
  return;
}

function highlight(x, y, color) {
  let X = (x + 0.5) * block_size;
  let Y = height - (y + 0.5) * block_size;
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.fillRect(X, Y, height / (2 * divisions), height / (2 * divisions));
  ctx.fillRect(X, Y, -(height / (2 * divisions)), -(height / (2 * divisions)));
  ctx.fillRect(X, Y, -(height / (2 * divisions)), height / (2 * divisions));
  ctx.fillRect(X, Y, height / (2 * divisions), -(height / (2 * divisions)));
  ctx.stroke();
}

function drawGrid() {
  // parameters set by now
  // draw the grid
  ctx.beginPath();
  ctx.strokeStyle = "grey";
  ctx.lineWidth = 0.5;
  for (var i = 0; i <= width; i += height / divisions) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, height);
  }

  for (var i = 0; i <= width; i += height / divisions) {
    ctx.moveTo(0, i);
    ctx.lineTo(width, i);
  }
  ctx.stroke();

  let X1 = (point1[0] + 0.5) * block_size;
  let Y1 = height - (point1[1] + 0.5) * block_size;
  let X2 = (point2[0] + 0.5) * block_size;
  let Y2 = height - (point2[1] + 0.5) * block_size;
  ctx.beginPath();
  ctx.arc(X1, Y1, 1, 0, 2 * Math.PI, false);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "red";
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(X2, Y2, 1, 0, 2 * Math.PI, false);
  ctx.strokeStyle = "red";
  ctx.lineWidth = 5;
  ctx.stroke();
  makeAxis();

  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "yellow";
  ctx.moveTo(X1, Y1);
  ctx.lineTo(X2, Y2);
  ctx.stroke();
}

function handleNext() {
  dp.push(decision_parameter);
  // check for the cases
  if (slope == Number.MAX_SAFE_INTEGER) {
    highlight(currx + 1, curry + 1, "red");
    curry += 1;
    highlight(currx, curry, chosen_color);
  } else if (slope == Number.MIN_SAFE_INTEGER) {
    highlight(currx + 1, curry - 1, "red");
    curry -= 1;
    highlight(currx, curry, chosen_color);
  } else if (slope >= 0 && slope <= 1) {
    if (decision_parameter < 0) {
      last_move_direction = "east";
      decision_parameter = decision_parameter + 2 * dy;
      // moving east
      // mark the moving north east as red
      highlight(currx + 1, curry + 1, "red");
      // move east , increment x
      currx += 1;
      // y remains the same
      // highlight the choice
      highlight(currx, curry, chosen_color);
    } else {
      last_move_direction = "north-east";
      // we move north east
      // mark east as red
      highlight(currx + 1, curry, "red");
      // move north east
      currx += 1;
      curry += 1;
      // highlight the choice
      highlight(currx, curry, chosen_color);
      // update the decision parameter
      decision_parameter = decision_parameter + 2 * dy - 2 * dx;
    }
  } else if (slope > 1) {
    // move north or north east
    if (decision_parameter < 0) {
      last_move_direction = "north";
      decision_parameter = decision_parameter + 2 * dx;
      // move north
      highlight(currx + 1, curry + 1, "red");
      curry += 1;
      highlight(currx, curry, chosen_color);
    } else {
      // moving north east
      last_move_direction = "north-east";
      highlight(currx, curry + 1, "red");
      curry += 1;
      currx += 1;
      highlight(currx, curry, chosen_color);
      decision_parameter = decision_parameter + 2 * dx - 2 * dy;
    }
  } else if (slope >= -1 && slope < 0) {
    // choice to move east or sout east
    // dx is positive and dy is negative
    if (decision_parameter < 0) {
      // move east
      last_move_direction = "east";
      highlight(currx + 1, curry - 1, "red");
      currx += 1;
      highlight(currx, curry, chosen_color);
      decision_parameter = decision_parameter + 2 * Math.abs(dy);
    } else {
      decision_parameter = decision_parameter + 2 * Math.abs(dy) - 2 * dx;
      // move south east
      last_move_direction = "south-east";
      highlight(currx + 1, curry, "red");
      curry -= 1;
      currx += 1;
      highlight(currx, curry, chosen_color);
    }
  } else if (slope == Number.MIN_SAFE_INTEGER) {
  } else {
    if (decision_parameter < 0) {
      last_move_direction = "south";
      decision_parameter = decision_parameter + 2 * Math.abs(dx);
      // move south
      highlight(currx + 1, curry - 1, "red");
      curry -= 1;
      highlight(currx, curry, chosen_color);
    } else {
      last_move_direction = "south-east";
      decision_parameter =
        decision_parameter + 2 * Math.abs(dx) - 2 * Math.abs(dy);
      // move south east
      highlight(currx, curry - 1, "red");
      currx += 1;
      curry -= 1;
      highlight(currx, curry, chosen_color);
    }
  }
}
function hadndlePrevious() {}
submit_button.addEventListener("click", (event) => {
  event.preventDefault();
  times_next_called = 0;
  last_move_direction = "";
  dp = [];
  point1 = [];
  point2 = [];
  slope = 0;
  currx = 0;
  curry = 0;
  decision_parameter = 0;
  ctx.beginPath();
  ctx.clearRect(0, 0, width, height);
  setParameters();
  if (valid == 1) drawGrid();
});

next_button.addEventListener("click", () => {
  if (flag) {
    if (times_next_called == 0) {
      if (slope == Number.MAX_SAFE_INTEGER) {
        highlight(currx, curry, chosen_color);
        highlight(currx + 1, curry + 1, possible_color);
        highlight(currx, curry + 1, possible_color);
      } else if (slope == Number.MIN_SAFE_INTEGER) {
        highlight(currx, curry, chosen_color);
        highlight(currx + 1, curry - 1, possible_color);
        highlight(currx, curry - 1, possible_color);
      } else if (slope >= 0 && slope <= 1) {
        // if slope is greater than one then , options of moving is E and NE
        // x+1 , y+1 or x+1 ,
        highlight(currx, curry, chosen_color);
        // North East
        highlight(currx + 1, curry + 1, possible_color);
        // east
        highlight(currx + 1, curry, possible_color);
      } else if (slope > 1) {
        highlight(currx, curry, chosen_color);
        highlight(currx + 1, curry + 1, possible_color);
        highlight(currx, curry + 1, possible_color);
      } else if (slope >= -1 && slope < 0) {
        highlight(currx, curry, chosen_color);
        highlight(currx + 1, curry - 1, possible_color);
        highlight(currx + 1, curry, possible_color);
      } else if (slope < -1) {
        // possible option is to move south or movee south east
        highlight(currx, curry, chosen_color);
        highlight(currx + 1, curry - 1, possible_color);
        highlight(currx, curry - 1, possible_color);
      }
    } else if (times_next_called % 2 == 1) {
      // mark the chosen path pixel
      if (slope >= 0 && (currx < point2[0] || curry < point2[1])) {
        handleNext();
      } else if (slope < 0 && (currx < point2[0] || curry > point2[1])) {
        handleNext();
      }
    } else if (times_next_called % 2 == 0) {
      // highlight the possible pixels

      if (
        slope >= 0 &&
        slope <= 1 &&
        (currx < point2[0] || curry < point2[1])
      ) {
        // if slope is greater than one then , options of moving is E and NE
        // x+1 , y+1 or x+1 ,
        highlight(currx, curry, chosen_color);
        // North East
        highlight(currx + 1, curry + 1, possible_color);
        // East
        highlight(currx + 1, curry, possible_color);
      } else if (
        (slope == Number.MAX_SAFE_INTEGER || slope > 1) &&
        (currx < point2[0] || curry < point2[1])
      ) {
        highlight(currx, curry, chosen_color);
        // north east
        highlight(currx + 1, curry + 1, possible_color);
        // north
        highlight(currx, curry + 1, possible_color);
      } else if (
        (currx < point2[0] || curry > point2[1]) &&
        slope >= -1 &&
        slope < 0
      ) {
        // we have the option to move east or south east
        highlight(currx, curry, chosen_color);
        // east move krna show kro
        highlight(currx + 1, curry, possible_color);
        // south east move krna show kro
        highlight(currx + 1, curry - 1, possible_color);
      } else if (
        (slope == Number.MIN_SAFE_INTEGER || slope < -1) &&
        (currx < point2[0] || curry > point2[1])
      ) {
        // possible option is to move south or movee south east
        highlight(currx, curry, chosen_color);
        highlight(currx + 1, curry - 1, possible_color);
        highlight(currx, curry - 1, possible_color);
      }
    }
    // increment the counter
    let X1 = (point1[0] + 0.5) * block_size;
    let Y1 = height - (point1[1] + 0.5) * block_size;
    let X2 = (point2[0] + 0.5) * block_size;
    let Y2 = height - (point2[1] + 0.5) * block_size;

    ctx.beginPath();
    ctx.arc(X1, Y1, 1, 0, 2 * Math.PI, false);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(X2, Y2, 1, 0, 2 * Math.PI, false);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "yellow";
    ctx.moveTo(X1, Y1);
    ctx.lineTo(X2, Y2);
    ctx.stroke();
    times_next_called += 1;
  }
});

prev_button.addEventListener("click", () => {
  if (times_next_called > 0) {
    if (times_next_called % 2 == 1) {
      // last move was highlighting , undo the highlighting and reset the coordinates
      let delx, delx1, dely1, dely;
      if (slope == Number.MAX_SAFE_INTEGER) {
        // would have highlighted north east and north undo it
        delx = currx;
        delx1 = currx + 1;
        dely1 = curry + 1;
        dely = curry + 1;
      } else if (slope == Number.MIN_SAFE_INTEGER) {
        delx = currx;
        delx1 = currx + 1;
        dely1 = curry - 1;
        dely = curry - 1;
      } else if (slope >= 0 && slope <= 1) {
        // east and north east undo
        delx = currx + 1;
        delx1 = currx + 1;
        dely1 = curry + 1;
        dely = curry;
      } else if (slope > 1) {
        // north and north east
        delx = currx;
        delx1 = currx + 1;
        dely1 = curry + 1;
        dely = curry + 1;
      } else if (slope >= -1 && slope < 0) {
        delx = currx + 1;
        delx1 = currx + 1;
        dely1 = curry - 1;
        dely = curry;
      } else {
        delx = currx;
        delx1 = currx + 1;
        dely1 = curry - 1;
        dely = curry - 1;
      }
      highlight(delx, dely, "black");
      highlight(delx1, dely1, "black");
    } else {
      // last move was choosing a vertex , move back to the highlighting step
      if (slope == Number.MAX_SAFE_INTEGER) {
        highlight(currx, curry, possible_color);
        highlight(currx + 1, curry, possible_color);
        curry -= 1;
      } else if (slope == Number.MIN_SAFE_INTEGER) {
        highlight(currx, curry, possible_color);
        highlight(currx + 1, curry, possible_color);
        curry += 1;
      } else if (slope >= 0 && slope <= 1 && dp.length > 0) {
        // east and north east are the only options
        let last = dp.pop();
        if (last < 0) {
          highlight(currx, curry, possible_color);
          highlight(currx, curry + 1, possible_color);
          currx -= 1;
        } else if (last >= 0) {
          highlight(currx, curry, possible_color);
          highlight(currx, curry - 1, possible_color);
          curry -= 1;
          currx -= 1;
        }
      } else if (slope > 1 && dp.length > 0) {
        let last = dp.pop();
        if (last < 0) {
          highlight(currx, curry, possible_color);
          highlight(currx + 1, curry, possible_color);
          curry -= 1;
        } else if (last >= 0) {
          highlight(currx, curry, possible_color);
          highlight(currx - 1, curry, possible_color);
          curry -= 1;
          currx -= 1;
        }
      } else if (slope >= -1 && slope < 0 && dp.length > 0) {
        let last = dp.pop();
        if (last >= 0) {
          highlight(currx, curry, possible_color);
          highlight(currx, curry + 1, possible_color);
          curry += 1;
          currx -= 1;
        } else if (last < 0) {
          highlight(currx, curry, possible_color);
          highlight(currx, curry - 1, possible_color);
          currx -= 1;
        }
      } else if (dp.length > 0) {
        // south ya south east
        let last = dp.pop();
        if (last >= 0) {
          highlight(currx, curry, possible_color);
          highlight(currx - 1, curry, possible_color);
          curry += 1;
          currx -= 1;
        } else if (last < 0) {
          highlight(currx, curry, possible_color);
          highlight(currx + 1, curry, possible_color);
          curry += 1;
        }
      }
    }
    times_next_called -= 1;
    let X1 = (point1[0] + 0.5) * block_size;
    let Y1 = height - (point1[1] + 0.5) * block_size;
    let X2 = (point2[0] + 0.5) * block_size;
    let Y2 = height - (point2[1] + 0.5) * block_size;

    ctx.beginPath();
    ctx.arc(X1, Y1, 1, 0, 2 * Math.PI, false);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(X2, Y2, 1, 0, 2 * Math.PI, false);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "yellow";
    ctx.moveTo(X1, Y1);
    ctx.lineTo(X2, Y2);
    ctx.stroke();
  }
});

reset_button.addEventListener("click", () => {
  dp = [];
  flag = 0;
  last_move_direction = "";
  times_next_called = 0;
  point1 = [];
  point2 = [];
  slope = 0;
  currx = 0;
  curry = 0;
  decision_parameter = 0;
  ctx.beginPath();
  ctx.clearRect(0, 0, width, height);
});