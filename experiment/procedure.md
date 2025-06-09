This simulation demonstrates how computers render lines on a pixel grid using Bresenham's Line Rasterization Algorithm. You'll see the step-by-step process of how the algorithm decides which pixels to illuminate to create a line.

### Step-by-Step Procedure

1. **Setting Up the Line:**

   - Enter the coordinates for two points that define your line:
     - Point 1 (Start Point): Enter x and y coordinates
     - Point 2 (End Point): Enter x and y coordinates
   - Coordinate ranges:
     - x-coordinates: -45 to 43
     - y-coordinates: -23 to 21
   - Click "Submit" to initialize the simulation

2. **Understanding the Display:**

   - The canvas shows a pixel grid with:
     - A yellow line connecting your points
     - Red dots marking the start and end points
     - Grid lines for reference
   - The left panel shows:
     - Your input coordinates
     - Algorithm information (decision parameter and pixel direction)
     - Step-by-step messages
   - The right panel displays the sequence of chosen pixel coordinates

3. **Running the Simulation:**

   - Click "Next" to proceed through the algorithm steps
   - At each step, you'll observe:
     1. **Candidate Pixels:**
        - Blue highlights show possible next pixels
        - These represent the algorithm's choices
     2. **Selected Pixel:**
        - Green highlight shows the chosen pixel
        - Red highlight shows the rejected option
     3. **Algorithm Information:**
        - Current decision parameter value
        - Direction of the chosen pixel (East, North-East, etc.)
     4. **Step Message:**
        - Explains the current decision
        - Shows the coordinates of the chosen pixel

4. **Understanding the Algorithm:**

   - Watch how the decision parameter influences pixel selection
   - Observe how the algorithm chooses between:
     - Moving horizontally (East)
     - Moving diagonally (North-East, South-East)
     - Moving vertically (North, South)
   - The decision parameter helps determine which pixel is closer to the ideal line

5. **Navigation Controls:**

   - "Next": Move forward through the algorithm steps
   - "Prev": Go back to the previous step
   - "Reset": Start over with new coordinates

6. **Observing Results:**
   - The right panel shows the complete path of chosen pixels
   - Each step's message explains the reasoning
   - The algorithm information helps understand the decision-making process
   - The final result should show a continuous line of pixels approximating your input line

### Tips for Better Understanding

- Start with simple lines (horizontal or vertical) to understand basic movement
- Try diagonal lines to see how the algorithm handles different slopes
- Pay attention to the decision parameter values and how they change
- Notice how the algorithm maintains visual continuity of the line
- Use the "Prev" button to review important steps

### Expected Outcomes

- A continuous line of pixels connecting your start and end points
- Smooth visual appearance despite the discrete nature of pixels
- Efficient pixel selection that minimizes deviation from the ideal line
- Clear understanding of how the algorithm makes decisions at each step
