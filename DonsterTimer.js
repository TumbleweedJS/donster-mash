/**
 * Created with JetBrains WebStorm.
 * User: Fabrice
 * Date: 05/06/12
 * Time: 17:21
 * To change this template use File | Settings | File Templates.
 */

function MonsterTimer()
{
    this.baseDate = new Date();
}

MonsterTimer.prototype.reset = function()
{
    this.baseDate = new Date();
}

MonsterTimer.prototype.GetElapsedTime = function()
{
    return (new Date() - this.baseDate);
}