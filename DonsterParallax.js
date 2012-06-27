/**
 * Created with JetBrains WebStorm.
 * User: Fabrice
 * Date: 06/06/12
 * Time: 10:57
 * To change this template use File | Settings | File Templates.
 */

function DonsterParallax(game, imgs)
{
    this.Game = game;
    this.Sprites = new Array();
    this.ElapsedTime = 0;
    var i;
    for (i = 0; i < imgs.length; i++)
    {
        var tmpRec = new ImageRect(imgs[i], 0, 0, 512, 512);
        this.Sprites.push(new Sprite(0, 0, this.Game.GetWidth(), this.Game.GetHeight(), tmpRec));
        this.Sprites.push(new Sprite(this.Game.GetWidth(), 0, this.Game.GetWidth(), this.Game.GetHeight(), tmpRec));
    }
}

DonsterParallax.prototype.Update = function(GameTime)
{
    var t;
    var Zcounter = 0.1;
    this.ElapsedTime += GameTime.GetElapsedTime();

    if (this.ElapsedTime > 10)
    {
        for (t = 0; t < this.Sprites.length; t++)
        {
            var tmpRange = (this.Game.GetSpeed() * this.ElapsedTime) / (1000 / Zcounter);
            this.Sprites[t].setX(this.Sprites[t].getX() - tmpRange);
            if (this.Sprites[t].getX() < -(this.Game.GetWidth()))
            {
                this.Sprites[t].setX(this.Sprites[t].getX() + (this.Game.GetWidth() * 2));
            }
            if (t % 2 != 0)
                Zcounter += 0.1;
        }
        this.ElapsedTime = 0;
    }
}

DonsterParallax.prototype.draw = function(context, view, x_local, y_local)
{
    var i;
    for (i = 0; i < this.Sprites.length; i++)
    {
        this.Sprites[i].draw(context, view, x_local, y_local);
    }
}
