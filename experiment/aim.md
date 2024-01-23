In digital display systems, visual elements are represented by discrete units known as pixels. This departure from the continuous nature of our visual perception necessitates a transformation of geometric figures from continuous space to a grid of pixels for display on digital screens. This transformation process, referred to as rasterization or scan conversion, is essential for rendering images on digital displays.

Specifically, when dealing with lines, the transformation from the continuous mathematical representation (y = mx + c) to a discrete set of pixels is termed line rasterization. The goal of line rasterization is to determine the optimal arrangement of pixels that best represents the given continuous line. Notable algorithms employed for line rasterization include:

a. Bresenham's line algorithm
b. Digital Differential Analyzer (DDA) algorithm
c. Xiaolin Wu's algorithm

In this context, our focus will be on the Bresenham's Line Rasterization algorithm.