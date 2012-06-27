/**
 * Created with JetBrains WebStorm.
 * User: Fabrice
 * Date: 06/06/12
 * Time: 15:06
 * To change this template use File | Settings | File Templates.
 */

function DonsterJump()
{
    this._jump = false;
    this._t = 0;
    this._g = 0.96;
    this._m = 10;
    this._scaleMove = 1;
    this._scale = 0.2; // for 0.35 base value - player update move = 30
    this._nbJump = -1;
    this._nbJumpVar = this._nbJump;
    this._ready = false;
    this._xinit = 0;
    this._yinit = 0;
}

DonsterJump.prototype.Initialize = function(velocity, phi, masse, gravity)
{
    this._V = velocity;
    this._phi = phi;
    this._m = masse;
    this._g = gravity;
    this._ready = true;
}

DonsterJump.prototype.Start = function(pos)
{
    if (this._ready == false)
        return false;
    if (this._nbJumpVar != -1)
    {
        if (this._nbJumpVar == 0)
            return false;
        this._nbJumpVar--;
    }
    this._t = 0;
    this._xinit = pos.GetFirst();
    this._yinit = pos.GetSecond();
    this._jump = true;
    return true;
}

DonsterJump.prototype.Stop = function()
{
    this._t = 0;
    this._jump = false;
    this._nbJumpVar = this._nbJump;
}

DonsterJump.prototype.UpdateAction = function()
{
    var x;
    var y;

    x = (this._V * this._t) * Math.cos(this._phi) + this._xinit;
    y = 0.5 * this._m * this._g * (Math.pow(this._t, 2)) - (this._V * this._t) * Math.sin(this._phi) + this._yinit;
    this._t += this._scale;
    return (new DonsterPair(x, y));
}

DonsterJump.prototype.GetNbJump = function()
{
    return this._nbJump;
}

DonsterJump.prototype.SetNbJump = function(value)
{
    this._nbJump = value;
    this._nbJumpVar = value;
}

DonsterJump.prototype.GetScale = function()
{
    return this._scale;
}

DonsterJump.prototype.SetScale = function(value)
{
    this._scale = value;
}

DonsterJump.prototype.GetVelocity = function()
{
    if (this._ready == false)
        return -1;
    return this._V;
}

DonsterJump.prototype.SetVelocity = function(value)
{
    this._V = value;
}

DonsterJump.prototype.GetPhi = function()
{
    if (this._ready == false)
        return -1;
    return this._phi;
}

DonsterJump.prototype.SetPhi = function(value)
{
    this._phi = value;
    this._phi = Math.PI * _phi / 180;
}

DonsterJump.prototype.GetMasse = function()
{
    if (this._ready == false)
        return -1;
    return this._m;
}

DonsterJump.prototype.SetMasse = function(value)
{
    this._m = value;
}

DonsterJump.prototype.GetGravity = function()
{
    if (this._ready == false)
        return -1;
    return this._g;
}

DonsterJump.prototype.SetGravity = function(value)
{
    this._g = value;
}

DonsterJump.prototype.GetScaleMove = function()
{
    if (this._ready == false)
        return -1;
    return this._scaleMove;
}

DonsterJump.prototype.SetScaleMove = function(value)
{
    this._scaleMove = value;
}

DonsterJump.prototype.GetPosition = function()
{
    return new DonsterPair(this._xinit, this._yinit);
}

DonsterJump.prototype.IsJumping = function()
{
    return this._jump;
}

DonsterJump.prototype.Left = function()
{
    this._xinit -= this._scaleMove;
}

DonsterJump.prototype.Right = function()
{
    this._xinit += this._scaleMove;
}
