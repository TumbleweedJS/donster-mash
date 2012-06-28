/**
 * Created with JetBrains WebStorm.
 * User: Fabrice
 * Date: 28/06/12
 * Time: 16:50
 * To change this template use File | Settings | File Templates.
 */

function DonsterGameOver(width, height)
{
    this.X = 0;
    this.Y = 0;
    this.Width = width;
    this.Height = height;
    this.GameTime = new MonsterTimer();
    this.LoadResources();
    this.BtnBack = new DonsterButton(10, height - 40, 128, 32, this.img_btn_back, this.img_btn_back_pressed);
    this.EventManager = new EventManager();
    this.EventManager.Initialize();
    this.ScoreBoard = new DonsterScoreBoard(this.img_score_background, this.img_scoreboard);
}

DonsterGameOver.prototype.LoadResources = function()
{
    var tmpRec;

    this.img_btn_back = new Image();
    this.img_btn_back.src = 'images/btnback.png';
    this.img_btn_back_pressed = new Image();
    this.img_btn_back_pressed.src = 'images/btnbackpress.png';
    this.img_bg = new Image();
    this.img_bg.src = 'images/menubg_snow.png';
    this.img_title = new Image();
    this.img_title.src = 'images/title_monsterdashhd.png';

    this.img_score_background = new Image();
    this.img_score_background.src = 'images/resultsbox.png';
    this.img_scoreboard = new Image();
    this.img_scoreboard.src = 'images/scoreboardhd.png';

    tmpRec = new ImageRect(this.img_bg, 0, 0, 512, 512);
    this.MenuBackgroung = new Sprite(0, 0, this.Width, this.Height, tmpRec);
}

DonsterGameOver.prototype.Update = function()
{
    this.BtnBack.Update();
    if (this.EventManager.isMouseButtonDown(MouseEnum.Left))
    {
        var mpos = this.EventManager.getMousePosition();
        //this.BtnBack.HandleClick(mpos[0], mpos[1]);
        this.BtnBack.HandleClick(20, mpos[1] - 70);
    }
}

DonsterGameOver.prototype.draw = function(context, view, x_local, y_local)
{
    this.MenuBackgroung.draw(context, view, x_local, y_local);
    this.BtnBack.draw(context, view, x_local, y_local);
    this.ScoreBoard.draw(context, view, x_local, y_local);
}

DonsterGameOver.prototype.getX = function()
{
    return this.X;
}

DonsterGameOver.prototype.getY = function()
{
    return this.Y;
}

DonsterGameOver.prototype.getWidth = function()
{
    return this.Width;
}

DonsterGameOver.prototype.getHeight = function()
{
    return this.Height;
}

DonsterGameOver.prototype.isBackPressed = function()
{
    if (this.BtnBack.IsReleased())
    {
        return true;
    }
    return false;
}

DonsterGameOver.prototype.setScore = function(score)
{
    this.ScoreBoard.SetDistance(score);
}