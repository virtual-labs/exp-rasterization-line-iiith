**Bresenham's Line Rasterization Algorithm**
Bresenham's algorithm is a very popular algorithm due to its simplicity and speed. It helps to avoid floating point calculations, which was particulary useful in the days when floating point operations could not be handled by the computers.

**Pseudo Code of the algorithm**

Input : Two Endpoints of the line, (x0, y0) & (x1, y1)
Assumption : For the description of the algorithm below, we have assumed the slope of the line(m) to have the constraint, 0 < m < 1. However the experiment works with any given line.

**Steps of the Algorithm**


    1. if x<sub>0</sub> > x<sub>1</sub>
           swap the endpoints
    2. ¦¤y = y<sub>1</sub> - y<sub>0</sub>
       ¦¤x = x<sub>1</sub> - x<sub>0</sub>
       p0 = 2*¦¤y - ¦¤x

    3. for i = 1 to ¦¤x
       do
           if p<sub>i-1</sub> < 0
              //the next point is (x<sub>i-1</sub> + 1, y<sub>i-1</sub>)
    	      p<sub>i</sub> = p<sub>i-1</sub> + 2*¦¤y
           else
              //the next point is (x<sub>i-1</sub> + 1, y<sub>i-1</sub> + 1)
    	      pi = p<sub>i-1</sub> + 2*¦¤y - 2*¦¤x;
       done	


