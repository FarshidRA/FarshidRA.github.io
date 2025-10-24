for(const p of predictions){
  let [x,y,w,h] = p.bbox;

  // scale to canvas size
  x *= scaleX; y *= scaleY; w *= scaleX; h *= scaleY;

  // choose color based on score
  let color;
  if(p.score < 0.5) color = 'red';
  else if(p.score < 0.8) color = 'yellow';
  else color = 'lime';

  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.strokeRect(x,y,w,h);

  ctx.fillStyle = color;
  ctx.font = '16px sans-serif';
  ctx.fillText(p.class + ' ' + Math.round(p.score*100)+'%', x+4, y+18);
}
