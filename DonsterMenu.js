/**
 * Created with JetBrains WebStorm.
 * User: Fabrice
 * Date: 28/06/12
 * Time: 09:43
 * To change this template use File | Settings | File Templates.
 */

function DonsterMenu(width, height)
{
    this.X = 0;
    this.Y = 0;
    this.Width = width;
    this.Height = height;
    this.GameTime = new MonsterTimer();
    this.LoadResources();
    this.BtnPlay = new DonsterButton(width - 140, height - 150, 128, 128, this.img_btn_play, this.img_btn_play_pressed);
    this.EventManager = new EventManager();
    this.EventManager.Initialize();
}

DonsterMenu.prototype.LoadResources = function()
{
    var tmpRec;

    this.img_btn_play = new Image();
    this.img_btn_play.src = 'images/btnnewgame.png';
    this.img_btn_play_pressed = new Image();
    this.img_btn_play_pressed.src = 'images/btnnewgamepress.png';
    this.img_bg = new Image();
    this.img_bg.src = 'images/menubg_snow.png';
    this.img_title = new Image();
    this.img_title.src = 'images/title_monsterdashhd.png';

    tmpRec = new ImageRect(this.img_bg, 0, 0, 512, 512);
    this.MenuBackgroung = new Sprite(0, 0, this.Width, this.Height, tmpRec);
    tmpRec = new ImageRect(this.img_title, 0, 0, 1024, 512);
    this.MenuTitle = new Sprite(0, 0, this.Width, this.Height, tmpRec);
}

DonsterMenu.prototype.Update = function()
{
    this.BtnPlay.Update();
    if (this.EventManager.isMouseButtonDown(MouseEnum.Left))
    {
        var mpos = this.EventManager.getMousePosition();
        //this.BtnPlay.HandleClick(mpos[0], mpos[1]);
        this.BtnPlay.HandleClick(980, mpos[1] - 50);
    }
}

DonsterMenu.prototype.draw = function(context, view, x_local, y_local)
{
    this.MenuBackgroung.draw(context, view, x_local, y_local);
    this.MenuTitle.draw(context, view, x_local, y_local);
    this.BtnPlay.draw(context, view, x_local, y_local);
}

DonsterMenu.prototype.getX = function()
{
    return this.X;
}

DonsterMenu.prototype.getY = function()
{
    return this.Y;
}

DonsterMenu.prototype.getWidth = function()
{
    return this.Width;
}

DonsterMenu.prototype.getHeight = function()
{
    return this.Height;
}

DonsterMenu.prototype.isNewGamePressed = function()
{
    if (this.BtnPlay.IsReleased())
    {
        return true;
    }
    return false;
}