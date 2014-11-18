    /*demo of canvas*/
    function drawClockBackground()
    {
        var context = document.getElementById("backCanvas").getContext("2d");
        //context.fillStyle = "rgb(180, 180, 180)";
        //context.strokeStyle = "rgba(140, 140, 140, 0.9)";
        //context.transform(0.5, 0.5, 0, 0, 0, 0);
        context.arc(200, 200, 195, 0*Math.PI, Math.PI * 2, false);
        
        gradient = context.createRadialGradient(200, 200, 10, 200, 200, 195);
        gradient.addColorStop(0, "#00FFFF");
        gradient.addColorStop(0.05, "#00FFFF");
        gradient.addColorStop(0.3, "#00CCCC");
        gradient.addColorStop(0.5, "#00AAAA");
        gradient.addColorStop(0.65, "#009999");
        gradient.addColorStop(1, "#008888");
        //
        context.fillStyle = gradient;
        context.fill();    
    }

    function setClock()
    {
         t = setInterval(displayHands, 1000);
         displayHands();    
    }
   
    function displayHands()
    {
         var today = new Date()
         var secondAngle = today.getSeconds()*360/60 - 90;
         var minuteAngle = today.getMinutes()*360/60 - 90;
         var hourAngle = today.getHours()*360/12 + (today.getMinutes()*360/(12*60))  - 90;
         
        document.getElementById("secondHand").setAttribute("style", "-moz-transform:rotate(" + secondAngle  + "deg);"
                                                                 + "-webkit-transform:rotate(" + secondAngle  + "deg);"
                                                                 + "-o-transform:rotate(" + secondAngle  + "deg);"
                                                                 + "-ms-transform:rotate(" + secondAngle  + "deg);");
        
         document.getElementById("minuteHand").setAttribute("style", "-moz-transform:rotate(" + minuteAngle + "deg);"
                                                            + "-webkit-transform:rotate(" + minuteAngle + "deg);"
                                                            + "-o-transform:rotate(" + minuteAngle + "deg);"
                                                            + "-ms-transform:rotate(" + minuteAngle + "deg);");

         document.getElementById("hourHand").setAttribute("style", "-moz-transform:rotate(" + hourAngle + "deg);"
                                                          + "-webkit-transform:rotate(" + hourAngle + "deg);"
                                                          + "-o-transform:rotate(" + hourAngle + "deg);"
                                                          + "-ms-transform:rotate(" + hourAngle + "deg);"
                                                          );
    }
   
    function setDigits()
    {
         var digits = 0;
         var r = 180;//radius
         var angle = 0;
         var center = 200;
         var heightDigit = 20; 
         var outerDiv = document.getElementById("divOuterClock");
         
         for(digits=1; digits<=60; digits++)
         {   
             angle = 90 - digits*6 ;
             var x = r*Math.cos(Math.PI*angle/180);
             var y = r*Math.sin(Math.PI*angle/180);
             var topPos = center - y - heightDigit * (digits) - 395;
             var leftPos = center + x;
             
             var dynamicDigDiv = document.createElement("div");
             dynamicDigDiv.className = "clockDigit";
            
             if(digits%5 == 0)
             {
                 dynamicDigDiv.innerHTML = digits/5;
             }
             else
             {
                 dynamicDigDiv.innerHTML = ".";
             }
             
            dynamicDigDiv.setAttribute("style", "top:" + topPos + "px;left:" + leftPos + "px;" );
            outerDiv.appendChild(dynamicDigDiv);
         }
    }
