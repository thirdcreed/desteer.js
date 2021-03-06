//helpers
var handlePlayerKeys = function(){
  var player = $("#cube"),
      keys = $.gameQuery.keyTracker;

  var trans = DE.Math.Vec2d();
  
  //if(keys[KEY_LEFT])  { trans.y += SPEED; }
  //if(keys[KEY_RIGHT]) { trans.y -= SPEED; }
  if(keys[KEY_UP])    { trans.x += SPEED; }
  if(keys[KEY_DOWN])  { trans.x -= SPEED; }
  if(keys[KEY_LEFT])  { player.rotate(-SPEED,true); }
  if(keys[KEY_RIGHT]) { player.rotate(SPEED,true);}  

  var currentRot = DE.Math.HeadingVec(player.rotate());
  var trans = DE.Math.Vector.WorldToLocal(trans,currentRot);
  player.xy(trans,true);  
};



$(document).ready(function(){
  var $playground = $("#demo");  

  $playground.playground({height: PG_HEIGHT, width: PG_WIDTH, refesh: REFRESH_RATE, keyTracker: true, mouseTracker: true});
  var actors = $playground.addGroup('actors', {height: PG_HEIGHT, width: PG_WIDTH});
  actors.addTilemap('tileMap',function(){return 1;},grid,{width: TILE_SIZE*4, height: TILE_SIZE*4, sizex: TILE_COUNT_X, sizey: TILE_COUNT_Y});
  actors.addSprite('cube',{animation: redCube, posx: 128, posy: 128, height:TILE_SIZE, width: TILE_SIZE}); //Add player.  

  var updatePlayer = function(){
    handlePlayerKeys();
  }

  var sheep = [];
  for( var i = 0; i < 3; i++){
    var pos = DE.Math.Vec2d(DE.Math.Rand(0,PG_WIDTH),DE.Math.Rand(0,PG_HEIGHT));
    actors.addSprite('sheep' + i,{animation: blueCube, posx: pos.x, posy: pos.y, height:TILE_SIZE, width: TILE_SIZE});
    sheep.push($("#sheep"+i));
  }

  var updateSheep = function(){
    var player = $("#cube"),
        playerPos = DE.Math.Vec2d(player.xy());

    var sheepPositions = [];
    var sheepHeadings = [];
    for (var i = 0; i < sheep.length; i++) {
      sheepPositions.push(DE.Math.Vec2d(sheep[i].xy()));
      sheepHeadings.push(DE.Math.HeadingVec(sheep[i].rotate()));
    };   

    for (var i = sheep.length - 1; i >= 0; i--) {      
      var sheepPos = DE.Math.Vec2d(sheep[i].xy());
      var sheepHeading = DE.Math.HeadingVec(sheep[i].rotate());
         
      var neighbors = DE.Util.RemoveElement(sheepPositions,i);            
      var neighborHeadings = DE.Util.RemoveElement(sheepHeadings,i);            
      
      var steering = DE.Steer.Behaviors.Flee(sheepPos,playerPos,10,64);            
      steering.Add(DE.Steer.Behaviors.Seperation(sheepPos,neighbors));
      steering.Add(DE.Steer.Behaviors.Cohese(sheepPos,neighbors,10));   
      
      sheep[i].rotate(DE.Math.Vector.HeadingToDeg(steering));      
      sheep[i].xy(steering, true);        
    };    
  };

  //Main game loop.
  var mainLoop = function(){  
    updatePlayer();
    updateSheep();
  };  
  
  $playground.registerCallback(mainLoop,REFRESH_RATE).startGame();
});


