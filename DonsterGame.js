/**
 * Created with JetBrains WebStorm.
 * User: Fabrice
 * Date: 06/06/12
 * Time: 10:16
 * To change this template use File | Settings | File Templates.
 */

var GlobalSoundManager;

function DonsterGame(width, height)
{
    this.LoadResources();

    this.EventManager = new EventManager();
    this.EventManager.Initialize();
    this.Width = width;
    this.Height = height;
    this.HurtTime = 0;
    this.Velocity = 1.2; // 1 is a good value
    this.Speed = 100;
    this.UpPressed = false;
    this.RightPressed = false;
    this.GameTime = new MonsterTimer();
    this.Player = new DonsterBarry(this.img_player_spritesheet, this, 256, 348);
    this.Walls = new DonsterWall(this, this.ImgWalls, this.img_spikes, this.img_monster, new DonsterLife(this.img_life, this.img_life_grey, this.img_life_regen, this.img_life_pickup, this.img_life_explode, ModePickup));
    this.Score = 0;
    this.DistanceCounter = new DonsterDistanceCounter(this, this.img_small_numbers);
    this.FpsShow = new Text2D(5, 20, 15, 'Calibri', "30 fps");
    this.FpsShow.setRVBColor(0, 255, 0);
    this.FpsUpdate = 500;
    this.FpsAccu = 0;

    var tmpRec = new ImageRect(this.img_jump_help, 0, 0, 256, 256);
    this.SpriteJumpHelp = new Sprite(0, this.Height - 256, 256, 256, tmpRec);
    tmpRec = new ImageRect(this.img_shoot_help, 0, 0, 256, 256);
    this.SpriteShootHelp = new Sprite(this.Width - 256, this.Height - 256, 256, 256, tmpRec);

    tmpRec = new ImageRect(this.img_shadow, 0, 0, 32, 32);
    this.SpriteShadow = new Sprite(this.Player.GetX() - 32, 0, 48, 48, tmpRec);
    this.SpriteShadow.setCenterPoint(24, 24);

    var bgs = new Array();
    bgs.push(this.img_farbg);
    bgs.push(this.img_midbg);
    this.Background = new DonsterParallax(this, bgs);

    /** Life bar **/
    this.LifeBar = new DonsterLifeBar(this, 38, this.img_life, this.img_life_grey, this.img_life_regen, this.img_life_pickup, this.img_life_explode, 3);

    /** Screen hurt **/
    var tmpRec = new ImageRect(this.img_screen_hurt, 0, 0, 512, 128);
    this.HurtTop = new Sprite(0, 0, 1024, 384, tmpRec);
    this.HurtTop.setAlpha(0.6);
    tmpRec = new ImageRect(this.img_screen_hurt, 0, 0, 512, 128);
    this.HurtBot = new Sprite(0, 768, 1024, 384, tmpRec);
    this.HurtBot.setScale(1, -1);
    this.HurtBot.setAlpha(0.6);
}

DonsterGame.prototype.NewGame = function()
{
    this.Speed = 100;
    this.UpPressed = false;
    this.RightPressed = false;
    this.Score = 0;
    this.GameTime.reset();
    this.HurtTime = 0;
    this.Player = new DonsterBarry(this.img_player_spritesheet, this, 256, 348);
    this.Walls = new DonsterWall(this, this.ImgWalls, this.img_spikes, this.img_monster, new DonsterLife(this.img_life, this.img_life_grey, this.img_life_regen, this.img_life_pickup, this.img_life_explode, ModePickup));
    this.LifeBar = new DonsterLifeBar(this, 38, this.img_life, this.img_life_grey, this.img_life_regen, this.img_life_pickup, this.img_life_explode, 3);
    GlobalSoundManager.getPlayableSound(5).play();
}


