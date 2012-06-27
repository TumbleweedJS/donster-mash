/**
 * Created with JetBrains WebStorm.
 * User: Olousouzian
 * Date: 6/11/12
 * Time: 6:29 PM
 * To change this template use File | Settings | File Templates.
 */

/*
 Class Event
 */

var KeyEnum = {
    Backspace : "8",
    Tab : "9",
    Enter : "13",
    Shift : "16",
    Ctrl : "17",
    Alt : "18",
    Pause : "19",
    CapsLock : "20",
    Escape : "27",
    PageUp : "33",
    PageDown : "34",
    End : "35",
    Home : "36",
    LeftArrow : "37",
    UpArrow : "38",
    RightArrow : "39",
    DownArrow : "40",
    Insert : "45",
    Delete : "46",
    0 : "48",
    1 : "49",
    2 : "50",
    3 : "51",
    4 : "52",
    5 : "53",
    6 : "54",
    7 : "55",
    8 : "56",
    9 : "57",
    A : "65",
    B : "66",
    C : "67",
    D : "68",
    E : "69",
    F : "70",
    G : "71",
    H : "72",
    I : "73",
    J : "74",
    K : "75",
    L : "76",
    M : "77",
    N : "78",
    O : "79",
    P : "80",
    Q : "81",
    R : "82",
    S : "83",
    T : "84",
    U : "85",
    V : "86",
    W : "87",
    X : "88",
    Y : "89",
    Z : "90",
    F1 : "112",
    F2 : "113",
    F3 : "114",
    F4 : "115",
    F5 : "116",
    F6 : "117",
    F7 : "118",
    F8 : "119",
    F9 : "120",
    F10 : "121",
    F11 : "122",
    F12 : "123",
    Space : "32"
}


var EventManager = function()
{
    //variables
    var keyDown = new Array();

    function Initialize()
    {
        window.onkeydown = UpdateDown;
        keyDown.length = 0;
    };

    function UpdateDown(event)
    {
        keyDown.push(event.keyCode);
    };

    function isKeyDown(keyCode)
    {
        for(var it = 0; it < keyDown.length; it++)
        {
            if (keyDown[it] == keyCode)
                return true;
        }
        return false;
    }

    function isKeyUp(keyCode)
    {
        return !isKeyDown(keyCode);
    }

    function Clear()
    {
        keyDown.length = 0;
    };

    return function()
    {
        this.Initialize = Initialize;
        this.Clear = Clear;
        this.isKeyDown = isKeyDown;
        this.isKeyUp = isKeyUp;
    }
}();