var isis = function() {
  // define a bunch of variables w/o any values
  var _game, _items, _cities;
  var $_cities, $_cityTitle, $_items, $_inventory, $_codename, $_agentName, $_agentRank;
  var Agent, City, Game;

  function getRandomIntInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // returns a HTML button for a city
  function createButtonForCity(city) {
    var $button = $("<button>");
    $button.attr('data-city', city);
    $button.text('Travel Here');
    $button.addClass('btn');

    return $button;
  }

  // returns a HTML button for an item
  // while binding a click event to the button
  function createButtonForItem(item) {
    var $buy;
    $buy = $("<button>");
    $buy.attr('data-item', item);
    $buy.text('Buy');
    $buy.addClass('btn');

    // on click the item is bought and the views are refreshed
    $buy.click(function() {
      var item = $(this).data('item');
      item = _game.currentCity.items[item];

      _game.buyItem(item);
      _game.refreshViews();
    });

    return $buy;
  }

  // Returns a subset of an array of items
  // with the size of the subset given
  function sample(items, numberOfItems) {
    var sampleOfItems = [];

    do {
      var item;

      // keep randomly selecting an item until the item
      // was not the last one added to the sample
      do {
        var num = Math.floor(Math.random() * items.length);
        item = items[num];
      } while (sampleOfItems.lastIndexOf(item) !== -1)

      sampleOfItems.push(item);

    } while (sampleOfItems.length !== numberOfItems);

    return sampleOfItems;
  }


  function printCities(currentCity) {
    $_cities.text('');
    $_cityTitle.text(currentCity.name);

    for (k in _cities) {
      var $row, $span, $city, $button, v;
      v = _cities[k];
      $row = $('<tr>');
      $city = $('<td>').addClass('city span3');
      $button = createButtonForCity(k);
      $button.addClass('span3');

      if (v !== currentCity) {
        $button.addClass('btn-primary');
        $button.click(function() {
          var city = $(this).data('city')
          city = _cities[city];

          // Delegate to Student code
          _game.changeCity(city);
          _game.rollDieForBadThing();
          _game.refreshViews();
        });
      } else {
        $button.text('You are here!');
        $button.addClass('btn-warning disabled');
      }

      $city.text(v.name);

      $row.append($city);
      $row.append($('<td>').append($button));
      $_cities.append($row);
    }
  }

  function printItems(currentCity) {
    $_items.text('');

    for (k in currentCity.items) {
      var v, items, $row, $item, $value, $buttonGroup;
      items = currentCity.items;
      $row = $('<tr>')
      $item = $('<td>').addClass('item span4');
      $buttonGroup = $('<td>').addClass('buttons span1');
      $value = $('<td>').addClass('value span1');
      v = items[k];

      $buttonGroup.append(createButtonForItem(k));

      $item.text(v.name);
      $value.text('$' + v.currentPrice);

      $row.append($item);
      $row.append($value);
      $row.append($buttonGroup);

      $_items.append($row);
    }
  }

  // 
  function printInventory(inventory, currentCityItems) {
    $_inventory.text('');

    for (k in inventory) {
      var v, itemValue, worth, $row, $sell, $item, $buttonGroup;

      v = inventory[k];
      itemValue = v.quantity * v.item.currentPrice;
      worth = '';
      $row = $('<tr>');
      $item = $('<td>').addClass('span4 item');
      $buttonGroup = $('<td>').addClass('buttons span2');

      if (currentCityItems.indexOf(v.item) > 0) {
        $sell = $("<button>");
        $sell.attr('data-item', k);
        $sell.text('Sell');
        $sell.addClass('btn');

        $sell.click(function() {
          var item = $(this).data('item');
          item = _game.agent.getInventoryItem(item);

          _game.sellItem(item);
          _game.refreshViews();
        });

        $buttonGroup.append($sell);

        worth = ', worth: $' + itemValue;
      }

      $item.text(v.item.name + '(' + v.quantity + ')' + worth);

      $row.append($item);
      $row.append($buttonGroup);

      $_inventory.append($row);
    }
  }

  function printProfile(agent) {
    $_codename.text(agent.codename);
    $_agentName.text(agent.name);
    $_agentRank.text(agent.getRank());
    $_money.text('$' + agent.money);
  }

  // Initialize a new Item with a given name, minPrice, and maxPrice
  // and set currentPrice through recalculatePrice()
  Item = function(name, minPrice, maxPrice) {
    this.name = name;
    this.minPrice = minPrice;
    this.maxPrice = maxPrice;
    this.recalculatePrice();
  }

  // set currentPrice of Item with said Item's minPrice and maxPrice
  Item.prototype.recalculatePrice = function () {
    this.currentPrice = getRandomIntInRange(this.minPrice, this.maxPrice);
  }

  // Initialize an array of Items
  _items = [
    new Item('M4A1', 250, 500),
    new Item('TEC-9', 100, 250),
    new Item('.44 Magnum', 350, 500),
    new Item('Barret .50 cal', 1000, 1500),
    new Item('9mm Ammo', 5, 25),
    new Item('.50 cal Ammo', 100, 150),
    new Item('.44 Magnum Ammo', 35, 50)
  ];

  // Initialize a new City with a given name and give it a random number of random Items
  City = function(name) {
    this._numOfItems = getRandomIntInRange(3, _items.length);
    this.name = name;

    // set internal array of items for this city
    this.items = sample(_items, this._numOfItems);
  }

  // Initialize an array of Cities
  _cities = [
    new City('Toronto'),
    new City('New York'),
    new City('San Francisco'),
    new City('London'),
    new City('Hong Kong'),
    new City('Moscow'),
    new City('Sydney')
  ];

  // When a new Game is initialized, give it the array of Cities,
  // randomly select a currentCity, give it a new Agent,
  // refresh the views, and then give it badThings
  Game = function() {
    this.cities = _cities;
    this.currentCity = _cities[getRandomIntInRange(0, _cities.length - 1)];
    this.badThings = [];

    this.agent = new Agent();

    this.refreshViews();
    // this.initBadThings is defined in student-script.js
    this.initBadThings(this.badThings);
  }

  // Upon refreshing the views, 
  Game.prototype.refreshViews = function() {
    printCities(this.currentCity);

    // print the Items for this game's currentCity
    printItems(this.currentCity);

    // print the invetory for this game's agent and this game's currentCity
    printInventory(this.agent.inventory, this.currentCity.items);

    // print the profile for this game's agent
    printProfile(this.agent);
  }

  // Return true/false based on if a random number equals 1
  Game.prototype.badThing? = function() {
    var roll = getRandomIntInRange(1, 10);
    console.log('rolled ' + roll);
    if (roll === 1) {
      return true;
    } else {
      return false;
    }
  }

  // Randomly select a bad thing and apply its effects to this game's agent
  Game.prototype.makeBadThingHappen = function() {
    var index = getRandomIntInRange(1, this.badThings.length) - 1;
    var badThing = this.badThings[index];
    console.log('Going to do: ' + badThing.name);
    badThing.ohNoes(this.agent);
    console.log('Bad thing done!');
  }

  // Roll a die to see if a bad thing should happen and if so make it happen
  // if not, life's good
  Game.prototype.rollDieForBadThing = function () {
    if (_game.badThing?()) {
      _game.makeBadThingHappen();
    } else {
      alert("Nothing bad happened!\nPhew!");
    }
  }

  // Initialize a new AgentItem with a given item and quantity
  AgentItem = function(item, quantity) {
    this.item = item;
    this.quantity = quantity;
  }

  // Initialize a new Agent, give it money, an empty inventory,
  // and call an init function defined in student-script.js
  Agent = function() {
    this.money = 1000;
    this.inventory = [];

    this.init();
  }

  Agent.prototype.init = function() {
    // overridden by student code
  }

  // Return the item from the inventory with its index
  Agent.prototype.getInventoryItem = function(index) {
    return this.inventory[index];
  }

  // Find given item in inventory and return it
  Agent.prototype.findItem = function(item) {
    for (var k in this.inventory) {
      var v = this.inventory[k];
      if (v.item === item) {
        return v;
      }
    }
  }

  // 
  Agent.prototype.buyItem = function(item, quantity) {
    var item = this.findItem(item);
    if (i) {
      i.quantity += quantity;
    } else {
      i = new AgentItem(item, quantity);
      this.inventory.push(i);
    }
  }

  // 
  Agent.prototype.sellItem = function(item, quantity) {
    var i = this.findItem(item);
    if (i) {
      if (i.quantity - quantity < 0) {
        // error
        throw 'Cannot remove that much: ' + quantity;
      } else if (i.quantity - quantity === 0) {
        // remove from array
        var index = this.inventory.indexOf(i);
        this.inventory.splice(index, 1);
      } else {
        i.quantity -= quantity;
      }
    } else {
      throw 'Item not found in Inventory: ' + i.item.name;
    }
  }

  return {
    init: function() {
      $_cities = $('#cities');
      $_items = $('#items');
      $_cityTitle = $('#currentCity');
      $_inventory = $('#inventory');
      $_codename = $('#codename');
      $_agentName = $('#agentName');
      $_agentRank = $('#agentRank');
      $_money = $('#agentMoney');
      _game = new Game();
    },

    game: _game,

    debug: function() {
      return _game;
    },
    Agent: Agent,
    AgentItem: AgentItem,
    Item: Item,
    City: City,
    Game: Game
  }
}();