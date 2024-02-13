## Bresenham's Line Rasterization Algorithm

Bresenham's algorithm is widely acknowledged for its simplicity and efficiency, particularly notable for its ability to bypass floating-point calculations—an advantageous feature during times when computers struggled with such operations. The algorithm is employed to determine the pixels that best represent a line on a computer screen.

### Algorithm Description

The algorithm is specifically tailored for scenarios where `x1 < x2`, `y1 < y2`, and the slope of the line lies between 0 and 1. However, its versatility extends seamlessly to other cases through symmetry and reflections. For instance, when `x1 < x2`, `y1 < y2`, and the slope exceeds one, the current pixel `P(xp, yp)` decides between choosing the pixel `Pn(xp, yp+1)` (move in the north direction) or `Pne(xp+1, yp+1)` (move in the northeast direction), guided by the decision parameter.

### Pseudo Code

**Input:** Two endpoints of the line, `(x0, y0)` & `(x1, y1)`

**Assumption:** The algorithm assumes that the slope of the line (`m`) adheres to the constraint `0 < m < 1`. However, the experiment accommodates lines with any given slope.

<img src="images/code.png">