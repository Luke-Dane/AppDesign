var fs = require( "fs" );
var args = process.argv;

var pieces;

var black_terr = 0;
var white_terr = 0;

var captured_black = 0;
var captured_white = 0;

function readBoard(){
  pieces = fs.readFileSync( args[2] ).toString().split( "\n" );

  for ( var i = 0; i < pieces.length; i++ ){
    pieces[i] = pieces[i].split( "" );
  }
  console.log(pieces)

}

readBoard();

var liberties = pieces.slice(0);

firstLiberties();

function firstLiberties() {//Preliminary round looking for immediate liberties
  for( var y = 0; y < pieces.length; y++ ){
    for( var x = 0; x < 9; x++ ){

      if( pieces[y][x] == "b" ){
        if( pieces[y][x+1] == "-" || pieces[y][x-1] == "-" ||
            pieces[y+1][x] == "-" || pieces[y-1][x] == "-"){

          liberties[y][x] = "bl"; //Changes each black piece with immediate liberty to bl
        }
      }

      if( pieces[y][x] == "w" ){
        if( pieces[y][x+1] == "-" || pieces[y][x-1] == "-" ||
            pieces[y+1][x] == "-" || pieces[y-1][x] == "-"){

          liberties[y][x] = "wl"; //Changes each white piece with immediate liberty to wl
        }
      }
    }
  }
  otherLiberties();
}

function otherLiberties(){

  var changed = false;

  for( var y = 0; y < pieces.length; y++ ){
    for( var x = 0; x < 9; x++ ){

      if( liberties[y][x] == "b" ){
        if( liberties[y][x+1] == "bl" || liberties[y][x-1] == "bl" ||
            liberties[y+1][x] == "bl" || liberties[y-1][x] == "bl"){

          liberties[y][x] = "bl"; //Changes each black piece with neighbor liberty piece to bl
          changed = true; //Notes that something changed
          console.log("here black")
        }
      }

      if( liberties[y][x] == "w" ){
        if( liberties[y][x+1] == "wl" || liberties[y][x-1] == "wl" ||
            liberties[y+1][x] == "wl" || liberties[y-1][x] == "wl"){

          liberties[y][x] = "wl"; //Changes each white piece with neighbor liberty piece to wl
          changed = true; //Notes that something changed
          console.log( "here white");
        }
      }
    }
  }

  if( changed ){//If pieces have changed, calls function recursively
    otherLiberties();
  }
  else{
    capturing();
    }
}

function capturing(){
  console.log(liberties);
  if( !checkSurround() ){
    return; //No pieces to remove
  }
  /* else */
  removePieces();

}

function checkSurround(){//Checks to see if any pieces still don't have liberties
  for( var y = 0; y < pieces.length; y++ ){
    for( var x = 0; x < 9; x++ ){
      if( liberties[y][x] == "w" || liberties[y][x] == "b" ){
        return true;
      }
    }
  }
  return false;
}

function removePieces(){
  console.log("removing pieces")
  for( var y = 0; y < pieces.length; y++ ){
    for( var x = 0; x < 9; x++ ){
      if( liberties[y][x] == "w" ){
        liberties[y][x] = "-";
        captured_white++;
      }
      else if( liberties[y][x] == "b" ){
        liberties[y][x] = "-";
        captured_black++;
      }
    }
  }
  console.log( pieces );
  console.log( "Captured white: " + captured_white + " Captured Black: " + captured_black );
}

countTerritoryPoints();

function countTerritoryPoints(){
  console.log("ENDGAME")
  var changed = false;

  for( var y = 0; y < pieces.length; y++ ){
    for( var x = 0; x < 9; x++ ){

      if( pieces[y][x] == "-" ){
        if( pieces[y][x+1] == "bl" || pieces[y][x-1] == "bl" ||
            pieces[y+1][x] == "bl" || pieces[y-1][x] == "bl"){//If one neighbor is black
              if( pieces[y][x+1] != "wl" && pieces[y][x-1] != "wl" &&
                  pieces[y+1][x] != "wl" && pieces[y-1][x] != "wl"){//No neighbors are white

                    liberties[y][x] = "bl"; //Changes each empty territory point to b
                    changed = true; //Notes that something changed
                    black_terr++;
                    console.log("count black " + black_terr)
              }
              else {
                pieces[y][x] = "un";//Changes unclaimed territory to
             }
        }
        else if( pieces[y][x+1] == "wl" || pieces[y][x-1] == "wl" ||
                 pieces[y+1][x] == "wl" || pieces[y-1][x] == "wl" ){//If one neighbor is white
                   if( pieces[y][x+1] != "bl" && pieces[y][x-1] != "bl" &&
                       pieces[y+1][x] != "bl" && pieces[y-1][x] != "bl"){//No neighbors are black

                         liberties[y][x] = "wl"; //Changes each empty territory point to w
                         changed = true; //Notes that something changed
                         white_terr++;
                         console.log("count white " + white_terr)
                   }
                   else {
                     pieces[y][x] = "un";
                  }
        }

      }
    }
  }

  if( changed ){//If pieces have changed, calls function recursively
    countTerritoryPoints();
  }
  else{
    console.log(liberties);
    console.log( "Black score: " + black_terr + " territory - " + captured_black + " captured pieces = " + (black_terr - captured_black))
    console.log( "White score: " + white_terr + " territory - " + captured_white + " captured pieces = " + (white_terr - captured_white))
    }
}
