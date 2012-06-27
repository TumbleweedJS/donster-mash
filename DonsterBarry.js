/**
 * Created with JetBrains WebStorm.
 * User: Fabrice
 * Date: 05/06/12
 * Time: 18:15
 * To change this template use File | Settings | File Templates.
 */

function DonsterBarry(img, game, x, y)
{
    this.Timer = new MonsterTimer();
    this.Jumper = new DonsterJump();
    this.InvincibleTime = 0;
    this.Weapon = new DonsterWeapon(this);
    this.Width = 64;
    this.Height = 64;
    this.Velocity = 60;
    this.VelocityBlocked = false;
    this.Jumper.Initialize(this.Velocity, 90, 18, 0.96);
    this.Jumper.SetNbJump(1);
    this.Jumper.SetScaleMove(1);
    this.Game = game;
    this.img = img;
    this.x = x;
    this.y = y;
    this.sprites = new Array();
    this.sprite_type = 0;
    this.sprite_idx = 0;
    this.time_sprite_update = 75;
    this.time_move_update = 15;
    this.ElapsedTime_sprite = 0;
    this.ElapsedTime_move = 0;
    this.JumpBeginY = 0;
    this.TimeBetweenShoot = 250;
    this.TimerShootWait = 0;
    this.Box = new CollisionBox(this.x - this.Width, this.y - this.Height, this.Width - 12, this.Height);
    this.LoadSprites();
}

DonsterBarry.prototype.LoadSprites = function()
{
    var x = 0;
    var y = 0;
    var le = 0;

    for (y = 0; y < 256; y += 32)
    {
        this.sprites.push(new Array());
        for (x = 0; x < 256; x += 32)
        {
            var tmpRec = new ImageRect(this.img, x, y, 32, 32);
            var tmpSprite = new Sprite(this.x, this.y, 64, 64, tmpRec);
            tmpSprite.setCenterPoint(64, 64);
            this.sprites[le].push(tmpSprite);
        }
        le += 1;
    }
}

DonsterBarry.prototype.Update = function(GameTime)
{
    this.InvincibleTime -= GameTime.GetElapsedTime();
    this.ElapsedTime_move += GameTime.GetElapsedTime();
    this.ElapsedTime_sprite += GameTime.GetElapsedTime();
    this.Timer.reset();
    this.TimerShootWait -= GameTime.GetElapsedTime();

    /** Sprite Update**/
    if (this.ElapsedTime_sprite > this.time_sprite_update)
    {
        this.sprite_idx += 1;
        if (this.sprite_idx > 7)
        {
            this.sprite_type = 0;
            this.sprite_idx = 0;
        }
        this.ElapsedTime_sprite = 0;
    }
    /** Move update **/
    if (this.ElapsedTime_move > this.time_move_update)
    {
        while (this.ElapsedTime_move > this.time_move_update)
        {
            if (this.Jumper.IsJumping())
            {
                var pos = this.Jumper.UpdateAction();
                this.y = pos.GetSecond();
            }
            this.ElapsedTime_move -= this.time_move_update;
        }
        this.ElapsedTime_move = 0;
    }
    /** Weapon update **/
    this.Weapon.Update(GameTime);
    this.Box.setX(this.x - this.Width + 5);
    this.Box.setY(this.y - this.Height);
}

