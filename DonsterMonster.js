/**
 * Created with JetBrains WebStorm.
 * User: Fabrice
 * Date: 21/06/12
 * Time: 13:30
 * To change this template use File | Settings | File Templates.
 */

var DIR_RIGHT = 1;
var DIR_LEFT = 2;

function DonsterMonster(game, img)
{
    this.Img = img;
    this.Game = game;
    this.X = 0;
    this.Y = 0;
    this.Width = 64;
    this.Height = 64;
    this.ElapsedTime = 0;
    this.sprites = new Array();
    this.sprites_revert = new Array();
    this.sprite_type = 0;
    this.sprite_idx = 0;
    this.time_sprite_update = 90;
    this.time_move_update = 40;
    this.direction = DIR_LEFT;
    this.is_dead = false;
    this.Box = new CollisionBox(this.X, this.Y, this.Width - 8, this.Height);
    this.LoadMonster();
}

DonsterMonster.prototype.LoadMonster = function()
{
    var x = 0;
    var y = 0;
    var le = 0;

    for (y = 0; y < 256; y += 32)
    {
        this.sprites.push(new Array());
        this.sprites_revert.push(new Array());
        for (x = 0; x < 256; x += 32)
        {
            var tmpRec = new ImageRect(this.Img, x, y, 32, 32);
            var tmpSprite = new Sprite(this.X, this.Y, 64, 64, tmpRec);
            var tmpSpriteRevert = new Sprite(this.X, this.Y, 64, 64, tmpRec);

            tmpSprite.setCenterPoint(0, 64);

            tmpSpriteRevert.setCenterPoint(0, 64);
            tmpSpriteRevert.setScale(-1, 1);
            tmpSpriteRevert.setCenterPoint(64, 64);

            this.sprites[le].push(tmpSprite);
            this.sprites_revert[le].push(tmpSpriteRevert);
        }
        le += 1;
    }
}

DonsterMonster.prototype.Update = function(GameTime)
{
    this.ElapsedTime += GameTime.GetElapsedTime();
    if (this.ElapsedTime > this.time_sprite_update)
    {
        this.sprite_idx += 1;
        if (this.sprite_idx >= this.sprites[this.sprite_type].length)
        {
            if (this.sprite_type == 3)
            {
                this.is_dead = true;
            }
            this.sprite_idx = 0;
        }
        this.ElapsedTime = 0;
    }
    this.Box.setX(this.X);
    this.Box.setY(this.Y - this.Height + 5);
}

DonsterMonster.prototype.Kill = function()
{
    this.sprite_idx = 0;
    this.sprite_type = 3;
}

DonsterMonster.prototype.draw = function(context, view, x_local, y_local)
{
    var CurSprites = this.sprites;
    if (this.getDirection() == DIR_LEFT)
    {
        CurSprites = this.sprites_revert;
    }

    CurSprites[this.sprite_type][this.sprite_idx].setX(this.X);
    CurSprites[this.sprite_type][this.sprite_idx].setY(this.Y);
    CurSprites[this.sprite_type][this.sprite_idx].draw(context, view, x_local, y_local);

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

DonsterMonster.prototype.setX = function(x)
{
    this.X = x;
}

DonsterMonster.prototype.getX = function()
{
    return this.X;
}

DonsterMonster.prototype.setY = function(y)
{
    this.Y = y;
}
DonsterMonster.prototype.getY = function()
{
    return this.Y;
}

DonsterMonster.prototype.getWidth = function()
{
    return this.Width;
}

DonsterMonster.prototype.getHeight = function()
{
    return this.Height;
}

DonsterMonster.prototype.setDirection = function(direction)
{
    if (direction == DIR_LEFT || direction == DIR_RIGHT)
        this.direction = direction;
}

DonsterMonster.prototype.getDirection = function()
{
    return this.direction;
}

DonsterMonster.prototype.changeDirection = function()
{
    if (this.direction == DIR_LEFT)
    {
        this.direction = DIR_RIGHT;
    }
    else
    {
        this.direction = DIR_LEFT
    }
}

DonsterMonster.prototype.IsDead = function()
{
    return this.is_dead;
}

DonsterMonster.prototype.getBox = function()
{
    return this.Box;
}