## Introduction
Line rasterization is the process of transforming continuous geometric lines into discrete pixels for digital display. This fundamental operation in computer graphics involves determining which pixels should be illuminated to best represent a line on a computer screen.

## Common Line Rasterization Algorithms

### 1. Digital Differential Analyzer (DDA)
The DDA algorithm is one of the simplest line rasterization algorithms. It works by calculating the derivatives (rates of change) of the line in both x and y directions.

#### Key Characteristics:
- Uses floating-point calculations
- Calculates derivatives of geometric lines
- Simpler to understand but computationally more expensive than Bresenham's
- Works by incrementing either x or y by 1 and calculating the other coordinate

#### Basic Steps:
1. Calculate the differences between endpoints (dx, dy)
2. Determine the number of steps (max of |dx| and |dy|)
3. Calculate increments for x and y
4. Plot pixels along the line using these increments

### 2. Bresenham's Line Algorithm
Bresenham's algorithm is widely acknowledged for its simplicity and efficiency, particularly notable for its ability to bypass floating-point calculations—an advantageous feature during times when computers struggled with such operations.

#### Algorithm Description
The algorithm is specifically tailored for scenarios where x<sub>1</sub> < x<sub>2</sub>, y<sub>1</sub> < y<sub>2</sub>, and the slope of the line lies between 0 and 1. However, its versatility extends seamlessly to other cases through symmetry and reflections.

#### Key Characteristics:
- Uses only integer arithmetic
- No floating-point calculations
- Slope of the line is a crucial parameter
- Efficient for lines with slopes between 0 and 1

### 3. Xiaolin Wu's Algorithm
Xiaolin Wu's algorithm is an advanced line rasterization algorithm that includes anti-aliasing support.

#### Key Features:
- Implements anti-aliasing for smoother lines
- Adjusts pixel intensities based on neighboring pixels
- Produces higher quality results than Bresenham's
- More computationally intensive

## Anti-Aliasing in Line Rasterization

### What is Anti-Aliasing?
Anti-aliasing is a technique used to create smooth transitions in color intensity, reducing the jagged appearance (aliasing) of lines in digital displays.

### How Anti-Aliasing Works:
1. **Pixel Intensity Adjustment**: 
   - Pixels are given varying intensities based on their distance from the ideal line
   - Creates the illusion of a smoother line

2. **Implementation Methods**:
   - **Xiaolin Wu's Approach**: 
     - Calculates the distance of each pixel from the ideal line
     - Adjusts pixel intensity based on this distance
     - Creates smooth transitions between pixels

3. **Benefits**:
   - Reduces jagged edges
   - Improves visual quality
   - Creates more realistic line representations

## Comparison of Algorithms

### DDA vs Bresenham's:
- DDA uses floating-point calculations
- Bresenham's uses only integer arithmetic
- DDA is simpler to understand
- Bresenham's is more efficient

### Bresenham's vs Xiaolin Wu's:
- Bresenham's is faster but produces jagged lines
- Xiaolin Wu's includes anti-aliasing
- Xiaolin Wu's produces smoother lines
- Bresenham's is simpler to implement

## Applications
1. Computer-aided design (CAD)
2. Video game graphics
3. Digital art and animation
4. User interface design
5. 3D to 2D projection in computer graphics

## Pseudo Code for Bresenham's Algorithm

**Input:** Two endpoints of the line, (x<sub>0</sub>, y<sub>0</sub>) & (x<sub>1</sub>, y<sub>1</sub>)

**Assumption:** The algorithm and simulation assumes that the slope of the line (m) adheres to the constraint 0 < m < 1.

<img src="images/code.png">