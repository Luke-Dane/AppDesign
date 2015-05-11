var player_color;
var color = null;

function playerSelection(){
  console.log( "select" );

  var player = new XMLHttpRequest();
  player.onload = assignColor;
  player.open( "get", "player_assignment?none" );
  player.send();

  var start_button = document.getElementById( "start_button" );
  var start_parent = start_button.parentNode;
  start_parent.removeChild( start_button );
}

function assignColor(){
  console.log( "color is " + this.responseText );
  color = this.responseText;

  gameStatus();
}

function gameStatus(){
  var game_status = document.getElementById( "game_status" );

  if( color == "black" ){
    game_status.innerHTML = "You are black and move first!";
  }
  else if( color == "white" ){
    game_status.innerHTML = "You are white and move second!";
  }
  else if( color == "obs" ){
    game_status.innerHTML = "There's currently a game in progess. Feel free to watch.";
  }
}
