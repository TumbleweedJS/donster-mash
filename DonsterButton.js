/**
 * Created with JetBrains WebStorm.
 * User: Fabrice
 * Date: 28/06/12
 * Time: 10:33
 * To change this template use File | Settings | File Templates.
 */

function DonsterButton(x, y, w, h, img, img_press)
{
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.img = img;
    this.img_press = img_press;
    this.is_pressed = false;
    this.is_released = false;
    this.Box = new CollisionBox(x, y, w, h);
    this.LoadResources();
}

DonsterButton.prototype.LoadResources = function()
{
    var tmpRec;

    tmpRec = new ImageRect(this.img, 0, 0, this.width, this.height);
    this.SpriteBtn = new Sprite(this.x, this.y, this.width, this.height, tmpRec);
    tmpRec = new ImageRect(this.img_press, 0, 0, this.width, this.height);
    this.SpriteBtnPressed = new Sprite(this.x, this.y, this.width, this.height, tmpRec);
}

DonsterButton.prototype.Update = function()
{
    if (this.is_pressed == true)
    {
        this.is_released = true;
    }
    else
    {
        this.is_released = false;
    }
    this.is_pressed = false;
}

DonsterButton.prototype.HandleClick = function(x, y)
{
    if (this.Box.isPointInside(x, y))
    {
        this.is_pressed = true;
        this.is_released = false;
    }
    else
    {
        this.is_released = false;
        this.is_pressed = false;
    }
}

DonsterButton.prototype.draw = function(context, view, x_local, y_local)
{
    if (this.is_pressed)
    {
        this.SpriteBtnPressed.draw(context, view, x_local, y_local);
    }
    else
    {
        this.SpriteBtn.draw(context, view, x_local, y_local);
    }
}

DonsterButton.prototype.IsPressed = function()
{
    return this.is_pressed;
}

DonsterButton.prototype.IsReleased = function()
{
    return this.is_released;
}