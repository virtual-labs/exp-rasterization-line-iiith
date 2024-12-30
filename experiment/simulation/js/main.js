"use-strict";
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
const EMPTY = "";
// get the canvas
const canvas = document.getElementById("canvas");
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
const LEFT = -45;
const RIGHT = 44;
const TOP = 21;
const BOTTOM = -23;
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
let valid = true;
// let submit_button = document.getElementById("submit");
// store the number of times next is called
let times_next_called = 0;

function validateForm(form, min, max, errorClass) {
  const value = form.value;
  if (value < min || value > max) {
    form.classList.add("highlight-error");
    errorClass.innerHTML = `value should be between ${min} and ${max}`;
  } else {
    valid = true;
    form.classList.remove("highlight-error");
    errorClass.innerHTML = EMPTY;
  }
}
// formx1.onchange = validateForm(formx1, formx1.value, LEFT, RIGHT, errorx1);
formx1.onchange = () => validateForm(formx1, LEFT, RIGHT, errorx1);
formy1.onchange = () => validateForm(formy1, BOTTOM, TOP, errory1);
formx2.onchange = () => validateForm(formx2, LEFT, RIGHT, errorx2);
formy2.onchange = () => validateForm(formy2, BOTTOM, TOP, errory2);
function makeAxis() {
  const maxx = (MAXX / 2 + 1 + 0.5) * block_size;
  const maxy = height - (MAXY / 2 + 1 + 0.5) * block_size;
  const miny = height - (MINY - 1 + 0.5) * block_size;
  const mxx = (MAXX + 1 + 0.5) * block_size;
  const mnx = (MINX - 1 + 0.5) * block_size;
  const mxy = height - (MAXY + 1 + 0.5) * block_size;
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
function getSlopeLine() {
  if (point1[0] === point2[0]) {
    if (point1[1] > point2[1]) {
      return Math.MIN_SAFE_INTEGER;
    } else {
      return Math.MAX_SAFE_INTEGER;
    }
  } else {
    return (point2[1] - point1[1]) / (point2[0] - point1[0]);
  }
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
  display_canvas = true;
  dy = Math.abs(y2 - y1);
  dx = Math.abs(x2 - x1);
  currx = point1[0];
  curry = point1[1];
  slope = getSlopeLine();

  if (slope !== Math.MIN_SAFE_INTEGER && slope !== Math.MAX_SAFE_INTEGER) {
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
  const X = (x + 0.5) * block_size;
  const Y = height - (y + 0.5) * block_size;
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.fillRect(X, Y, height / (2 * divisions), height / (2 * divisions));
  ctx.fillRect(X, Y, -(height / (2 * divisions)), -(height / (2 * divisions)));
  ctx.fillRect(X, Y, -(height / (2 * divisions)), height / (2 * divisions));
  ctx.fillRect(X, Y, height / (2 * divisions), -(height / (2 * divisions)));
  ctx.stroke();
}
function drawGrid() {
  // Clear the canvas before drawing
  ctx.clearRect(0, 0, width, height);

  // Draw the grid lines
  ctx.beginPath();
  ctx.strokeStyle = "grey";
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= width; i += height / divisions) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, height);
  }

  for (let i = 0; i <= height; i += height / divisions) {
    ctx.moveTo(0, i);
    ctx.lineTo(width, i);
  }
  ctx.stroke();

  // Draw point1
  const X1 = (point1[0] + 0.5) * block_size;
  const Y1 = height - (point1[1] + 0.5) * block_size;
  ctx.beginPath();
  ctx.arc(X1, Y1, 5, 0, 2 * Math.PI, false); // Increase arc radius for visibility
  ctx.fillStyle = "red";
  ctx.fill();

  // Display coordinates of point1
  ctx.font = "20px Arial";
  ctx.fillStyle = "yellow";
  ctx.textAlign = "left";
  ctx.fillText(
    `(${point1[0] - originx}, ${point1[1] - originy})`,
    X1 + 20,
    Y1+15
  );

  // Draw point2
  const X2 = (point2[0] + 0.5) * block_size;
  const Y2 = height - (point2[1] + 0.5) * block_size;
  ctx.beginPath();
  ctx.arc(X2, Y2, 5, 0, 2 * Math.PI, false); // Increase arc radius for visibility
  ctx.fillStyle = "red";
  ctx.fill();

  // Display coordinates of point2
  ctx.font = "20px Arial";
  ctx.fillStyle = "yellow";
  ctx.textAlign = "left";
  ctx.fillText(
    `(${point2[0] - originx}, ${point2[1] - originy})`,
    X2 + 20,
    Y2-20
  );

  // Draw line between point1 and point2
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "yellow";
  ctx.moveTo(X1, Y1);
  ctx.lineTo(X2, Y2);
  ctx.stroke();

  // Make axis markings
  makeAxis();
}




 function handleNext() {
   dp.push(decision_parameter);

   // Initialize message content
   let message = "";

   // Check for the cases
   if (slope === Number.MAX_SAFE_INTEGER) {
     highlight(currx + 1, curry + 1, "red");
     curry += 1;
     highlight(currx, curry, chosen_color);
     message = `At this step, we move to the pixel (${currx-originx}, ${curry-originy}) in the south-east direction.`;
   } else if (slope === Number.MIN_SAFE_INTEGER) {
     highlight(currx + 1, curry - 1, "red");
     curry -= 1;
     highlight(currx, curry, chosen_color);
     message = `Here, we move to the pixel (${currx-originx}, ${curry-originy}) in the north-east direction.`;
   } else if (slope >= 0 && slope <= 1) {
     if (decision_parameter < 0) {
       last_move_direction = "east";
       decision_parameter = decision_parameter + 2 * dy;
       // Moving east
       highlight(currx + 1, curry + 1, "red");
       currx += 1;
       highlight(currx, curry, chosen_color);
       message = `Proceeding eastwards, we move to (${currx-originx}, ${curry-originy}).`;
     } else {
       last_move_direction = "north-east";
       // Moving north east
       highlight(currx + 1, curry, "red");
       currx += 1;
       curry += 1;
       highlight(currx, curry, chosen_color);
       decision_parameter = decision_parameter + 2 * dy - 2 * dx;
       message = `Moving north-east, we reach (${currx-originx}, ${curry-originy}).`;
     }
   } else if (slope > 1) {
     // Move north or north east
     if (decision_parameter < 0) {
       last_move_direction = "north";
       decision_parameter = decision_parameter + 2 * dx;
       // Move north
       highlight(currx + 1, curry + 1, "red");
       curry += 1;
       highlight(currx, curry, chosen_color);
       message = `Advancing northwards, we move to (${currx-originx}, ${curry-originy}).`;
     } else {
       // Moving north east
       last_move_direction = "north-east";
       highlight(currx, curry + 1, "red");
       curry += 1;
       currx += 1;
       highlight(currx, curry, chosen_color);
       decision_parameter = decision_parameter + 2 * dx - 2 * dy;
       message = `Proceeding north-east, we move to (${currx-originx}, ${curry-originy}).`;
     }
   } else if (slope >= -1 && slope < 0) {
     // Choice to move east or south east
     // dx is positive and dy is negative
     if (decision_parameter < 0) {
       // Move east
       last_move_direction = "east";
       highlight(currx + 1, curry - 1, "red");
       currx += 1;
       highlight(currx, curry, chosen_color);
       decision_parameter = decision_parameter + 2 * Math.abs(dy);
       message = `Choosing to move east, we go to (${currx-originx}, ${curry-originy}).`;
     } else {
       decision_parameter = decision_parameter + 2 * Math.abs(dy) - 2 * dx;
       // Move south east
       last_move_direction = "south-east";
       highlight(currx + 1, curry, "red");
       curry -= 1;
       currx += 1;
       highlight(currx, curry, chosen_color);
       message = `Opting for south-east, we move to (${currx-originx}, ${curry-originy}).`;
     }
   } else if (slope === Number.MIN_SAFE_INTEGER) {
     // Handle specific case if needed
   } else {
     if (decision_parameter < 0) {
       last_move_direction = "south";
       decision_parameter = decision_parameter + 2 * Math.abs(dx);
       // Move south
       highlight(currx + 1, curry - 1, "red");
       curry -= 1;
       highlight(currx, curry, chosen_color);
       message = `Proceeding southwards, we move to (${currx-originx}, ${curry-originy}).`;
     } else {
       last_move_direction = "south-east";
       decision_parameter =
         decision_parameter + 2 * Math.abs(dx) - 2 * Math.abs(dy);
       // Move south east
       highlight(currx, curry - 1, "red");
       currx += 1;
       curry -= 1;
       highlight(currx, curry, chosen_color);
       message = `Moving south-east, we reach (${currx-originx}, ${curry-originy}).`;
     }
   }

  const observationsDiv = document.getElementById("observations-list");
  const observationItem = document.createElement("div");
  observationItem.textContent = `(${currx - originx}, ${curry - originy})`; // Correctly formatted string
   observationItem.style.color = "green";
   observationsDiv.appendChild(observationItem);
   showMessage(message);

 }

 function showMessage(message) {
   const messageDiv = document.getElementById("message-div");
   messageDiv.innerHTML = "";
   const messageItem = document.createElement("div");
   messageItem.classList.add("message-item");
   messageItem.textContent = message;
   messageDiv.appendChild(messageItem);
 }

