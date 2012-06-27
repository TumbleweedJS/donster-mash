/**
 * Created with JetBrains WebStorm.
 * User: Fabrice
 * Date: 05/06/12
 * Time: 12:43
 * To change this template use File | Settings | File Templates.
 */

/** Game **/
var DonsterMashGame = new DonsterGame(1024, 768);

/** Game loader **/
window.onload = function()
{
    var context = document.getElementById("myCanvas").getContext("2d");
    var my_window = new Window(1024, 768, context);
    var view = new View(context, 0, 0, 1024, 768);
    view.pushSprite(DonsterMashGame);
    my_window.pushView(view);

//    my_window.setScale(0.78, 0.79);
    function callback()
    {
        context.fillStyle = "rgb(230, 230, 230)";
        context.fillRect(0, 0, 1024, 768);
        /** Update **/
        DonsterMashGame.Update();
        /** Draw **/
        my_window.draw();
        /** Reset callback **/
        window.setTimeout(callback, 1000 / 30);
    }
    window.setTimeout(callback, 1000 / 30);
}
