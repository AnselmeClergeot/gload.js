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
		this.graphicUpdater.createdCanvas = false;
	}
	
	this.addFileToLoad = function(fileObject, path, size)
	{
		this.progressUpdater.addFile(fileObject, path, size);
	}
	
	this.start = function()
	{
		if(this.createCanvas)
			this.graphicUpdater.createCanvas();
		
		this.progressUpdater.start();
	}
	
	this.setColors = function(backgroundColor, color)
	{
		this.graphicUpdater.backgroundColor = backgroundColor;
		this.graphicUpdater.color = color;
	}
	
	this.setBorder = function(borderWidth, borderColor)
	{
		this.graphicUpdater.borderWidth = borderWidth;
		this.graphicUpdater.borderColor = borderColor;
	}
	
	this.setBackgroundImage = function(backgroundImage)
	{
		this.graphicUpdater.backgroundImage.src = backgroundImage;
	}
	
	this.setFillImage = function(fillImage)
	{
		this.graphicUpdater.fillImage.src = fillImage;
	}
	
	this.setCloseTime = function(time)
	{
		this.progressUpdater.closeTime = time;
	}
}

function progressUpdater(graphicUpdater)
{
	var self = this;
	this.files = Array();
	this.totalFileSize = 0;
	this.actualFile = 0;
	this.totalFileNumber = 0;
	this.graphicUpdater = graphicUpdater;
	this.closeTime = 0;
	
	this.start = function()
	{
		this.graphicUpdater.start();
		this.files[0].load();
	}
	
	this.addFile = function(fileObject, path, size)
	{
		this.files.push(new file(fileObject, path, size, this));
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
		else
			setTimeout(this.graphicUpdater.stopLoading, this.closeTime);
	}
}

function graphicUpdater(width, height, backgroundColor, color)
{
	this.canvas;
	this.createdCanvas = true;
	
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
	
	this.borderWidth = 0;
	this.borderColor = 0;
	
	this.backgroundImage = new Image();
	this.fillImage = new Image();
	
	this.intervalId;
	
	this.backgroundImage.onerror = function()
	{
		console.log("Cannot load background image");
	}
	
	this.fillImage.onerror = function()
	{
		console.log("Cannot load fill image");
	}
	
	this.actualProgression = 0;
	
	this.start = function()
	{
		this.intervalId = setInterval(this.update, 1000/60);
	}
	
	var self = this;
	
	this.update = function()
	{
		var ctx = self.canvas.getContext("2d");
		
		ctx.clearRect(self.barX, self.barY, self.width, self.height);
		
		if(self.backgroundImage.src=="")
		{
		ctx.fillStyle = self.backgroundColor;
		ctx.fillRect(self.barX, self.barY, self.width, self.height);
		}
		else
		{
			ctx.drawImage(self.backgroundImage, 0, 0, self.width, self.height, self.barX, self.barY, self.width, self.height);
		}
		
		if(self.fillImage.src=="")
		{
		ctx.fillStyle = self.color;
		ctx.fillRect(self.barX, self.barY, self.actualProgression*self.width, self.height);
		}
		else
		{
			ctx.drawImage(self.fillImage, 0, 0, self.actualProgression*self.width, self.height, self.barX, self.barY, self.actualProgression*self.width, self.height);
		}
		
		
		if(self.borderWidth > 0)
		{
			ctx.strokeStyle = self.borderColor;
			ctx.lineWidth = self.borderWidth;
			ctx.strokeRect(self.barX, self.barY, self.width, self.height);
		}
	}
	
	this.stopLoading = function()
	{
		clearInterval(self.intervalId);
		
		self.update();
		
		if(self.createdCanvas)
			document.getElementById("gloadCanvas").remove();
		
		
	}
}

function file(fileObject, path, size, progressUpdater)
{
	this.path = path;
	this.size = size;
	this.progressUpdater = progressUpdater;
	this.file = fileObject;
	
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