submit_button.addEventListener("click", (event) => {
  let x1_val = document.getElementById("x1").value;
  let y1_val = document.getElementById("y1").value;
  const observationsDiv = document.getElementById("observations-list");
  observationsDiv.innerHTML = "";
  const observationItem = document.createElement("div");
  observationItem.textContent = `(${x1_val}, ${y1_val})`;
  observationItem.style.color = "green";
  observationsDiv.appendChild(observationItem);
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
  if (valid === true) {
    drawGrid()
  };
});


next_button.addEventListener("click", () => {
  if (display_canvas) {
    if (times_next_called === 0) {
      if (slope === Number.MAX_SAFE_INTEGER) {
        highlight(currx, curry, chosen_color);
        highlight(currx + 1, curry + 1, possible_color);
        highlight(currx, curry + 1, possible_color);
        showMessage(`Highlighted north-east pixel`);
      } else if (slope === Number.MIN_SAFE_INTEGER) {
        highlight(currx, curry, chosen_color);
        highlight(currx + 1, curry - 1, possible_color);
        highlight(currx, curry - 1, possible_color);
        showMessage(`Highlighted north-west pixel`);
      } else if (slope >= 0 && slope <= 1) {
        highlight(currx, curry, chosen_color);
        highlight(currx + 1, curry + 1, possible_color);
        highlight(currx + 1, curry, possible_color);
        showMessage(
          `Highlighted east and north-east pixels`
        );
      } else if (slope > 1) {
        highlight(currx, curry, chosen_color);
        highlight(currx + 1, curry + 1, possible_color);
        highlight(currx, curry + 1, possible_color);
        showMessage(
          `Highlighted north and north-east pixels`
        );
      } else if (slope >= -1 && slope < 0) {
        highlight(currx, curry, chosen_color);
        highlight(currx + 1, curry - 1, possible_color);
        highlight(currx + 1, curry, possible_color);
        showMessage(
          `Highlighted east and south-east pixels`
        );
      } else if (slope < -1) {
        highlight(currx, curry, chosen_color);
        highlight(currx + 1, curry - 1, possible_color);
        highlight(currx, curry - 1, possible_color);
        showMessage(
          `Highlighted south and south-east pixels`
        );
      }
    } else if (times_next_called % 2 === 1) {
      // Mark the chosen path pixel
      if (slope >= 0 && (currx < point2[0] || curry < point2[1])) {
        handleNext();
        showMessage(`Moved to (${currx-originx}, ${curry-originy})`);
      } else if (slope < 0 && (currx < point2[0] || curry > point2[1])) {
        handleNext();
        showMessage(`Moved to (${currx-originx}, ${curry-originy})`);
      }
    } else if (times_next_called % 2 === 0) {
      // Highlight possible pixels
      if (
        slope >= 0 &&
        slope <= 1 &&
        (currx < point2[0] || curry < point2[1])
      ) {
        highlight(currx, curry, chosen_color);
        highlight(currx + 1, curry + 1, possible_color);
        highlight(currx + 1, curry, possible_color);
        showMessage(
          `Highlighted east and north-east pixels`
        );
      } else if (
        (slope === Number.MAX_SAFE_INTEGER || slope > 1) &&
        (currx < point2[0] || curry < point2[1])
      ) {
        highlight(currx, curry, chosen_color);
        highlight(currx + 1, curry + 1, possible_color);
        highlight(currx, curry + 1, possible_color);
        showMessage(
          `Highlighted north and north-east pixels`
        );
      } else if (
        (currx < point2[0] || curry > point2[1]) &&
        slope >= -1 &&
        slope < 0
      ) {
        highlight(currx, curry, chosen_color);
        highlight(currx + 1, curry, possible_color);
        highlight(currx + 1, curry - 1, possible_color);
        showMessage(
          `Highlighted east and south-east pixels`
        );
      } else if (
        (slope === Number.MIN_SAFE_INTEGER || slope < -1) &&
        (currx < point2[0] || curry > point2[1])
      ) {
        highlight(currx, curry, chosen_color);
        highlight(currx + 1, curry - 1, possible_color);
        highlight(currx, curry - 1, possible_color);
        showMessage(
          `Highlighted south and south-east pixels`
        );
      }
    }

    // Update visualization of point1, point2, and line
    const X1 = (point1[0] + 0.5) * block_size;
    const Y1 = height - (point1[1] + 0.5) * block_size;
    const X2 = (point2[0] + 0.5) * block_size;
    const Y2 = height - (point2[1] + 0.5) * block_size;

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

    
    // showMessage(`Highlighted possible pixels in blue`);
    
  }
});


