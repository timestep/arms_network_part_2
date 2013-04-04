var isis = function() {
  var _game, _items, _cities;
  var $_cities, $_cityTitle, $_items, $_inventory, $_codename, $_agentName, $_agentRank;
  var Agent, City, Game;
  
  function getRandomIntInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  
  function createButtonForCity(city) {
    var $button = $("<button>");
    $button.attr('data-city', city);
    $button.text('Travel Here');
    $button.addClass('btn');
    
    return $button;
  }
  
  function createButtonsForItem(item) {
    var $buy;
    $buy = $("<button>");
    $buy.attr('data-item', item);
    $buy.text('Buy');
    $buy.addClass('btn');
    
    $buy.click(function() {
      var item = $(this).data('item');
      item = _game.currentCity.items[item];
      
      _game.buyItem(item);
      _game.refreshViews();
    });
    
    return $buy;
  }
  
  function sampleSet(array, numberOfItems) {
    var newArray = [];
  
    do {
      var item;
    
      do {
        var num = Math.floor(Math.random() * array.length);
        item = array[num];
      } while (newArray.lastIndexOf(item) !== -1)
    
      newArray.push(item);
    
    } while (newArray.length !== numberOfItems);
  
    return newArray;
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
          _game.chooseBadThing();
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
      
      $buttonGroup.append(createButtonsForItem(k));
      
      $item.text(v.name);
      $value.text('$' + v.currentPrice);
      
      $row.append($item);
      $row.append($value);
      $row.append($buttonGroup);
      
      $_items.append($row);
    }
  }

  function printInventory(inventory, currentCityItems) {
    $_inventory.text('');

    for (k in inventory.inventory) {
      var v, itemValue, worth, $row, $sell, $item, $buttonGroup;
      
      v = inventory.inventory[k];
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
  
  Item = function(name, minPrice, maxPrice) {
    this.name = name;
    this.minPrice = minPrice;
    this.maxPrice = maxPrice;
    this.recalculatePrice();
  }
  
  Item.prototype.recalculatePrice = function () {
    this.currentPrice = getRandomIntInRange(this.minPrice, this.maxPrice);
  }
  
  _items = [
    new Item('M4A1', 250, 500),
    new Item('TEC-9', 100, 250),
    new Item('.44 Magnum', 350, 500),
    new Item('Barret .50 cal', 1000, 1500),
    new Item('9mm Ammo', 5, 25),
    new Item('.50 cal Ammo', 100, 150),
    new Item('.44 Magnum Ammo', 35, 50)
  ];
  
  City = function(name) {
    this._numOfItems = getRandomIntInRange(3, _items.length);
    this.name = name;
    
    // set interal array of items for this city
    this.items = sampleSet(_items, this._numOfItems);
  }
  
  _cities = [
    new City('Toronto'),
    new City('New York'),
    new City('San Francisco'),
    new City('London'),
    new City('Hong Kong'),
    new City('Moscow'),
    new City('Sydney')
  ];
  
  Game = function() {
    this.cities = _cities;
    this.currentCity = _cities[getRandomIntInRange(0, _cities.length - 1)];
    this.badThings = [];
    
    // var name = prompt('Agent: enter a codename');
    // this.player = new Player(name);
    // Call call init script from student code
    this.agent = new Agent();
    
    this.refreshViews();
    this.initBadThings(this.badThings);
  }

  Game.prototype.refreshViews = function() {
    // list all the cities
    printCities(this.currentCity);
    
    // list all the items in the first city
    printItems(this.currentCity);

    // list current inventory
    printInventory(this.agent.inventory, this.currentCity.items);

    // display agent profile
    printProfile(this.agent);
  }
  
  Game.prototype.chooseBadThing = function() {
    // roll a die (d10) 1's are always bad things
    var roll = getRandomIntInRange(1, 10);
    console.log('rolled ' + roll);
    if (roll === 1) {
      // pick a bad thing and run it
      var index = getRandomIntInRange(1, this.badThings.length) - 1;
      var badThing = this.badThings[index];
      console.log('Going to do: ' + badThing.name);
      badThing.ohNoes(this.agent);
      console.log('Bad thing done!');
    } else {
      alert ("Nothing bad happend!\nPhew!");
    }
  }

  AgentInventory = function() {
    this.inventory = [];
  }

  AgentInventory.prototype.findItem = function(item) {
    for (var k in this.inventory) {
      var v = this.inventory[k];
      if (v.item === item) {
        return v;
      }
    }
  }

  AgentInventory.prototype.push = function(item, quantity) {
    var i = this.findItem(item);
    if (i) {
      i.quantity += quantity;
    } else {
      i = new AgentInventoryItem(item, quantity);
      this.inventory.push(i);
    }
  }

  AgentInventory.prototype.pop = function(item, quantity) {
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
      throw 'Item not found in Inventory: ' + i.name;
    }
  }

  AgentInventoryItem = function(item, quantity) {
    this.item = item;
    this.quantity = quantity;
  }
  
  Agent = function(name) {
    this.name = name;
    this.money = 1000;
    this.inventory = new AgentInventory();
    
    this.init();
  }
  
  Agent.prototype.init = function() {
    // overrident by student code
  }

  Agent.prototype.getInventoryItem = function(index) {
    return this.inventory.inventory[index];
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
    AgentInventory: AgentInventory,
    AgentInventoryItem: AgentInventoryItem,
    Item: Item,
    City: City,
    Game: Game
  }
}();