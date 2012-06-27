/**
 * Created with JetBrains WebStorm.
 * User: Fabrice
 * Date: 06/06/12
 * Time: 13:07
 * To change this template use File | Settings | File Templates.
 */

var WallBeginIdx = 0;
var WallEndIdx = 1;
var WallMidIdx = 2;
var WallStairIdx = 3;
var WallHoleIdx = 4;
var WallSpikeIdx = 5;

function DonsterWall(game, imgWalls, img_spikes, img_monster, life_to_pick_up)
{
    this.Game = game;
    this.ImgWalls = imgWalls;
    this.ImgSpikes = img_spikes;
    this.ImgMonster = img_monster;
    this.SpikeSprite;
    this.SpikeFloorDecal = 24;
    this.WallPartWidth = 128;
    this.WallFloorDecal = 78;
    this.CurrentWalls = new Array();
    this.WallParts = new Array();
    this.WallParts.push(new Array());
    this.WallParts.push(new Array());
    this.WallParts.push(new Array());
    this.WallParts.push(new Array());
    this.WallParts.push(new Array());
    this.WallParts.push(new Array());
    this.FakeRandom = new Array();
    this.Begin = 0;
    this.LifeToPickUp = life_to_pick_up;
    this.LifeToPickUp.setX(-10000);
    this.LifeToPickUp.setY(250);
    this.HeartPosX = Math.round(5000 + Math.random() * 300 * this.Game.GetSpeed());
    this.Monsters = new Array();
    this.DeadMonsters = new Array();
    this.LoadWalls();
    this.LoadSpikes();
    this.LoadFakeRandom();
}

DonsterWall.prototype.LoadWalls = function()
{
    var i;
    for (i = 0; i < this.ImgWalls.length; i++)
    {
        this.WallSplitter(this.ImgWalls[i]);
    }
}

DonsterWall.prototype.LoadSpikes = function()
{
    var tmpRec = new ImageRect(this.ImgSpikes, 0, 0, 32, 32);
    this.SpikeSprite = new Sprite(0, 0, 64, 64, tmpRec);
}

DonsterWall.prototype.WallSplitter = function(imgWall)
{
    var tmpRec;

    tmpRec = new ImageRect(imgWall, 0, 0, 64, 256);
    var tmpSprite = new Sprite(0, 0, this.WallPartWidth, 512, tmpRec);
    tmpSprite.setScale(-1, 1);
    tmpSprite.setCenterPoint(this.WallPartWidth, 0);
    this.WallParts[WallEndIdx].push(tmpSprite);

    tmpRec = new ImageRect(imgWall, 0, 0, 64, 256);
    this.WallParts[WallBeginIdx].push(new Sprite(0, 0, this.WallPartWidth, 512, tmpRec));

    tmpRec = new ImageRect(imgWall, 64, 0, 64, 256);
    this.WallParts[WallMidIdx].push(new Sprite(0, 0, this.WallPartWidth, 512, tmpRec));
    this.WallParts[WallSpikeIdx].push(new Sprite(0, 0, this.WallPartWidth, 512, tmpRec));
    tmpRec = new ImageRect(imgWall, 128, 0, 64, 256);
    this.WallParts[WallMidIdx].push(new Sprite(0, 0, this.WallPartWidth, 512, tmpRec));
    this.WallParts[WallSpikeIdx].push(new Sprite(0, 0, this.WallPartWidth, 512, tmpRec));

    tmpRec = new ImageRect(imgWall, 192, 0, 64, 256);
    if (imgWall.id == 1)
    {
        this.WallParts[WallStairIdx].push(new Sprite(0, 0, this.WallPartWidth, 512, tmpRec))
    }
    else
    {
        this.WallParts[WallMidIdx].push(new Sprite(0, 0, this.WallPartWidth, 512, tmpRec))
    }
    tmpRec = new ImageRect(imgWall, 0, 0, 1, 256);
    this.WallParts[WallHoleIdx].push(new Sprite(0, 0, this.WallPartWidth, 512, tmpRec));
}

DonsterWall.prototype.RamdomizeNextY = function(lastY)
{
    if (lastY > (256 + 64))
        var y = lastY - Math.floor(Math.random() * 64);
    var y = 256 + Math.floor(Math.random() * 92);
    return y;
}

