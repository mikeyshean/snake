(function () {

  window.SnakeGame = window.SnakeGame || {};


  var View = SnakeGame.View = function ($el, $menu) {
    this.$el = $el;
    this.$menu = $menu

    this.board = new SnakeGame.Board(20, 27);
    this.setupGrid();

    $(window).on("keydown", this.handleKeyEvent.bind(this));
    $(".phone-keys").on("click", this.handlePhoneKeyEvent.bind(this));
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

  View.prototype.handlePhoneKeyEvent = function (e) {
    e.preventDefault();
    var dir = $(e.currentTarget).data("dir");
    
    this.board.snake.turn(dir);
  };

  View.prototype.render = function () {
    this.updateClasses(this.board.snake.segments, "snake");
    this.updateClasses([this.board.apple.position], "apple");
  };

  View.prototype.updateClasses = function(coords, className) {
    this.$li.filter("." + className).removeClass();

    coords.forEach(function(coord){
      var flatCoord = (coord.i * this.board.width) + coord.j;
      this.$li.eq(flatCoord).addClass(className);
    }.bind(this));
  };

  View.prototype.setupGrid = function () {
    var html = "";

    for (var i = 0; i < this.board.height; i++) {
      html += "<ul>";
      for (var j = 0; j < this.board.width; j++) {
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
      this.$menu.show();
      this.$menu.find("#start").text("Play again")
      var $score = this.$menu.find(".high-score")
      $score.show()
      $score.find("#score").text(this.board.snake.points)
    }
  };

  View.prototype.newGame = function () {
    window.clearInterval(this.intervalId);
    this.$menu.hide();
    this.board = new SnakeGame.Board(20, 27);
    this.setupGrid();
    this.intervalId = window.setInterval(
      this.step.bind(this),
      View.STEP_INCR
    );
  };
})();
