# ISIS Arms Network

Welcome Agent, to the ISIS Arms Network. 

A number of functions within the game are self explainatory, such as 'promptForNumber', and getRandomIntInRange etc.

createButtonForItem takes an item that would be defined within an array and inputs it into Button and provides a click function.

The first complex function arrives at Item, which a function with 3 inputs of name minPrice and maxPrice. The Item stores these values akin to a hash key value. 

.prototype.recalculate provides a method to redetermine a price point to sell the item at. 

objects deoted with _ are typically arrays or mission critial items. 

The Game begins with an anonymous funciton. This initalizes the actual game, setting the html printing out the items via refreshViews() which appears as a prototype function that allows the function to modify game on a global scope. This is what reinializes the game and refreshes the page with the new values. Each of the function within game contain a protoype that allows the values of the method calling to pass the variables on a global scope. 


The agent maintains the values of the inventory and monies of the user. It is passed into the other game functions and interacts with the mechanics of game in line 245 when an agent is initalized. All instances of this.agent refer to the Agent function after line 417. the prototype changes all instances of Agent. Finnaly the script ends with a reinialization of all the dom elements in their respective arrays. A new game is intialized in the end.