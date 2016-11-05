//constans
var Col=26, Row=26;
//IDs
var Empty=0, Snake=1, Fruit=2;
//direction
var Left = 0, Up = 1, Right = 2, Down = 3; 
// KeyCode
var KeyLeft = 37 , KeyUp = 38 , KeyRight = 39 , KeyDown = 40;
// this is main window and to put snake in the array grid
var grid =
    {
        width: null,
        height: null,
        _grid: null,
        
        init: function (d, c, r) {
            this.width = c;
            this.height = r;
            this._grid = [];
            for (var x = 0 ; x < c ; x++) {
                    this._grid.push([]);
                    for(var y = 0 ; y < r ; y++)
                        {
                            this._grid[x].push(d);
                        }
                }
        },
        // to put value of snake in queue
        set: function (val , x , y)
        {
            this._grid[x][y] = val;
        },
        // to get value from queue
        get: function (x , y)
        {
            return this._grid[x][y];
        }
        
    }
// this is snake object
var Snake = 
    {
        direction: null,
        _queue: null,
        last: null,
        init: function (d , x , y)
        {
            this.direction = d;
            this._queue = [];
            this.insert(x,y);
        },
        // to insert value of snake in the queue
        insert: function(x, y)
        {
            this._queue.unshift({x:x , y:y});
            this.last = this._queue[0];
        },
        // this to remove value from snake
        remove: function()
        {
            return this._queue.pop();
        }
    }
// this is to set food random
function SetFood()
{
    var Empty_dir = [];
    for(var x=0; x < grid.width ; x++)
        {
            for(var y=0; y < grid.height; y++)
                {
                    if(grid.get(x,y) === Empty)
                        {
                            Empty_dir.push({x:x, y:y});
                        }
                }
        }
    var RandomPostion = Empty_dir[Math.floor(Math.random() * Empty_dir.length)];
    grid.set(Fruit , RandomPostion.x , RandomPostion.y);
}

var Canvas , Ctx , KeyState, Frames , score=0;
function Main()
{
    Canvas = document.createElement("canvas");
    Canvas.width = Col * 20;
    Canvas.height = Row * 20;
    Ctx = Canvas.getContext("2d");
    document.body.appendChild(Canvas);
    Frames = 0;
    KeyState = {};
    document.addEventListener("keydown" , function(evt){
      KeyState[evt.keyCode] = true;   
    });
    document.addEventListener("keyup" , function(evt){
       delete KeyState[evt.keyCode]; 
    });
    init();
    Loop();
}
function init()
{
    grid.init(Empty , Col , Row);
    var sp = {x:Math.floor(Col/2) , y: Row-1};
    Snake.init(Up , sp.x , sp.y);
    grid.set(Snake , sp.x , sp.y);
    
    SetFood();
}
function Loop()
{
    Update();
    Draw();
    window.requestAnimationFrame(Loop, Canvas);
}
function Update()
{
    Frames++;
    
    if (KeyState[KeyLeft] && Snake.direction !== Right) {
        Snake.direction = Left;
    }
    if (KeyState[KeyUp] && Snake.direction !== Down) {
        Snake.direction = Up;
    }
    if (KeyState[KeyRight] && Snake.direction !== Left) {
        Snake.direction = Right;
    }
    if (KeyState[KeyDown] && Snake.direction !== Up) {
        Snake.direction = Down;
    }
    
    if(Frames%5 === 0)
        {
            var nx = Snake.last.x;
            var ny = Snake.last.y;
            
            switch(Snake.direction) 
                {
                    case Left:
                        nx--;
                        break;
                    case Up:
                        ny--;
                        break;
                    case Right:
                        nx++;
                        break;
                    case Down:
                        ny++;
                        break;
                }
            if(0 > nx || nx > grid.width-1 ||
               0 > ny || ny > grid.height-1 ||
               grid.get(nx , ny) === Snake
              )
                {
                    score = 0;
                    return init();
                    console.log("Game over");
                }
            
            if (grid.get(nx , ny) === Fruit)
                {
                    var Tail = {x:nx , y:ny};
                    score++;
                    SetFood();
                }
            else
                {
                    var Tail = Snake.remove();
                    grid.set(Empty , Tail.x , Tail.y);
                    Tail.x = nx;
                    Tail.y = ny;
                }
            
            grid.set(Snake , Tail.x , Tail.y);
            Snake.insert(Tail.x , Tail.y);
        }
}
function Draw()
{
    var tw = Canvas.width / grid.width;
    var th = Canvas.height / grid.height;
    for(var x=0; x < grid.width ; x++)
        {
            for(var y=0; y < grid.height; y++)
                {
                    switch (grid.get(x,y))
                        {
                            case Empty: 
                                Ctx.fillStyle = "#fff";
                                break;
                            case Snake: 
                                Ctx.fillStyle = "#0ff";
                                break;
                            case Fruit: 
                                Ctx.fillStyle = "#f00";
                                break;
                        }
                    Ctx.fillRect(x*tw , y*th , tw , th);
                }
        }
    Ctx.fillStyle = "#000";
    Ctx.fillText("Your score is " + score , 10 , Canvas.height - 10);
}
Main();