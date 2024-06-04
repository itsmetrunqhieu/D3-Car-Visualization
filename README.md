This visualization is developed upon the work of Mariano Trebino, University of Girona, 2015 and was optimized and developed further by Tuan Dung Lai, Swinburne University of Technology, Australia, 2018.

Developed using different approach by Mechanical Guys Team, International University HCMC, Viet Nam, 2024.

<h1>d3 Cars dataset visualization</h1>
The main queries that the visualization may be able to address are what kinds of automobiles a certain brand typically produces and the relationship between the cars' prices and other characteristics. 

Users of the visualization may compare items from different automakers and evaluate differences in terms of pricing, branding, and specifications. Enthusiasts of automobiles might investigate the specifics of individual components and their relationships.

<h1>Storytelling</h1>
The visualization of 205 cars across 26 variables provides a comprehensive analysis of various car attributes, making it a powerful tool for data-driven storytelling in the automotive sector. The interactive parallel coordinates plot allows users to explore categorical and metric attributes of the cars, enabling a multifaceted exploration of their characteristics. The interactive nature of the plot allows users to select the attributes they wish to visualize, making the data exploration process more engaging and relevant to individual needs. The visualization also facilitates the identification of correlations and relationships between various attributes, allowing users to understand the underlying factors driving car performance and consumer preferences. Additionally, the plot makes it easy to identify outliers, such as cars with exceptionally high compression ratios or unusually high prices.

<h1>Plots</h1>
This visualization uses a Parallel Coordinates Plot and Scatter Plot as the main plot and then a secondary plot: data table . All these plots all linked and synchronized. Any modification in any plot is translated to the others.

<h1>Exploration</h1>
We provide many tools to explore the data. Try hovering the data table. Brush the parallel coordinates plot or sort the table!

1.	A checkbox area positioned above the parallel coordinates plot allows users to add or remove variables from the diagram.
2.	The scatter plot situated on the right optimizes available space, enabling users to compare specific variables.
3.	A dropdown menu provides users with the flexibility to customize the variables displayed in the scatter plot.
4.	The brush filter technique remains functional even when users modify variables, allowing them to highlight specific data ranges for visualization.
5.	The table data is promptly updated whenever changes are made within the diagram.
6.	The scatter plot dynamically adjusts based on the selected data from the parallel coordinates plot.
7.	Users can hover over data points in the scatter plot, resulting in the corresponding data being highlighted in the other diagram.
8.	A consistent color scheme is maintained across both graphs and the table for improved visual coherence.

Data
The data used in this example is contained in the folder assets/data in .csv format and can be found [here] (http://archive.ics.uci.edu/ml/datasets/Automobile)
