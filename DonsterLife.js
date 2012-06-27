/**
 * Created with JetBrains WebStorm.
 * User: Fabrice
 * Date: 08/06/12
 * Time: 11:38
 * To change this template use File | Settings | File Templates.
 */

var ModeNormal = 0;
var ModeDead = 1;
var ModeExplode = 2;
var ModePickup = 3;
var ModeRegen = 4;

function DonsterLife(img_basic, img_grey, img_regen, img_pickup, img_explode, mode)
{
    this.Mode = mode;
    this.time_update = 30;
    this.ElapsedTime = 0;
    this.Width = 32;
    this.Height = 32;
    this.xFinal = 0;
    this.yFinal = 0;
    this.PickedPositions;
    if (this.Mode == ModePickup || this.Mode == ModeRegen)
    {
        this.Width *= 2;
        this.Height *= 2;
    }
    this.x = 0;
    this.y = 44;
    this.Img_basic = img_basic;
    this.Img_grey = img_grey;
    this.Img_regen = img_regen;
    this.Img_pickup = img_pickup;
    this.Img_explode = img_explode;
    this.Sprite_idx = 0;
    this.Pickup_sprites = new Array();
    this.Regen_sprites = new Array();
    this.Explode_sprites = new Array();
    this.Basic_sprite;
    this.Grey_sprite;
    this.LoadSprites();
}

DonsterLife.prototype.LoadSprites = function()
{
    var tmpRec;
    var i;

    tmpRec = new ImageRect(this.Img_basic, 0, 0, 16, 16);
    this.Basic_sprite = new Sprite(this.x, this.y, 16, 16, tmpRec);
    tmpRec = new ImageRect(this.Img_grey, 0, 0, 16, 16);
    this.Grey_sprite = new Sprite(this.x, this.y, 16, 16, tmpRec);
    for (i = 0; i < 8; i++)
    {
        tmpRec = new ImageRect(this.Img_pickup, (i * 32), 0, 32, 32);
        this.Pickup_sprites.push(new Sprite(this.x, this.y, this.Width, this.Height, tmpRec));
    }
    for (i = 0; i < 8; i++)
    {
        tmpRec = new ImageRect(this.Img_regen, (i * 32), 0, 32, 32);
        this.Regen_sprites.push(new Sprite(this.x, this.y, this.Width, this.Height, tmpRec));
    }
    for (i = 0; i < 8; i++)
    {
        tmpRec = new ImageRect(this.Img_explode, (i * 32), 0, 32, 32);
        tmpSprite = new Sprite(this.x, this.y, 32, 32, tmpRec);
        tmpSprite.setCenterPoint(8, 8);
        this.Explode_sprites.push(tmpSprite);
    }
}

DonsterLife.prototype.Update = function(GameTime)
{
    this.ElapsedTime += GameTime.GetElapsedTime();
    if (this.ElapsedTime >= this.time_update)
    {
        if (this.Mode == ModeRegen && this.PickedPositions.length > 0)
        {
            this.PickedPositions.splice(0, 1);
            if (this.PickedPositions.length <= 0)
            {
                this.Sprite_idx = 0;
            }
        }
        this.Sprite_idx += 1;
        if (this.Sprite_idx > 7)
        {
            if (this.Mode == ModeRegen && this.PickedPositions.length <= 0)
            {
                this.Mode = ModeNormal;
            }
            if (this.Mode == ModeExplode)
            {
                this.Mode = ModeDead;
            }
            this.Sprite_idx = 0;
        }
        this.ElapsedTime = 0;
    }
}

DonsterLife.prototype.draw = function(context, view, x_local, y_local)
{
    if (this.Mode == ModeNormal)
    {
        this.Basic_sprite.setX(this.x);
        this.Basic_sprite.draw(context, view, x_local, y_local);
    }
    else if (this.Mode == ModeDead)
    {
        this.Grey_sprite.setX(this.x);
        this.Grey_sprite.draw(context, view, x_local, y_local);
    }
    else if (this.Mode == ModePickup)
    {
        this.Pickup_sprites[this.Sprite_idx].setX(this.x);
        this.Pickup_sprites[this.Sprite_idx].setY(this.y);
        this.Pickup_sprites[this.Sprite_idx].draw(context, view, x_local, y_local);
    }
    else if (this.Mode == ModeRegen)
    {
        if (this.Mode == ModeRegen && this.PickedPositions.length > 0)
        {
            this.Pickup_sprites[this.Sprite_idx].setCenterPoint(24, 24);
            this.Pickup_sprites[this.Sprite_idx].setX(this.PickedPositions[0].GetFirst());
            this.Pickup_sprites[this.Sprite_idx].setY(this.PickedPositions[0].GetSecond());
            this.Pickup_sprites[this.Sprite_idx].draw(context, view, x_local, y_local);
        }
        else
        {
            this.Regen_sprites[this.Sprite_idx].setCenterPoint(24, 24);
            this.Regen_sprites[this.Sprite_idx].setX(this.x);
            this.Regen_sprites[this.Sprite_idx].draw(context, view, x_local, y_local);
        }
    }
    else if (this.Mode == ModeExplode)
    {
        this.Grey_sprite.setX(this.x);
        this.Grey_sprite.draw(context, view, x_local, y_local);
        this.Explode_sprites[this.Sprite_idx].setX(this.x);
        this.Explode_sprites[this.Sprite_idx].draw(context, view, x_local, y_local);
    }
}

DonsterLife.prototype.StartPickUpAnimation = function(LifeBar, bx, by, fx, fy)
{
    this.LifeBar = LifeBar;
    this.setX(bx);
    this.setY(by);
    this.xFinal = fx;
    this.yFinal = fy;

    var tmpDeX = (fx - bx) / 20;
    var tmpDeY = (fy - by) / 20;
    var i;
    this.PickedPositions = new Array();
    this.PickedPositions.push(new DonsterPair(bx, by));
    for (i = 0; i < 20; i++)
    {
        this.PickedPositions.push(new DonsterPair(bx + ((i + 1) * tmpDeX), by + ((i + 1) * tmpDeY)));
    }
    this.Sprite_idx = 0;
    this.Mode = ModeRegen;
}

DonsterLife.prototype.getX = function()
{
    return this.x;
}

DonsterLife.prototype.setX = function(value)
{
    this.x = value;
}

DonsterLife.prototype.getY = function()
{
    return this.y;
}

DonsterLife.prototype.setY = function(value)
{
    this.y = value;
}

DonsterLife.prototype.GetWidth = function()
{
    return this.Width;
}

DonsterLife.prototype.GetHeight = function()
{
    return this.Height;
}

DonsterLife.prototype.setMode = function(mode)
{
    if (mode == ModeDead)
    {
        this.Mode = ModeExplode;
        this.Sprite_idx = 0;
    }
    else
    {
        this.Mode = mode;
    }
}

DonsterLife.prototype.getMode = function()
{
    return this.Mode;
}

DonsterLife.prototype.getX = function()
{
    return this.x;

}

DonsterLife.prototype.getY = function()
{
    return this.y;
}