prev_button.addEventListener("click", () => {
  if (times_next_called > 0) {
    if (times_next_called % 2 === 1) {
      const observationsDiv = document.getElementById("observations-list");
      const lastChild = observationsDiv.lastChild;
      observationsDiv.removeChild(lastChild);
      // Undo highlighting from last move and reset coordinates
      let delx, delx1, dely1, dely;
      if (slope === Number.MAX_SAFE_INTEGER) {
        // Undo north-east highlighting
        delx = currx;
        delx1 = currx + 1;
        dely1 = curry + 1;
        dely = curry + 1;
      } else if (slope === Number.MIN_SAFE_INTEGER) {
        // Undo north-west highlighting
        delx = currx;
        delx1 = currx + 1;
        dely1 = curry - 1;
        dely = curry - 1;
      } else if (slope >= 0 && slope <= 1) {
        // Undo east and north-east highlighting
        delx = currx + 1;
        delx1 = currx + 1;
        dely1 = curry + 1;
        dely = curry;
      } else if (slope > 1) {
        // Undo north and north-east highlighting
        delx = currx;
        delx1 = currx + 1;
        dely1 = curry + 1;
        dely = curry + 1;
      } else if (slope >= -1 && slope < 0) {
        // Undo east and south-east highlighting
        delx = currx + 1;
        delx1 = currx + 1;
        dely1 = curry - 1;
        dely = curry;
      } else {
        // Undo south and south-east highlighting
        delx = currx;
        delx1 = currx + 1;
        dely1 = curry - 1;
        dely = curry - 1;
      }
      highlight(delx, dely, "black");
      highlight(delx1, dely1, "black");
      // Display message about undoing the move
      showMessage(
        `Undid last move: Removed (${delx - originx}, ${dely - originy})`
      );
    } else {
      // Move back to highlighting step
      if (slope === Number.MAX_SAFE_INTEGER) {
        highlight(currx, curry, possible_color);
        highlight(currx + 1, curry, possible_color);
        curry -= 1;
      } else if (slope === Number.MIN_SAFE_INTEGER) {
        highlight(currx, curry, possible_color);
        highlight(currx + 1, curry, possible_color);
        curry += 1;
      } else if (slope >= 0 && slope <= 1 && dp.length > 0) {
        // Restore east and north-east options
        const last = dp.pop();
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
        // Restore north and north-east options
        const last = dp.pop();
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
        // Restore east and south-east options
        const last = dp.pop();
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
        // Restore south and south-east options
        const last = dp.pop();
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
      // Display message about moving back to previous step
      showMessage(`Moved back to previous step: Highlighting possible pixels`);
    }
    times_next_called -= 1;

    // Update visualization of point1, point2, and line
    const X1 = (point1[0] + 0.5) * block_size;
    const Y1 = height - (point1[1] + 0.5) * block_size;
    const X2 = (point2[0] + 0.5) * block_size;
    const Y2 = height - (point2[1] + 0.5) * block_size;

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

// function showMessage(message) {
//   const messageDiv = document.getElementById("message-div");
//   const messageItem = document.createElement("div");
//   messageItem.textContent = message;
//   messageItem.classList.add("message-item");
//   messageDiv.appendChild(messageItem);
//   messageDiv.scrollTop = messageDiv.scrollHeight; // Scroll to bottom
// }


reset_button.addEventListener("click", () => {
  dp = [];
  display_canvas = false;
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

function resetWindow() {
  // Reload the current window
  window.location.reload();
}
submit_button.click();


const toggleInstructions = document.getElementById("toggle-instructions");
const procedureMessage = document.getElementById("procedure-message");

// Function to show the instructions overlay
const showInstructions = () => {
  procedureMessage.style.display = "block";
};

// Function to hide the instructions overlay
const hideInstructions = (event) => {
  // Close if click is outside the overlay or if it's the toggle button again
  if (
    !procedureMessage.contains(event.target) &&
    event.target !== toggleInstructions
  ) {
    procedureMessage.style.display = "none";
  }
};

// Attach event listeners
toggleInstructions.addEventListener("click", (event) => {
  // Toggle the visibility of the overlay
  if (procedureMessage.style.display === "block") {
    procedureMessage.style.display = "none";
  } else {
    showInstructions();
  }
  event.stopPropagation(); // Prevent immediate closure after clicking the button
});

document.addEventListener("click", hideInstructions);

// Prevent closing the overlay when clicking inside it
procedureMessage.addEventListener("click", (event) => {
  event.stopPropagation(); // Prevent the click inside from closing the overlay
});

document.addEventListener("DOMContentLoaded", function () {
  // Select the reset button
  const resetBtn = document.getElementById("reset-all-btn");

  // Function to reload the page, resetting everything to default
  function resetAllFields() {
    location.reload(); // Reload the page to reset all elements to default
  }

  // Add event listener to the reset button
  resetBtn.addEventListener("click", resetAllFields);
});