# Generosity_WHR

Generosity_WHR analyses Gallup World Poll data on generosity from the World Happiness Report from 2019, 2020, 2021 to find trends in generosity during the pandemic. 

The jupyter notebook merges data published on kaggle to explore:
- how mean generosity across the world changed from 2019 to 2020
- which countries are highest in generosity pre and post pandemic
- which countries are lowest in generosity pre and post pandemic
- how significant pandemic changes are

It then produces a dataset used by the html, css, and javascript files to create a D3 bubble visualization of generosity over the pandemic. 

Explaination of files:
1. World bank population data: API_SP.POP.TOTL_DS2_en_csv_v2_2708397.csv
2. Output file from jupyter notebook used for D3 visualizaiton: Gen_Data_reorganized_sorted.csv
3. Gallup World Poll interview dates for World Happiness Report 2020 data: MedianInterviewDates2020.xls
4. World Happiness Report 2019: WHR-2019.csv
5. World Happiness Report 2020: WHR-2020.csv
6. World Happiness Report 2021: WHR-2021.csv
7. Jupyter notebook analyzing data: WHR_Generosity.ipynb
8. HTML: index_generosity.html
9. JS: main_generosity_final.js
10. CSS: style_generosity.css
