**Bresenham's Line Rasterization Algorithm**
Bresenham's algorithm is a very popular algorithm due to its simplicity and speed. It helps to avoid floating point calculations, which was particulary useful in the days when floating point operations could not be handled by the computers.

**Pseudo Code of the algorithm**

Input : Two Endpoints of the line, (x0, y0) & (x1, y1)
Assumption : For the description of the algorithm below, we have assumed the slope of the line(m) to have the constraint, 0 < m < 1. However the experiment works with any given line.

**Steps of the Algorithm**


    1. if x0 > x1
           swap the endpoints
    2. Δy = y1 - y0
       Δx = x1 - x0
       p0 = 2*Δy - Δx

    3. for i = 1 to Δx
       do
           if pi-1 < 0
              //the next point is (xi-1 + 1, yi-1)
    	      pi = pi-1 + 2*¦¤y
           else
              //the next point is (xi-1 + 1, yi-1 + 1)
    	      pi = pi-1 + 2*¦¤y - 2*Δx;
       done	

