/**
 * Created with JetBrains WebStorm.
 * User: Fabrice
 * Date: 06/06/12
 * Time: 13:31
 * To change this template use File | Settings | File Templates.
 */

function DonsterTrio(first, second, third)
{
    this.first = first;
    this.second = second;
    this.third = third;
}

DonsterTrio.prototype.GetFirst = function()
{
    return this.first;
}

DonsterTrio.prototype.GetSecond = function()
{
    return this.second;
}

DonsterTrio.prototype.GetThird = function()
{
    return this.third;
}

DonsterTrio.prototype.SetFirst = function(value)
{
    this.first = value;
}

DonsterTrio.prototype.SetSecond = function(value)
{
    this.second = value;
}

DonsterTrio.prototype.SetThird = function(value)
{
    this.third = value;
}