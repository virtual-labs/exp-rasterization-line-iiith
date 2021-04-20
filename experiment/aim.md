 In digital display systems, everything that is displayed, is displayed in terms of a smallest unit of display, which is called a pixel. This is in contrast to what we perceive the world to be as continuous. The space occupied by any image in digital display system is measured in terms of pixels. Thus we require to transform the continuous space in which we define he geometry of any figure to a discrete space for display in digital displays. This transformation is called **rasterization** or **scan conversion**

When a line is transformed from its continous form of y = mx + c into a discrete form of a set of pixels, this transformation is called **line rasterization.** Thus when we apply line rasterization technique on a line, *y = mx + c*, we obtain the set of pixels that are required to be filled in order to fit the given continuous line in the best possible manner. Some common algorithms to perform line rasterization are as follows:

 a. Bresenham's line algorithm
 b. Digital Differential Analyzer(DDA) algorithm
 c. Xiaolin Wu's algorithm

Here we have discussed only the Bresenham's Line Rasterization algorithm. 