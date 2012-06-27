//Classe herite de Sprite. Elle permet de stocket plusieurs inages et de les faire se suivre.
//Meme parametres que Sprite sauf que imgRectArray est un tableau de imgRect (les differentes images qui compose l'animation)
function SpriteAnime(x, y, width, height, imgRectArray, parentView)
{
	this.superClass = Sprite;
	this.superClass(x, y, width, height, imgRectArray[0], parentView);
	delete this.superclass;
	
	this.imgRectArray = imgRectArray;

	this.current = 0;
}

//Update qui vise a modifier l'imgRect en cours.
SpriteAnime.prototype.update = function()
{
	this.current++;
	if (this.current >= this.imgRectArray.length)
		this.current = 0;
	this.imgRect = this.imgRectArray[this.current];
	
}

//Lance la boucle pour le update. FPS correspond a X dans l'equation 1000/X.
SpriteAnime.prototype.loop = function(fps)
{
	    var me = this; //Create a local variable for "this" that will appear in nested function.
    
    setInterval(function() {me.update();}, 1000 / fps);
    
}