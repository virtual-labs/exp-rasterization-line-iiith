**Bresenham's Line Rasterization Algorithm**
Bresenham's algorithm is a very popular algorithm due to its simplicity and speed. It helps to avoid floating point calculations, which was particulary useful in the days when floating point operations could not be handled by the computers. It is employed to identify the pixels that could be selected for representing the line on the computer screen. The following describes the algorithm considering the cases when x1 < x2 and y1 < y2 and slope of line is between 0 & 1  , however it could easily be extended to other cases through symmetry and reflections. Say for x1 < x2 and y1 < y2 and slope of the line greater than one , and given the current pixel P(xp , yp) would have to choose the pixel Pn(xp,yp+1)[move in north direction] or Pne(xp+1,yp+1) [move in north east direction] based on the decision parameter. 


**Pseudo Code of the algorithm**

Input : Two Endpoints of the line, (x0, y0) & (x1, y1)
Assumption : For the description of the algorithm below, we have assumed the slope of the line(m) to have the constraint, 0 < m < 1. However the experiment works with any given line.

**Steps of the Algorithm**

<img src="images/code.png">


