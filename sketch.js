// color palette

var colors   =  ["#ff0000","#feb30f","#0aa4f7","#ffffff"];

// set weights for each color 

var weights  = [0.5,1,1,3];             

// scale of the vector field 
// smaller values => bigger structures  
// bigger values  ==> smaller structures 

var myScale =5;

// number of drawing agents 

var nAgents =100;

let agent = [];

var border = 0;

function setup() {
  createCanvas(1920,1080,WEBGL);
	colorMode(HSB, 360, 100, 100,100);
 
  for(let i=0;i < nAgents;i++)
  {
    agent.push(new Agent());
  }
  
  smooth(8);
  
  background(0,0,0);
  
}

function draw() {
  
  if (frameCount > 500)
  {
     noLoop();
  }
	
	push();
	scale(1.5);
	
  ambientLight(0,0,80);
  directionalLight(0,0,100,100,100,20);
	
	for(let i=0;i < agent.length;i++)
	{
		agent[i].update();
	}
	
	pop();

}

// paintining agent 


class Agent {
  constructor()
  {
		var centroX = 400;
		var centroY = 400;
		
		this.p    = createVector(centroX + randomGaussian()*100,
														 centroY + randomGaussian()*100,0);							
		
    this.pOld  = createVector(this.p.x,this.p.y,this.p.z);
		
		this.scale = random(2,10);
		
		if (random(0,1) > 0.5)
		{
		  this.shape = "square";
		}else
		{
			this.shape = "sphere";
		}
	
    this.stepX  = random(0.1,2);
    this.stepY  = random(0.1,2);
		this.stepZ  = random(0.1,2);
		
		this.changeColor = random(20,100);
		
		if(random(0,1) > 0.5)
		{
      this.direction = 1;
		}else
		{
			this.direction = -1;
		}
			
    let temp   =  myRandom(colors,weights);
    
    this.color = color(hue(temp) + randomGaussian()*10,
                       saturation(temp) + randomGaussian()*10,
                       brightness(temp) - 10,random(50,100));
    
    this.strokeWidth = random(2,6);
    
    this.isOutside = false; 
  }
  
  update() {
    
    
    this.p.x += this.direction*vector_field(this.p.x,this.p.y,this.p.z,this.scale).x*this.stepX;
    this.p.y += this.direction*vector_field(this.p.x,this.p.y,this.p.z,this.scale).y*this.stepY;
    this.p.z += this.direction*vector_field(this.p.x,this.p.y,this.p.z,this.scale).z*this.stepZ;
    

    push();
    
    translate(this.p.x - width/2,this.p.y - height/2,this.p.z);

    noStroke();
    
		if ((frameCount % this.changeColor) == 0)
		{
		
		   let temp   =  myRandom(colors,weights);
    
       this.color = color(hue(temp) + randomGaussian()*10,
                       saturation(temp) + randomGaussian()*10,
                       brightness(temp) - 10,random(50,100));
			
			
			 if (this.stroke > 0)
			 {
	       this.strokeWidth -= 0.2;
			 } else
			 {
				 this.strokeWidth = 2;
			 }
		}
		
    fill(this.color);
		
		if (this.shape == "square")
		{
      box(this.strokeWidth);
		}
		
		if(this.shape == "sphere")
		{
		  sphere(this.strokeWidth);
		}
		
    //this.pOld.set(this.p);
		
	  pop();
  }	   
}

// vector field function 
// the painting agents follow the flow defined 
// by this function 


function vector_field(x,y,z,myScale) {
  
  x = map(x,0,width,-myScale,myScale);
  y = map(y,0,height,-myScale,myScale);
  z = map(z,0,height,-myScale,myScale);
  
  let k1 = 5;
  let k2 = 3;
  
  let u = cos(k1*y) + cos(k2*y) + map(noise(x,y,z),0,1,-1,1);
  let v = sin(k2*x) - cos(k1*x) + map(noise(x,y,z),0,1,-1,1);
  let w = sin(k1*x);
  
  //let u = cos(k1*y) + cos(k2*y);
  //let v = sin(k2*x) - cos(k1*x);
  //let w = sin(k1*x);
  
  return createVector(u,v,w);
}

// function to select 

function myRandom(colors,weights)
{ 
    let tt = 0;
    let sum = 0;
 
    for(let i=0;i < colors.length; i++)
    {
      sum += weights[i];
    }
 
    let rr = random(0,sum);
 
    for(let j=0;j < weights.length;j++)
    {
 
      if (weights[j] >= rr)
      {
        return colors[j];
      }
        rr -= weights[j];
    }
 
    return tt;
 }