DonsterGame.prototype.LoadResources = function()
{
    /** Loading sounds **/
    GlobalSoundManager = TWSoundManager.init();
    GlobalSoundManager.add('sounds/shotgun.mp3', 10);
    GlobalSoundManager.add('sounds/jump.mp3', 10);
    GlobalSoundManager.add('sounds/pain.mp3', 10);
    GlobalSoundManager.add('sounds/heart_pickup.mp3', 10);
    GlobalSoundManager.add('sounds/game_music.mp3', 10);

    GlobalSoundManager.loadAll();
    GlobalSoundManager.setMasterVolume(0.2);
    GlobalSoundManager.getPlayableSound(1).setVolume(0.3);
    GlobalSoundManager.getPlayableSound(2).setVolume(0.1);
    GlobalSoundManager.getPlayableSound(3).setVolume(0.2);
    GlobalSoundManager.getPlayableSound(4).setVolume(1);
    GlobalSoundManager.getPlayableSound(5).setVolume(1);

    /** Hurt screen loading **/
    this.img_screen_hurt = new Image();
    this.img_screen_hurt.src = "images/effect_screenhurt.png";

    /** Life loading **/
    this.img_life = new Image();
    this.img_life.src = "images/heart.png";
    this.img_life_grey = new Image();
    this.img_life_grey.src = "images/heartgrey.png";
    this.img_life_regen = new Image();
    this.img_life_regen.src = "images/effect_heartregen.png";
    this.img_life_pickup = new Image();
    this.img_life_pickup.src = "images/heartpickup.png";
    this.img_life_explode = new Image();
    this.img_life_explode.src = "images/heartexplode.png";

    /** Numbers loading **/
    this.img_small_numbers = new Image();
    this.img_small_numbers.src = "images/scoreboardsmall.png";

    /** Load player spritesheet **/
    this.img_player_spritesheet = new Image();
    this.img_player_spritesheet.src = "images/barryfull.png";
    /** Load shadow**/
    this.img_shadow = new Image();
    this.img_shadow.src = "images/effect_shadow.png";
    /** Load monster **/
    this.img_monster = new Image();
    this.img_monster.src = "images/demon.png";

    /** Load walls spritesheets**/
    this.ImgWalls = new Array();
    var tmpImg = new Image();
    tmpImg.src = "images/snow_wall.png";
    tmpImg.id = 1;
    this.ImgWalls.push(tmpImg);
    var tmpImg = new Image();
    tmpImg.src = "images/snow_wall2.png";
    tmpImg.id = 2;
    this.ImgWalls.push(tmpImg);
    /** Load Spikes **/
    this.img_spikes = new Image();
    this.img_spikes.src = "images/snow_spikes.png";
    /** Load backgrounds for parallax **/
    this.img_farbg = new Image();
    this.img_farbg.src = "images/snow_farbg.png";
    this.img_midbg = new Image();
    this.img_midbg.src = "images/snow_midbg.png";
    /** Load helpers **/
    this.img_jump_help = new Image();
    this.img_jump_help.src = "images/btnjumphd_mandreel.png";
    this.img_shoot_help = new Image();
    this.img_shoot_help.src = "images/btnshoothd_mandreel.png";
}

DonsterGame.prototype.Update = function()
{
    this.EventManager.Update();
    this.FpsAccu += this.GameTime.GetElapsedTime();
    if (this.FpsAccu > this.FpsUpdate)
    {
        this.FpsShow.setText(Math.round(1 / (this.GameTime.GetElapsedTime() / 1000)) + " fps");
        this.FpsAccu = 0;
    }
    this.HurtTime -= this.GameTime.GetElapsedTime();
    this.Speed += this.Velocity * this.GameTime.GetElapsedTime() / 1000;
    this.Background.Update(this.GameTime);
    this.Walls.Update(this.GameTime);
    this.Player.Update(this.GameTime);
    this.LifeBar.Update(this.GameTime);

    //this.Player.HandleTouches(this.UpPressed, this.RightPressed);
    this.SetUpPressed(this.EventManager.isKeyDown(KeyEnum.UpArrow) || this.EventManager.isKeyDown(KeyEnum.UpArrow))
    this.SetRightPressed(this.EventManager.isKeyDown(KeyEnum.RightArrow));
    this.Player.HandleTouches(
        this.EventManager.isKeyDown(KeyEnum.UpArrow) || this.EventManager.isKeyDown(KeyEnum.UpArrow),
        this.EventManager.isKeyDown(KeyEnum.RightArrow)
        );

    this.ControlCollisions();
    this.UpdateScore(this.GameTime);
    this.DistanceCounter.SetDistance(this.Score);

    /** Update shadow scale**/
    var dist = this.Walls.GetFloorYForX(this.Player.GetX()) - this.Player.GetY();
    var scale = 1 - dist / 350;
    if (scale < 0 || scale > 1)
        scale = 0;
    this.SpriteShadow.setScale(scale, scale);
    this.SpriteShadow.setY(this.Walls.GetFloorYForX(this.SpriteShadow.getX()));

    this.GameTime.reset();
}

