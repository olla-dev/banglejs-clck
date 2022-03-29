// Load fonts
require("Font7x11Numeric7Seg").add(Graphics);
var Layout = require("Layout");
var layout = new Layout( {
  type:"v", c: [
    {type:"txt", font:"20%", label:"12:00", id:"time" },
    {type:"txt", font:"6x8", label:"The Date", id:"date" }
  ]
});
g.clear();
layout.render();


const TOTAL_PAGES = 3;
const WATCH_PAGE = 0;
const ABOUT_PAGE = 1;

var currPage = 0;

Bangle.swipeHandler = dir => { 
  if (dir<0) {
    showPage(currPage === TOTAL_PAGES ? 0 : currPage++);
  } else {
    showPage(currPage === 0 ? TOTAL_PAGES : currPage--);
  }
};


function showPage(currPage) {
  switch(currPage) {
    case WATCH_PAGE:
      showWatch();
      break;
    case ABOUT_PAGE:
      showAbout();
      break;
    default:
      showWatch();
      break;
  }
}

function showWatch() {
  // Clear the screen once, at startup
  g.clear();
  // draw immediately at first
  drawWatch();
  var secondInterval = setInterval(drawWatch, 1000);
  // Stop updates when LCD is off, restart when on
  Bangle.on('lcdPower',on=>{
    if (secondInterval) clearInterval(secondInterval);
    secondInterval = undefined;
    if (on) {
      secondInterval = setInterval(draw, 1000);
      drawWatch(); // draw immediately
    }
  });
}

function showAbout() {
  // Clear the screen once, at startup
  g.clear();
  var aboutLayout = new Layout( {
    type:"v", c: [
      {type:"txt", font:"20%", label:"CLCK", id:"name" },
      {type:"txt", font:"6x8", label:"0.0.1", id:"version" }
    ]
  });
  aboutLayout.render();
}

function drawWatch() {
  g.clear();
  // work out how to display the current time
  var d = new Date();
  var h = d.getHours(), m = d.getMinutes(), s = d.getSeconds();
  var timeStr = (" "+h).substr(-2) + ":" + ("0"+m).substr(-2) + ":" + ("0"+s).substr(-2);
  // Reset the state of the graphics library
  g.reset();
  // draw the current time (4x size 7 segment)
  g.setFont("7x11Numeric7Seg",4);
  g.setFontAlign(1,1); // align r
  // draw the seconds (2x size 7 segment)
  g.setFont("7x11Numeric7Seg",2);
  // draw the date, in a normal font
  g.setFont("6x8");
  g.setFontAlign(0,1); // align center bottom
  layout.clear(layout.time); // remove old time
  layout.time.label = timeStr;
  layout.clear(layout.time); // remove old date
  layout.render(layout.time); // redraw
  // check date and update if needed
  var dateStr = require("locale").date(d);
  layout.clear(layout.date); // remove old date
  layout.date.label = dateStr;
  layout.render(layout.date); // redraw
}

// Show launcher when middle button pressed
Bangle.setUI("clock");

showPage(1);

// Load widgets
Bangle.loadWidgets();
Bangle.drawWidgets();

