/**
 * Created with JetBrains WebStorm.
 * User: Fabrice
 * Date: 05/06/12
 * Time: 12:43
 * To change this template use File | Settings | File Templates.
 */

/** Game **/
var MODE_GAME = 0;
var DonsterMashGame = new DonsterGame(1024, 768);
/** Menu **/
var MODE_MENU = 1;
var DonsterMashMenu = new DonsterMenu(1024, 768);
/** End screen **/
var MODE_END = 2;
var DonsterMashGameOver = new DonsterGameOver(1024, 768);

var donster_current_mode = MODE_MENU;

/** Game loader **/
window.onload = function()
{
    var context = document.getElementById("myCanvas").getContext("2d");
    var my_window = new Window(1024, 768, context);
    var viewGame = new View(context, 0, 0, 1024, 768);
    var viewMenu = new View(context, 0, 0, 1024, 768);
    var viewEnd = new View(context, 0, 0, 1024, 768);
    viewGame.pushSprite(DonsterMashGame);
    viewMenu.pushSprite(DonsterMashMenu);
    viewEnd.pushSprite(DonsterMashGameOver);

   // my_window.setScale(0.78, 0.79);
    changeMode(MODE_MENU);
    function loop()
    {
        context.fillStyle = "rgb(0, 0, 0)";
        context.fillRect(0, 0, 1024, 768);
        if (donster_current_mode == MODE_MENU)
        {
            /** Update **/
            DonsterMashMenu.Update();
            if (DonsterMashMenu.isNewGamePressed())
            {
                DonsterMashGame.NewGame();
                changeMode(MODE_GAME);
            }
            /** Draw **/
            my_window.draw();
        }
        else if (donster_current_mode == MODE_GAME)
        {
            /** Update **/
            DonsterMashGame.Update();
            if (DonsterMashGame.isLost())
            {
                DonsterMashGameOver.setScore(DonsterMashGame.getScore());
                changeMode(MODE_END);
            }
            /** Draw **/
            my_window.draw();
        }
        else
        {
            /** Update **/
            DonsterMashGameOver.Update();
            if (DonsterMashGameOver.isBackPressed())
            {
                changeMode(MODE_MENU);
            }
            /** Draw **/
            my_window.draw();
        }
        /** Reset callback **/
        window.setTimeout(loop, 1000 / 30);
    }

    function changeMode(newMode)
    {
        if (donster_current_mode == MODE_MENU)
            my_window.popView(viewMenu);
        else if (donster_current_mode == MODE_GAME)
            my_window.popView(viewGame);
        else if (donster_current_mode == MODE_END)
            my_window.popView(viewEnd);
        donster_current_mode = newMode;
        if (donster_current_mode == MODE_MENU)
            my_window.pushView(viewMenu);
        else if (donster_current_mode == MODE_GAME)
            my_window.pushView(viewGame);
        else if (donster_current_mode == MODE_END)
            my_window.pushView(viewEnd);
    }

    window.setTimeout(loop, 1000 / 30);
}
