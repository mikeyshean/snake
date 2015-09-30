(function () {

  window.SnakeGame = window.SnakeGame || {};


  var View = SnakeGame.View = function ($el, $menu) {
    this.$el = $el;
    this.$menu = $menu

    this.board = new SnakeGame.Board(20);
    this.setupGrid();

    $(window).on("keydown", this.handleKeyEvent.bind(this));
    this.$menu.find("#start").on("click", this.newGame.bind(this));
  };

  View.KEYS = {
    38: "N",
    39: "E",
    40: "S",
    37: "W"
  };

  View.STEP_INCR = 100;

  View.prototype.handleKeyEvent = function (e) {

    if (View.KEYS[e.keyCode]) {
      e.preventDefault();
      this.board.snake.turn(View.KEYS[e.keyCode]);
    } else if (e.keyCode === 32) {
      e.preventDefault();
      this.newGame();
    }
  };

  View.prototype.render = function () {
    this.updateClasses(this.board.snake.segments, "snake");
    this.updateClasses([this.board.apple.position], "apple");
  };

  View.prototype.updateClasses = function(coords, className) {
    this.$li.filter("." + className).removeClass();

    coords.forEach(function(coord){
      var flatCoord = (coord.i * this.board.dim) + coord.j;
      this.$li.eq(flatCoord).addClass(className);
    }.bind(this));
  };

  View.prototype.setupGrid = function () {
    var html = "";

    for (var i = 0; i < this.board.dim; i++) {
      html += "<ul>";
      for (var j = 0; j < this.board.dim; j++) {
        html += "<li></li>";
      }
      html += "</ul>";
    }

    this.$el.html(html);
    this.$li = this.$el.find("li");
  };

  View.prototype.step = function () {
    if (this.board.snake.segments.length > 0) {
      this.board.snake.move();
      this.render();
    } else {
      window.clearInterval(this.intervalId);
      this.showMenu();
    }
  };

  View.prototype.newGame = function () {
    window.clearInterval(this.intervalId);
    this.$menu.hide();
    this.board = new SnakeGame.Board(20);
    this.setupGrid();
    this.intervalId = window.setInterval(
      this.step.bind(this),
      View.STEP_INCR
    );
  };

  View.prototype.showMenu = function () {
    this.$menu.show();
  };
})();