DonsterWall.prototype.AppendWallPart = function()
{
    var pos = Math.floor(Math.random() * this.FakeRandom.length);
    var Y = 256;
    var i;
    var StairBefore = false;

    if (this.CurrentWalls.length < 6)
        pos = 0;
    if (this.CurrentWalls.length > 0)
    {
        Y = this.CurrentWalls[this.CurrentWalls.length - 1].GetThird();
    }
    while (pos == 1 && Y > (256 + 84)) // Stair trop bas
    {
        pos = Math.floor(Math.random() * this.FakeRandom.length);
    }
    for (i = 0; i < this.FakeRandom[pos].length; i++)
    {
        var tmpRdm = Math.floor(Math.random() * this.WallParts[this.FakeRandom[pos][i]].length);
        if (this.FakeRandom[pos][i] == WallBeginIdx)
            Y = this.RamdomizeNextY(Y);
        if (StairBefore)
        {
            Y += 128;
            StairBefore = false;
        }
        var part;
        var c;
        var RangeMultiplier = ((this.Game.Speed - 100) / 90);
        for (c = 0; c < RangeMultiplier; c++) // Range multiplier
        {
            if (this.FakeRandom[pos][i] == WallHoleIdx)
            {
                part = new DonsterTrio(this.FakeRandom[pos][i], tmpRdm, this.Game.GetHeight());
            }
            else if (this.FakeRandom[pos][i] == WallStairIdx)
            {
                StairBefore = true;
                part = new DonsterTrio(this.FakeRandom[pos][i], tmpRdm, Y);
            }
            else
            {
                if (this.CurrentWalls.length > 10 && this.FakeRandom[pos][i] == WallMidIdx) /** Random monster pop **/
                {
                    var popRand =  Math.floor(Math.random() * 100);
                    if (popRand < 50)
                    {
                        var newMonster = new DonsterMonster(this.Game, this.ImgMonster);
                        if (popRand < 20)
                        {
                            newMonster.setDirection(DIR_LEFT);
                        }
                        newMonster.setX(this.Begin + ((this.CurrentWalls.length - 1) * this.WallPartWidth));
                        this.Monsters.push(newMonster);
                    }
                }
                part = new DonsterTrio(this.FakeRandom[pos][i], tmpRdm, Y);
            }
            this.CurrentWalls.push(part);
            if (this.FakeRandom[pos][i] == WallBeginIdx || this.FakeRandom[pos][i] == WallEndIdx || this.FakeRandom[pos][i] == WallStairIdx)
            {
                break;
            }
        }
    }
}

DonsterWall.prototype.Update = function(GameTime)
{
    var tmpDiff = (this.Game.GetSpeed() * GameTime.GetElapsedTime() / 200);
    this.Begin -= tmpDiff;
    this.HeartPosX -= tmpDiff;
    while (this.Begin < -this.WallPartWidth)
    {
        this.CurrentWalls.splice(0, 1);
        this.Begin += this.WallPartWidth;
    }
    while (this.CurrentWalls.length < ((this.Game.GetWidth() / this.WallPartWidth) + 2))
    {
        this.AppendWallPart();
    }
    this.UpdateMonster(GameTime, tmpDiff);
    this.UpdateHeartToPickUp(GameTime);
}

DonsterWall.prototype.IsTouchingHeart = function(Player)
{
    /** Pickup heart check **/
    if (this.LifeToPickUp.getX() >= Player.GetX()
        || this.LifeToPickUp.getX() + this.LifeToPickUp.GetWidth() <= Player.GetX() - Player.GetWidth()
        || this.LifeToPickUp.getY() >= Player.GetY()
        || this.LifeToPickUp.getY() + this.LifeToPickUp.GetHeight() <= Player.GetY() - Player.GetHeight()
        )
    {
        return 0;
    }
    var tmpRet = this.HeartPosX;
    this.HeartPosX = -10000;
    return tmpRet;
}

DonsterWall.prototype.UpdateMonster = function(GameTime, distMove)
{
    var i;
    var newX;
    var newY;
    var monsterMove = GameTime.GetElapsedTime() / 10;

    for (i = 0; i < this.Monsters.length; i++)
    {
        if (this.Monsters[i].getDirection() == DIR_LEFT)
        {
            newX = this.Monsters[i].getX();
            newX += (-distMove - (monsterMove));
        }
        else
        {
            newX = this.Monsters[i].getX();
            newX += (-distMove + (monsterMove));
        }
        newY = this.GetFloorYForX(this.Monsters[i].getX());
        this.Monsters[i].setX(newX);
        this.Monsters[i].setY(newY);
        this.Monsters[i].Update(GameTime);
        if (this.Monsters[i].getX() < -128 || this.Monsters[i].getY() >= this.Game.GetHeight() - 50)
        {
            this.Monsters.splice(i, 1);
            i--;
        }
    }
    for (i = 0; i < this.DeadMonsters.length; i++)
    {
        this.DeadMonsters[i].setX(this.DeadMonsters[i].getX() - distMove);
        this.DeadMonsters[i].Update(GameTime);
        if (this.DeadMonsters[i].IsDead())
        {
            this.DeadMonsters.splice(i, 1);
            i--;
        }
    }
}

