/**
 * Created with JetBrains WebStorm.
 * User: Fabrice
 * Date: 08/06/12
 * Time: 12:53
 * To change this template use File | Settings | File Templates.
 */

function DonsterLifeBar(game, y, img_basic, img_grey, img_regen, img_pickup, img_explode, lifes)
{
    this.Game = game;
    this.ImgBasic = img_basic;
    this.ImgGrey = img_grey;
    this.ImgRegen = img_regen;
    this.ImgPickup = img_pickup;
    this.ImgExplode = img_explode;
    this.Lifes = 0;
    this.MaxLife = this.Lifes;
    this.Hearts = new Array();
    this.DeadHeartCompenser;
    this.y = y;
    this.LoadHearts(lifes);
}

DonsterLifeBar.prototype.LoadHearts = function(lifes)
{
    var i;

    for (i = 0; i < lifes; i++)
    {
        this.Lifes += 1;
        if (this.MaxLife < this.Lifes)
            this.MaxLife = this.Lifes;
        this.Hearts.push(new DonsterLife(this.ImgBasic, this.ImgGrey, this.ImgRegen, this.ImgPickup, this.ImgExplode, ModeNormal));
    }
    this.DeadHeartCompenser = new DonsterLife(this.ImgBasic, this.ImgGrey, this.ImgRegen, this.ImgPickup, this.ImgExplode, ModeDead);
}

DonsterLifeBar.prototype.AddLife = function(bx, by)
{
    this.Lifes += 1;
    var life = new DonsterLife(this.ImgBasic, this.ImgGrey, this.ImgRegen, this.ImgPickup, this.ImgExplode, ModeRegen);
    var fx = this.Game.GetWidth() - 6 - ((this.Lifes) * 18);
    var fy = this.y;
    life.StartPickUpAnimation(this, bx, by, fx, fy);
    if (this.MaxLife < this.Lifes)
        this.Hearts.push(life);
    else
        this.Hearts[this.Lifes - 1] = life;
    if (this.MaxLife < this.Lifes)
        this.MaxLife = this.Lifes;
}

DonsterLifeBar.prototype.RemoveLife = function()
{
    if (this.Lifes > 0)
    {
        this.Lifes -= 1;
        this.Hearts[this.Lifes].setMode(ModeDead);
    }
}

DonsterLifeBar.prototype.Update = function(GameTime)
{
    var i;
    for (i = 0; i < this.MaxLife; i++)
    {
        this.Hearts[i].Update(GameTime);
    }
}

DonsterLifeBar.prototype.draw = function(context, view, x_local, y_local)
{
    var i;
    for (i = 0; i < this.MaxLife; i++)
    {
        if (this.Hearts[i].getMode() == ModeRegen)
        {
            this.DeadHeartCompenser.setX(this.Game.GetWidth() - 6 - ((i + 1) * 18));
            this.DeadHeartCompenser.draw(context, view, x_local, y_local);
        }
        this.Hearts[i].setX(this.Game.GetWidth() - 6 - ((i + 1) * 18));
        this.Hearts[i].draw(context, view, x_local, y_local);
    }
}

DonsterLifeBar.prototype.GetLifes = function()
{
    return this.Lifes;
}

DonsterLifeBar.prototype.getX = function()
{
    return 0;
}

DonsterLifeBar.prototype.getY = function()
{
    return this.y;
}