DonsterBarry.prototype.draw = function(context, view, x_local, y_local)
{
    this.sprites[this.sprite_type][this.sprite_idx].setX(this.x);
    this.sprites[this.sprite_type][this.sprite_idx].setY(this.y);
    this.sprites[this.sprite_type][this.sprite_idx].draw(context, view, x_local, y_local);
    this.Weapon.draw(context, view, x_local, y_local);

    /** DEBUG **/
    //points = new Text2D(this.Box.getX(), this.Box.getY(), 15, "Calibri", '#');
    //points.setRVBColor(255, 0, 0);
    //points.draw(context, view, x_local, y_local);

    //points = new Text2D(this.Box.getX() +  this.Box.getWidth(), this.Box.getY(), 15, "Calibri", '#');
    //points.setRVBColor(0, 255, 0);
    //points.draw(context, view, x_local, y_local);

    //points = new Text2D(this.Box.getX() + this.Box.getWidth(), this.Box.getY() + this.Box.getHeight(), 15, "Calibri", '#');
    //points.setRVBColor(0, 0, 255);
    //points.draw(context, view, x_local, y_local);

    //points = new Text2D(this.Box.getX(), this.Box.getY() + this.Box.getHeight(), 15, "Calibri", '#');
    //points.setRVBColor(255, 255, 255);
    //points.draw(context, view, x_local, y_local);
    /** DEBUG **/
}

DonsterBarry.prototype.HandleTouches = function(upPressed, rightPressed)
{
    /** Jump **/
    if (upPressed == false && this.Jumper.IsJumping())
    {
        this.VelocityBlocked = true;
    }
    if (upPressed == true)
    {
        if (this.Jumper.IsJumping())
        {
            if (this.VelocityBlocked == false && this.Jumper.GetVelocity() < 110)
            {
                this.Jumper.SetVelocity(this.Jumper.GetVelocity() + 5);
            }
            return ;
        }
        this.Jumper.SetVelocity(this.Velocity);
        this.VelocityBlocked = false;
        if (this.Jumper.Start(new DonsterPair(this.x, this.y)) == true)
        {
            GlobalSoundManager.getPlayableSound(2).play();
            this.JumpBeginY = this.y;
            this.sprite_type = 5;
            this.sprite_idx = 0;
        }
    }
    /** Fire **/
    if (rightPressed == true && this.Weapon.IsShooting() == false && this.TimerShootWait <= 0)
    {
        this.TimerShootWait = this.TimeBetweenShoot;
        GlobalSoundManager.getPlayableSound(1).play();
        this.Weapon.Shoot();
        this.sprite_idx = 0;
        this.sprite_type = 1;
    }
}

DonsterBarry.prototype.StopInfJump = function(y)
{
    this.y = y;
    this.Jumper.Stop();

    if (this.JumpBeginY < this.y)
    {
        this.sprite_type = 3;
        this.sprite_idx = 0;
    }
}

DonsterBarry.prototype.StartFall = function()
{
    if (!this.IsJumping())
    {
        this.Jumper.SetVelocity(0);
        this.VelocityBlocked = true;
        this.Jumper.Start(new DonsterPair(this.x, this.y));
        this.JumpBeginY = this.y;
    }
}

DonsterBarry.prototype.SpikeHurt = function()
{
    GlobalSoundManager.getPlayableSound(3).play();
    this.sprite_idx = 3;
    this.sprite_type = 2;
    this.InvincibleTime = 1000;
}

DonsterBarry.prototype.GetX = function()
{
    return this.x;
}

DonsterBarry.prototype.GetY = function()
{
    return this.y;
}

DonsterBarry.prototype.GetWidth = function()
{
    return this.Width;
}

DonsterBarry.prototype.GetHeight = function()
{
    return this.Height;
}

DonsterBarry.prototype.IsJumping = function()
{
    return this.Jumper.IsJumping();
}

DonsterBarry.prototype.IsInvincible = function()
{
    if (this.InvincibleTime > 0)
    {
        return true
    }
    return false;
}

DonsterBarry.prototype.getX = function()
{
    return this.x;
}

DonsterBarry.prototype.getY = function()
{
    return this.y;
}

DonsterBarry.prototype.getWeapon = function()
{
    return this.Weapon;
}

DonsterBarry.prototype.getBox = function()
{
    return this.Box;
}

DonsterBarry.prototype.BounceMonster = function()
{
    this.Jumper.SetVelocity(60);
    this.Jumper.Stop();
    this.Jumper.Start(new DonsterPair(this.x, this.y));
    this.VelocityBlocked = false;
    this.JumpBeginY = this.y + 100;
}
