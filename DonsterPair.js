/**
 * Created with JetBrains WebStorm.
 * User: Fabrice
 * Date: 06/06/12
 * Time: 13:31
 * To change this template use File | Settings | File Templates.
 */

function DonsterPair(first, second)
{
    this.first = first;
    this.second = second;
}

DonsterPair.prototype.GetFirst = function()
{
    return this.first;
}

DonsterPair.prototype.GetSecond = function()
{
    return this.second;
}

DonsterPair.prototype.SetFirst = function(value)
{
    this.first = value;
}

DonsterPair.prototype.SetSecond = function(value)
{
    this.second = value;
}