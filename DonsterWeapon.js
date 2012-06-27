/**
 * Created with JetBrains WebStorm.
 * User: Fabrice
 * Date: 06/06/12
 * Time: 18:01
 * To change this template use File | Settings | File Templates.
 */

function DonsterWeapon(player)
{
    this.Player = player;
    this.Img = new Image();
    this.Img.src = "images/shotgun.png";
    this.Width = 128;
    this.Height = 64;
    this.Sprite_idx = 0;
    this.ElapsedTime = 0;
    this.TimeUpdate = 20;
    this.isShooting = false;
    this.x = 0;
    this.y = 0;

    this.Sprites = new Array();
    this.Box = new CollisionBox(this.x, this.y, this.Width, this.Height);
    this.LoadSprites();
}

DonsterWeapon.prototype.LoadSprites = function()
{
    var tmpRec;
    var tmpSprite;
    var i;

    for (i = 0; i < 8; i++)
    {
        tmpRec = new ImageRect(this.Img, i * 64, 0, 64, 32);
        tmpSprite = new Sprite(0, 0, this.Width, this.Height, tmpRec);
        this.Sprites.push(tmpSprite);
    }
}

DonsterWeapon.prototype.Shoot = function()
{
    if (this.isShooting == false)
    {
        this.isShooting = true;
        this.Sprite_idx = 0;
    }
}

DonsterWeapon.prototype.IsInFireArea = function(x, y, w, h)
{
    if (this.isShooting == true)
    {
        if ((this.x < (x + w) && (this.x + this.Width) > x) && (this.y < (y + h) && (this.y + this.Height) > y))
            return true;
        return false;
    }
    return false;
}

DonsterWeapon.prototype.IsShooting = function()
{
    return this.isShooting;
}

DonsterWeapon.prototype.Update = function(GameTime)
{
    this.ElapsedTime += GameTime.GetElapsedTime();
    if (this.ElapsedTime > this.TimeUpdate)
    {
        this.Sprite_idx += 1;
        if (this.Sprite_idx > 7)
        {
            this.isShooting = false;
            this.Sprite_idx = 0;
        }
        this.ElapsedTime = 0;
    }
    this.x = this.Player.GetX() - 8;
    this.y = this.Player.GetY() - 20 - (this.Height / 2);
    this.Box.setX(this.x);
    this.Box.setY(this.y);
}

DonsterWeapon.prototype.draw = function(context, view, x_local, y_local)
{
    if (this.isShooting == true)
    {
        this.Sprites[this.Sprite_idx].setX(this.x);
        this.Sprites[this.Sprite_idx].setY(this.y);
        this.Sprites[this.Sprite_idx].draw(context, view, x_local, y_local);
        /** DEBUG **/
        //points = new Text2D(this.Box.getX(), this.Box.getY(), 10, "Calibri", '@');
        //points.setRVBColor(255, 0, 0);
        //points.draw(context, view, x_local, y_local);

        //points = new Text2D(this.Box.getX() +  this.Box.getWidth(), this.Box.getY(), 10, "Calibri", '@');
        //points.setRVBColor(0, 255, 0);
        //points.draw(context, view, x_local, y_local);

        //points = new Text2D(this.Box.getX() + this.Box.getWidth(), this.Box.getY() + this.Box.getHeight(), 10, "Calibri", '@');
        //points.setRVBColor(0, 0, 255);
        //points.draw(context, view, x_local, y_local);

        //points = new Text2D(this.Box.getX(), this.Box.getY() + this.Box.getHeight(), 10, "Calibri", '@');
        //points.setRVBColor(255, 255, 255);
        //points.draw(context, view, x_local, y_local);
        /** DEBUG **/
    }
}

DonsterWeapon.prototype.getX = function()
{
    return this.x;
}

DonsterWeapon.prototype.getY = function()
{
    return this.y;
}

DonsterWeapon.prototype.getWidth = function()
{
    return this.Width;
}

DonsterWeapon.prototype.getHeight = function()
{
    return this.Height;
}

DonsterWeapon.prototype.getBox = function()
{
    return this.Box;
}