DonsterGame.prototype.draw = function(context, view, x_local, y_local)
{
    this.Background.draw(context, view, x_local, y_local);
    this.Walls.draw(context, view, x_local, y_local);
    this.SpriteJumpHelp.draw(context, view, x_local, y_local);
    this.SpriteShootHelp.draw(context, view, x_local, y_local);
    this.Player.draw(context, view, x_local, y_local);
    this.SpriteShadow.draw(context, view, x_local, y_local);
    this.DistanceCounter.draw(context, view, x_local, y_local);
    this.LifeBar.draw(context, view, x_local, y_local);

    if (this.HurtTime > 0)
    {
        this.HurtTop.draw(context, view, x_local, y_local);
        this.HurtBot.draw(context, view, x_local, y_local);
    }
    this.FpsShow.draw(context, view, x_local, y_local);
}

DonsterGame.prototype.ControlCollisions = function()
{
    /** Fall check **/
    var tmpY = this.Walls.GetFloorYForX(this.Player.getBox().getX() + this.Player.getBox().getWidth());

    if (this.Player.GetY() > tmpY)
    {
        /** Check death **/
        var begY = this.Walls.GetFloorYForX(this.Player.getBox().getX());
        if (begY >= this.Height && this.Player.GetY() - tmpY > 20)
        {
            this.LifeBar.Lifes = 0;
        }
        this.Player.StopInfJump(tmpY);
    }
    if (this.Player.GetY() < tmpY && !this.Player.IsJumping())
    {
        this.Player.StartFall();
    }
    /** Pickable heart collision **/
    var hx;
    if ((hx = this.Walls.IsTouchingHeart(this.Player)) > 0)
    {
        GlobalSoundManager.getPlayableSound(4).play();
        this.LifeBar.AddLife(hx, this.Walls.GetLifeToPickUp().getY());
    }
    /** Spike Hurt check **/
    if (!this.Player.IsInvincible() && this.Walls.IsTouchingSpikes(this.Player))
    {
        this.HurtTime = 150;
        this.LifeBar.RemoveLife();
        this.Player.SpikeHurt();
    }
    /** Weapon shoot monster check **/
    if (this.Player.getWeapon().IsShooting())
    {
        this.Walls.CheckCollisonShoot(this.Player.getWeapon());
    }
    /** Player hurt monster check **/
    if (this.Walls.CheckCollisionPlayer(this.Player))
    {
        if (!this.Player.IsInvincible())
        {
            this.HurtTime = 150;
            this.LifeBar.RemoveLife();
            this.Player.SpikeHurt();
        }
    }
}

DonsterGame.prototype.UpdateScore = function(GameTime)
{
    this.Score += (this.Speed * GameTime.GetElapsedTime() / 5000);
}

DonsterGame.prototype.GetSpeed = function()
{
    return this.Speed;
}

DonsterGame.prototype.GetWidth = function()
{
    return this.Width;
}

DonsterGame.prototype.GetHeight = function()
{
    return this.Height;
}

DonsterGame.prototype.GetUpPressed = function()
{
    return this.UpPressed;
}

DonsterGame.prototype.SetUpPressed = function(value)
{
    if (value == true && this.SpriteJumpHelp.getAlpha() > 0)
    {
        this.SpriteJumpHelp.setAlpha(this.SpriteJumpHelp.getAlpha() - 0.05);
    }
    this.UpPressed = value;
}

DonsterGame.prototype.GetRightPressed = function()
{
    return this.RightPressed;
}

DonsterGame.prototype.SetRightPressed = function(value)
{
    if (value == true && this.SpriteShootHelp.getAlpha() > 0)
    {
        this.SpriteShootHelp.setAlpha(this.SpriteShootHelp.getAlpha() - 0.05);
    }
    this.RightPressed = value;
}

DonsterGame.prototype.getX = function()
{
    return 0;
}

DonsterGame.prototype.getY = function()
{
    return 0;
}

DonsterGame.prototype.getWidth = function()
{
    return this.Width;
}

DonsterGame.prototype.getHeight = function()
{
    return this.Height;
}

DonsterGame.prototype.isLost = function()
{
    return (this.LifeBar.GetLifes() <= 0);
}

DonsterGame.prototype.getScore = function()
{
    return this.Score;
}