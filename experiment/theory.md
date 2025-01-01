## Bresenham's Line Rasterization Algorithm

Bresenham's algorithm is widely acknowledged for its simplicity and efficiency, particularly notable for its ability to bypass floating-point calculations—an advantageous feature during times when computers struggled with such operations. The algorithm is employed to determine the pixels that best represent a line on a computer screen.

### Algorithm Description

The algorithm is specifically tailored for scenarios where x<sub>1</sub> < x<sub>2</sub> , y<sub>1</sub> < y<sub>2</sub>, and the slope of the line lies between 0 and 1. However, its versatility extends seamlessly to other cases through symmetry and reflections. For instance, when x<sub>1</sub> < x<sub>2</sub>, y<sub>1</sub> < y<sub>2</sub>, and the slope exceeds one, the current pixel P( x<sub>p</sub>, y<sub>p</sub> ) decides between choosing the pixel P<sub>n</sub>( x<sub>p</sub>, y<sub>p</sub>+1 ) (move in the north direction) or P<sub>ne</sub>( x<sub>p</sub>+1, y<sub>p</sub>+1 ) (move in the northeast direction), guided by the decision parameter.

### Pseudo Code

**Input:** Two endpoints of the line, ( x<sub>0</sub>, y<sub>0</sub> ) & ( x<sub>1</sub>, y<sub>1</sub> )

**Assumption:** The algorithm and simulation assumes that the slope of the line (m) adheres to the constraint 0 < m < 1.

<img src="images/code.png">