DonsterWall.prototype.UpdateHeartToPickUp = function(GameTime)
{
    if (this.HeartPosX < -100)
    {
        this.HeartPosX = Math.round(5000 + Math.random() * 300 * this.Game.GetSpeed());
    }
    this.LifeToPickUp.setX(this.HeartPosX);
    this.LifeToPickUp.Update(GameTime);
}

DonsterWall.prototype.draw = function(context, view, x_local, y_local)
{
    var i;
    var tmpX;

    for (i = 0; i < this.CurrentWalls.length; i++)
    {
        tmpX = this.Begin + (i * this.WallPartWidth);
        var spriteToDraw = this.WallParts[this.CurrentWalls[i].GetFirst()][this.CurrentWalls[i].GetSecond()];
        spriteToDraw.setY(this.CurrentWalls[i].GetThird());
        spriteToDraw.setX(tmpX);
        spriteToDraw.draw(context, view, x_local, y_local);
        if (this.CurrentWalls[i].GetFirst() == WallSpikeIdx)
        {
            this.SpikeSprite.setX(tmpX);
            this.SpikeSprite.setY(this.CurrentWalls[i].GetThird() + this.SpikeFloorDecal);
            this.SpikeSprite.draw(context, view, x_local, y_local);
            this.SpikeSprite.setX(tmpX + this.WallPartWidth / 2);
            this.SpikeSprite.draw(context, view, x_local, y_local);
        }
    }

    for (i = 0; i < this.Monsters.length; i++)
    {
        this.Monsters[i].draw(context, view, x_local, y_local);
    }
    for (i = 0; i < this.DeadMonsters.length; i++)
    {
        this.DeadMonsters[i].draw(context, view, x_local, y_local);
    }

    this.LifeToPickUp.draw(context, view, x_local, y_local);
}

DonsterWall.prototype.GetFloorYForX = function(x)
{
    var i;

    for (i = 0; i < this.CurrentWalls.length; i++)
    {
        if (x < (this.Begin + (i * this.WallPartWidth) + 64))
        {
            break;
        }
    }
    if (i >= this.CurrentWalls.length)
       return 0;
    return (this.CurrentWalls[i].GetThird() + this.WallFloorDecal);
}

DonsterWall.prototype.IsTouchingSpikes = function(player)
{
    /** Spike hurt check **/
    var critPointX = player.GetX() - 15;
    var critPointY = player.GetY()- 15;
    var i;

    for (i = 0; i < this.CurrentWalls.length; i++)
    {
        if (critPointX < (this.Begin + (i * this.WallPartWidth) + this.WallPartWidth)
            && critPointX > (this.Begin + (i * this.WallPartWidth)))
        {
            break;
        }
    }
    if (this.CurrentWalls[i].GetFirst() != WallSpikeIdx)
    {
        return false;
    }
    if (critPointY >= this.CurrentWalls[i].GetThird() + this.SpikeFloorDecal)
    {
        return true;
    }
    return false;
}

DonsterWall.prototype.CheckCollisonShoot = function(x, y, w, h)
{
    var i;

    x += 20;
    y += 10;
    w -= 40;
    h -= 20;
    for (i = 0; i < this.Monsters.length; i++)
    {
        var monster = this.Monsters[i];
        if((monster.getX() > x + w)
            || (monster.getX() + monster.getWidth() < x)
            || (monster.getY() < y)
            || (monster.getY() - monster.getHeight() > y + h))
        {
        }
        else
        {
            monster.Kill();
            this.DeadMonsters.push(monster);
            this.Monsters.splice(i, 1);
            i--;
        }
    }
}

DonsterWall.prototype.CheckCollisionPlayer = function(x, y, w, h)
{
    var i;

    x -= 10;
    y -= 10;
    w -= 20;
    h -= 20;
    for (i = 0; i < this.Monsters.length; i++)
    {
        var monster = this.Monsters[i];
        if((monster.getX() > x)
            || (monster.getX() + monster.getWidth() < x - w)
            || (monster.getY() < y)
            || (monster.getY() - monster.getHeight() > y + h))
        {
        }
        else
        {
            return true;
        }
    }
}

