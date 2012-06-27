/**
 * Created with JetBrains WebStorm.
 * User: Fabrice
 * Date: 07/06/12
 * Time: 19:47
 * To change this template use File | Settings | File Templates.
 */

function DonsterDistanceCounter(game, imgSheet)
{
    this.Distance = 0;
    this.Game = game;
    this.Img = imgSheet;
    this.Numbers = new Array();
    this.Width = 16;
    this.Height = 32;
    this.Marge = 8;
    this.IdMetre = 10;
    this.IdKilometre = 11;
    this.LoadNumbers();
}

DonsterDistanceCounter.prototype.LoadNumbers = function()
{
    var i;

    for (i = 0; i < 16; i++)
    {
        var tmpRec = new ImageRect(this.Img, (i * this.Width), 0, this.Width, this.Height);
        this.Numbers.push(new Sprite(0, this.Marge, this.Width, this.Height, tmpRec));
    }
}

DonsterDistanceCounter.prototype.SetDistance = function(value)
{
    this.Distance = value;
}

DonsterDistanceCounter.prototype.draw = function(context, view, x_local, y_local)
{
    /** Draw "m" symbol **/
    this.Numbers[10].setX(this.Game.GetWidth() - this.Marge - this.Width);
    this.Numbers[10].draw(context, view, x_local, y_local);

    /** Draw distance **/
    var tmpDist = Math.ceil(this.Distance);
    tmpDist = tmpDist.toString();
    var i = 1;

    while (i <= tmpDist.length)
    {
        var pos = tmpDist[tmpDist.length - i];
        var posX = this.Game.GetWidth() - this.Marge + 2 - ((i + 1) * (2 + this.Width));
        this.Numbers[pos].setX(posX);
        this.Numbers[pos].draw(context, view, x_local, y_local);
        i++;
    }
    while (i < 6)
    {
        var posX = this.Game.GetWidth() - this.Marge + 2 - ((i + 1) * (2 + this.Width));
        this.Numbers[12].setX(posX);
        this.Numbers[12].draw(context, view, x_local, y_local);
        i++;
    }
}

DonsterDistanceCounter.prototype.getX = function()
{
    return 0;
}

DonsterDistanceCounter.prototype.getY = function()
{
    return 0;
}