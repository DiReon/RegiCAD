# RegiCAD
Web-based math application, which allows you to perform calculations directly from the text you are writing.
You can write your report with calculations, containing variables and expressions. The simple Javascript
brain of this app will understand, which line needs to be calculated and what is just a plain text to be left untouched. Write your logic
and the app will complete it with numbers, making the text reponsive to the changes.

RegiCAD divides data in 3 types:
- plain text. If there is no "=" sign - that is a plain text.
- variables. If the line has "=" and the line is bold, it is a variable, which can be used for calculation anywhere below that line.
- equations. Everything else is treated as equations. Whatever is after "=" is replaced by the result of the equation before equal
To run the calculation press Ctrl+Enter or Calculator icon on the toolbar.
To set variable, highlight the whole line and press Ctrl+B to make it bold
You can write comments on any line after the |. This might be useful for units in the calculations.

As this was initially Typescript exercise, no external libraries or frameworks are used. Only some Bootstrap for visualization.

Here you can play with demo: https://regicad-40462.web.app/