DonsterWall.prototype.LoadFakeRandom = function()
{
    var tmpArray;
    var i;

    /** Simple mid line **/
    tmpArray = new Array();
    for (i = 0; i < 10; i++)
        tmpArray.push(WallMidIdx);
    this.FakeRandom.push(tmpArray);

    /** Simple stair line **/
    tmpArray = new Array();
    for (i = 0; i < 8; i++)
        tmpArray.push(WallMidIdx);
    tmpArray.push(WallStairIdx);
    tmpArray.push(WallMidIdx);
    tmpArray.push(WallMidIdx);
    tmpArray.push(WallSpikeIdx);
    tmpArray.push(WallMidIdx);
    this.FakeRandom.push(tmpArray);

    /** Line with a hole **/
    tmpArray = new Array();
    for (i = 0; i < 6; i++)
        tmpArray.push(WallMidIdx);
    tmpArray.push(WallEndIdx);
    tmpArray.push(WallHoleIdx);
    tmpArray.push(WallHoleIdx);
    tmpArray.push(WallBeginIdx);
    for (i = 0; i < 9; i++)
        tmpArray.push(WallMidIdx);
    this.FakeRandom.push(tmpArray);

    /**  Two little plateforms **/
    tmpArray = new Array();
    tmpArray.push(WallMidIdx);
    tmpArray.push(WallEndIdx);
    tmpArray.push(WallHoleIdx);
    tmpArray.push(WallHoleIdx);
    tmpArray.push(WallBeginIdx);
    tmpArray.push(WallMidIdx);
    tmpArray.push(WallMidIdx);
    tmpArray.push(WallSpikeIdx);
    tmpArray.push(WallMidIdx);
    tmpArray.push(WallMidIdx);
    tmpArray.push(WallEndIdx);
    tmpArray.push(WallHoleIdx);
    tmpArray.push(WallBeginIdx);
    tmpArray.push(WallMidIdx);
    tmpArray.push(WallMidIdx);
    tmpArray.push(WallMidIdx);
    this.FakeRandom.push(tmpArray);

    /**  Three little plateforms **/
    tmpArray = new Array();
    tmpArray.push(WallMidIdx);
    tmpArray.push(WallMidIdx);
    tmpArray.push(WallMidIdx);
    tmpArray.push(WallEndIdx);
    tmpArray.push(WallHoleIdx);
    tmpArray.push(WallHoleIdx);
    tmpArray.push(WallHoleIdx);
    tmpArray.push(WallBeginIdx);
    tmpArray.push(WallMidIdx);
    tmpArray.push(WallMidIdx);
    tmpArray.push(WallMidIdx);
    tmpArray.push(WallMidIdx);
    tmpArray.push(WallMidIdx);
    tmpArray.push(WallMidIdx);
    tmpArray.push(WallEndIdx);
    tmpArray.push(WallHoleIdx);
    tmpArray.push(WallBeginIdx);
    tmpArray.push(WallMidIdx);
    tmpArray.push(WallMidIdx);
    tmpArray.push(WallMidIdx);
    tmpArray.push(WallSpikeIdx);
    tmpArray.push(WallMidIdx);
    tmpArray.push(WallEndIdx);
    tmpArray.push(WallHoleIdx);
    tmpArray.push(WallHoleIdx);
    tmpArray.push(WallBeginIdx);
    tmpArray.push(WallMidIdx);
    tmpArray.push(WallMidIdx);
    tmpArray.push(WallMidIdx);
    tmpArray.push(WallMidIdx);
    this.FakeRandom.push(tmpArray);

    /** Line with Spikes**/
    tmpArray = new Array();
    for (i = 0; i < 3; i++)
        tmpArray.push(WallMidIdx);
    tmpArray.push(WallSpikeIdx);
    for (i = 0; i < 4; i++)
        tmpArray.push(WallMidIdx);
    this.FakeRandom.push(tmpArray);

    /** Line with Spikes**/
    tmpArray = new Array();
    for (i = 0; i < 3; i++)
        tmpArray.push(WallMidIdx);
    tmpArray.push(WallSpikeIdx);
    tmpArray.push(WallSpikeIdx);
    for (i = 0; i < 2; i++)
        tmpArray.push(WallMidIdx);
    this.FakeRandom.push(tmpArray);

    /** Line with Spikes**/
    tmpArray = new Array();
    for (i = 0; i < 3; i++)
        tmpArray.push(WallMidIdx);
    tmpArray.push(WallSpikeIdx);
    tmpArray.push(WallSpikeIdx);
    for (i = 0; i < 4; i++)
        tmpArray.push(WallMidIdx);
    this.FakeRandom.push(tmpArray);
}

DonsterWall.prototype.GetLifeToPickUp = function()
{
    return this.LifeToPickUp;
}
