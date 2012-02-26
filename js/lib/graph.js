function Chart(id, config){
	var canvas = $(id).get(0);
	var c = canvas.getContext('2d');
	var SOLID = 1;
	var DOTTED = 2;
	$(id).attr('width',config.width);
	$(id).attr('height',config.height);
	c.PrintLine = function(x1, y1, x2,y2, width, color, style)
	{
		width = width || 1;
		color = color || ''; 
		style = style || SOLID;
		c.beginPath();
		if (style == SOLID) 
		{
			c.moveTo(x1,y1);
			c.lineTo(x2,y2);
		}
		else if (style == DOTTED)
		{
			var lineWidth = Math.abs(x2 - x1);
			var lineHeight = Math.abs(y2 - y1);
			if (lineHeight > lineWidth)
			{
				for (var i = y1; i <= y2; i=i+2)
				{
					c.moveTo(x1,i);
					c.lineTo(x2,i+1);
				}
			}
			else
			{
				for (var i = x1; i <= x2; i=i+2)
				{
					c.moveTo(i, y1);
					c.lineTo(i+1, y2);
				}
			}
		}
		c.lineWidth = width;
		c.strokeStyle = color;
		c.stroke();
		c.closePath();
	}
	c.Circle = function(x, y, radius,  width, color, fillColor)
	{
		var fillColor = fillColor || '#ffffff';
		c.beginPath();
		c.arc(x, y, radius, 0,Math.PI*2,false);
		c.lineWidth = width;
		c.strokeStyle = color;
		c.fillStyle = fillColor;
		c.fill();
		c.stroke();
		c.closePath();
	}
	c.Text = function (x, y, text, font, color)
	{
		font = font || "bold 20pt Helvetica";
		color = color || "#000";
		c.font = font; 
		c.fillStyle = color;
		c.textAlign = 'center';
		c.fillText(text, x, y);
	}
	c.Legend = function(x,y,text,persentText,color,labelColor)
	{
		c.beginPath();
		// print poligon
		c.moveTo(x, y); 
		c.lineTo(x+45, y);
		c.lineTo(x+45, y+34);
		c.lineTo(x+40, y+34);
		c.lineTo(x+22, y+42);
		c.lineTo(x+4, y+34);
		c.lineTo(x, y+34);
		c.lineTo(x, y);
		//create Gradient
		var bgfade = c.createLinearGradient(x+22,y,x+22,y+42);
		bgfade.addColorStop(0.0, "#fff"); // Start with light blue in upper left
		bgfade.addColorStop(1.0, labelColor); // Fade to white in lower right
		c.fillStyle = bgfade; // Gray fills
		c.strokeStyle = color;
		c.lineWidth = 1; 
		c.fill(); 
		c.stroke();
		c.closePath();
		c.Text(x+22, y+17,text,"bold 14px Helvetica","#000")
		c.Text(x+22, y+32,persentText,"12px Helvetica","#000")
	}
	
	//c.PrintLine(20,30,70,30,1,'#B2B2B2',DOTTED);
	//c.PrintLine(30,30,30,80,1,'#000000',DOTTED);
	//c.Circle(20,30,5,3,'#B2B2B2');
	/*
	c.Text(100, 330,"<canvas>","Bold 36pt Helvetica","#000")
	c.Text(300, 330,"<canvas>","bold 18px Helvetica","#f00")
	c.Legend(100,200,"20","5%");
	c.Legend(200,200,"20","5%");
	*/
	c.axisX = function()
	{
		var axisX = config.axisX,
			x,
			y;
		
		c.PrintLine(startX,startY+graphHeight,startX+graphWidth,startY+graphHeight,1,'#CCCCCC');
		var number2pixel = Math.round(graphWidth/(axisX.max - axisX.min));
		for(var i in axisX.points)
		{
			x = number2pixel*parseFloat(axisX.points[i]-axisX.min)+startX;
			y = startY+graphHeight;
			c.Text(x, y+17,axisX.points[i],"12px Helvetic","#CCCCCC")
			c.PrintLine(x, y-2, x, y+2,1,'#CCCCCC');
		}
	}
	c.axisY = function()
	{
		var axisY = config.axisY,
			x,
			y;
		var number2pixel = Math.round(graphHeight/(axisY.max - axisY.min));
		for(var i in axisY.points)
		{
			x = 20;
			y = startY+graphHeight - number2pixel*parseFloat(axisY.points[i]);
			if (axisY.points[i] > 0)
			{
				c.Text(x, y+3,axisY.points[i],"12px Helvetic","#29ABE3");
				c.PrintLine(startX, y, startX+graphWidth, y,1,'#29ABE3',DOTTED);
			}
		}
		for(var i in axisY.points2)
		{
			x = startX + graphWidth + 15;
			y = startY+graphHeight - number2pixel*parseFloat(axisY.points2[i].val);
			c.Text(x, y+3,axisY.points2[i].lbl,"12px Helvetic","#CCCCCC");
		}
			
	}
	c.printGraph = function(num)
	{
		var data = config.data[num],
			axisY = config.axisY,
			axisX = config.axisX,
			x,
			y,
			number2pixelY = Math.round(graphHeight/(axisY.max - axisY.min)),
			number2pixelX = Math.round(graphWidth/(axisX.max - axisX.min)),
			prevX,
			prevY,
			points = [];
		for(var i in data.points)
		{
			x = number2pixelX*parseFloat(data.points[i].x-axisX.min)+startX;
			y = startY+graphHeight - number2pixelY*parseFloat(data.points[i].y);
			
			c.PrintLine(x, y+10, x, startY+graphHeight-25,1,'#B2B2B2',DOTTED);
			
			if (y -(startY+graphHeight-12) < 10)
			{
				c.Text(x, startY+graphHeight-12,data.points[i].x,"11px Helvetic","#000");
				c.PrintLine(x, startY+graphHeight-10, x, startY+graphHeight-1,1,'#B2B2B2',DOTTED);
			}
			if (prevX !== undefined)
				c.PrintLine(prevX, prevY, x, y,3,data.color);
			
			//console.log(x,y,axisX.points[i],number2pixel);
			points[i] = {x:x,y:y,data:data.points[i]}
			prevX = x;
			prevY = y;
		}
		for(var i in points)
		{
			c.Circle(points[i].x,points[i].y,5,2,data.color);
			c.Legend(points[i].x-23,points[i].y-55,points[i].data.y,points[i].data.percent+'%',data.color,data.labelColor);
		}
		
	}
	var startX = 30,
		startY = 60,
		graphWidth = config.width - startX - 30;
		graphHeight = config.height - startY - 20;
	this.print = function(num)
	{
		c.clearRect(0, 0, config.width, config.height);
		c.axisX();
		c.axisY();
		c.printGraph(num);
	}
}