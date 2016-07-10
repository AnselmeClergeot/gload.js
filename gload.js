function progressBar(width, height, backgroundColor, color)
{
	this.createCanvas = true;
	
	this.graphicUpdater = new graphicUpdater(width, height, backgroundColor, color);
	this.progressUpdater = new progressUpdater(this.graphicUpdater);
	
	this.setCanvas = function(canvas, barX, barY)
	{
		this.createCanvas = false;
		this.graphicUpdater.canvas = canvas;
		this.graphicUpdater.barX = barX;
		this.graphicUpdater.barY = barY;
	}
	
	this.addFile = function(path, type, size)
	{
		this.progressUpdater.addFile(path, type, size);
	}
	
	this.start = function()
	{
		if(this.createCanvas)
			this.graphicUpdater.createCanvas();
		
		this.progressUpdater.start();
	}
}

function progressUpdater(graphicUpdater)
{
	this.files = Array();
	this.totalFileSize = 0;
	this.actualFile = 0;
	this.totalFileNumber = 0;
	this.graphicUpdater = graphicUpdater;
	
	this.start = function()
	{
		this.graphicUpdater.start();
		this.files[0].load();
	}
	
	this.addFile = function(path, type, size)
	{
		this.files.push(new file(path, type, size, this));
		this.totalFileSize+=size;
		this.totalFileNumber++;
	}
	
	this.fileHasLoaded = function()
	{
		this.graphicUpdater.actualProgression+=(this.files[this.actualFile].size/this.totalFileSize);
		if(this.actualFile+1 < this.totalFileNumber)
		{
		this.actualFile++;
		this.files[this.actualFile].load();
		}
	}
}

function graphicUpdater(width, height, backgroundColor, color)
{
	this.canvas;
	
	this.createCanvas = function()
	{
		this.canvas  = appendCanvas(this.width, this.height);
	}
	
	this.width = width;
	this.height = height;
	this.barX = 0;
	this.barY = 0;
	this.backgroundColor = backgroundColor;
	this.color = color;
	
	this.actualProgression = 0;
	
	this.start = function()
	{
		setInterval(this.update, 1000/60);
	}
	
	var self = this;
	
	this.update = function()
	{
		var ctx = self.canvas.getContext("2d");
		console.log(self.actualProgression*self.width);
		ctx.clearRect(self.barX, self.barY, self.width, self.height);
		ctx.fillStyle = self.backgroundColor;
		ctx.fillRect(self.barX, self.barY, self.width, self.height);
		ctx.fillStyle = self.color;
		ctx.fillRect(self.barX, self.barY, self.actualProgression*self.width, self.height);
	}
}

function file(path, type, size, progressUpdater)
{
	this.path = path;
	this.size = size;
	this.progressUpdater = progressUpdater;
	
	if(type=="Image")
		this.file = new Image();
	if(type=="Audio")
		this.file = new Audio();
	else
		console.log("Error on file type");
	
	this.load = function()
	{
		this.file.src = this.path;
	}
	
	this.file.onerror = function()
	{
		console.log("Cannot load " + this.path);
	}
	
	var self = this;
	
	this.file.onload = function()
	{
		self.progressUpdater.fileHasLoaded();
	}
}
function appendCanvas(width, height)
{
	document.body.innerHTML+="<canvas id=\"gloadCanvas\" width=\""+width+"\" height=\""+height+"\"/>";
	return document.getElementById("gloadCanvas");
}