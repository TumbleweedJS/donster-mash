/**
 * Created with JetBrains WebStorm.
 * User: Fabrice
 * Date: 28/06/12
 * Time: 18:15
 * To change this template use File | Settings | File Templates.
 */

function DonsterScoreBoard(img_bg, img_sheet)
{
    var tmpRec;
    this.Distance = 0;
    this.Img = img_sheet;
    this.ImgBackground = img_bg;
    tmpRec = new ImageRect(img_bg, 0, 0, 256, 256);
    this.Background = new Sprite(100, 100, 800, 256, tmpRec);
    this.TextYouRan = new Text2D(140, 250, 66, 'Calibri', 'You ran');
    this.TextYouRan.setRVBColor(255, 255, 255);
    this.TextYouRan.setFontStyle("bold");
    this.Numbers = new Array();
    this.Width = 64;
    this.Height = 128;
    this.Marge = 18;
    this.IdMetre = 10;
    this.IdKilometre = 11;
    this.BeginRight = 850;
    this.LoadNumbers();
}

DonsterScoreBoard.prototype.LoadNumbers = function()
{
    var i;

    for (i = 0; i < 16; i++)
    {
        var tmpRec = new ImageRect(this.Img, (i * this.Width), 0, this.Width, this.Height);
        this.Numbers.push(new Sprite(0, 165, this.Width, this.Height, tmpRec));
    }
}

DonsterScoreBoard.prototype.SetDistance = function(value)
{
    this.Distance = value;
}

DonsterScoreBoard.prototype.draw = function(context, view, x_local, y_local)
{
    this.Background.draw(context, view, x_local, y_local);
    this.TextYouRan.draw(context, view, x_local, y_local);
    /** Draw "m" symbol **/
    this.Numbers[10].setX(this.BeginRight - this.Marge - this.Width);
    this.Numbers[10].draw(context, view, x_local, y_local);

    /** Draw distance **/
    var tmpDist = Math.ceil(this.Distance);
    tmpDist = tmpDist.toString();
    var i = 1;

    while (i <= tmpDist.length)
    {
        var pos = tmpDist[tmpDist.length - i];
        var posX = this.BeginRight - this.Marge + 2 - ((i + 1) * (2 + this.Width));
        this.Numbers[pos].setX(posX);
        this.Numbers[pos].draw(context, view, x_local, y_local);
        i++;
    }
    while (i < 6)
    {
        var posX = this.BeginRight - this.Marge + 2 - ((i + 1) * (2 + this.Width));
        this.Numbers[12].setX(posX);
        this.Numbers[12].draw(context, view, x_local, y_local);
        i++;
    }
}

DonsterScoreBoard.prototype.getX = function()
{
    return 0;
}

DonsterScoreBoard.prototype.getY = function()
{
    return 0;
}
