var player_color;
var color = null;

window.setInterval( pollBoard, 2000 );

function pollBoard()
{
    console.log("poll board");
    var board_req = new XMLHttpRequest();
    board_req.onload = boardListener;
    board_req.open( "get", "poll_board" );
    board_req.send();
}

function boardListener(){
  var new_positions = JSON.parse( this.responseText );
  var board = document.getElementById( "board" );
  console.log("listening");
  var pos_y = 1;

  for( var y = 1; y < 10; y=y+2 ){
    for( var x = 0; x < 5; x++ )
        {
            //console.log( board.childNode);
            var tr_elem = board.childNodes[y];
            //console.log( tr_elem + y);
            var td_elem = tr_elem.childNodes[x];
            //console.log( td_elem );
            var dv_elem = td_elem.childNodes[0];
            //console.log( dv_elem );
            if( new_positions[pos_y][x] == "-" ) {
              dv_elem.innerHTML = "+";
            }
            else{
              dv_elem.innerHTML = new_positions[pos_y][x];
            }
        }
        pos_y++;
  }
}

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

function boardClick( grid ){
  console.log( grid.getAttribute( "position" ) );

  var sendgrid = new XMLHttpRequest();
  sendgrid.open( "get", color + "?grid=" + grid.getAttribute( "position" ) );
  sendgrid.send();
}
