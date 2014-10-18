#FL-Calendar

...is a free online Web-App working on phones, tablets, PC, Mac.  

- [Change log](CHANGE_LOG.md)

##Run:  
- [english](http://www.apixline.org/pm/app/web/html5/calendar/en.html)
- [français](http://www.apixline.org/pm/app/web/html5/calendar)
- [español](http://www.apixline.org/pm/app/web/html5/calendar/es.html)

##install from:  
- [Firefox-marketplace](https://marketplace.firefox.com/app/apix-calendar) -Android mobiles/PC-
- [GooglePlay](https://play.google.com/store/apps/details?id=net.apixline.calendar&hl=fr) -PC/MAC-
- [Chrome-webstore](https://chrome.google.com/webstore/detail/fl-calendar-5-fr/okiiklhmbblobkaldcolohkbihfnhiel?utm_source=chrome-ntp-icon) -Android mobiles-

##Features: 
The main idea is to display full year (from december year-1 to January year+1) on one page, to provide quick access to months and days.  
So many months and days as desired can be opened at the same time and texts can be dragAndDroped.  
Simple calendar if you aren't logged in, it becomes an agenda/schedule by logging.  
A text can be associated with a day of the month and/or the entire month.  

Layout and behaviour may be different according to screen size or browser ratio.

You may [embed FL-Calendar](http://www.apixline.org/pm//app/web/html5/calendar/embed.simu.html) in your own page : 

##Licence 
GNU-GPL

##User guide:
- [english](http://www.apixline.org/pm/app/web/html5/calendar/doc/help.en.html)
- [français](http://www.apixline.org/pm//app/web/html5/calendar/doc/help.fr.html)

##Recommendations :
This app is designed to run on a valid HTML5 browser. 

Tested on :  

- recent versions of Chrome, Firefox and Safari browsers 
- IE mobile v10 - Smartphone Htc 8S
- IOS Safari - Ipad
- Android: native & Firefox browsers - Htc smartphone and Acer tablet.  
- Firefox-OS - simulator.
- standalone app from Firefox-Marketplace - Android mobiles and Windows PC.  

It is the HTML5 version of a Flash web-app : [www.flash-line.org/app/web/calendar/](http://www.flash-line.org/app/web/calendar/)  
Flash version only works on desktop computers.   
You can use currently both versions because they target the same database.   

Orientation "portrait" is better on smartphones and tablets.  
On a large width tablet in landscape-mode, the layout is the same as PC/Mac. But the portrait-mode seems still preferable to me.  

I use this calendar myself and backup all data.  
But if you want to do it yourself, it is better to download and install the application on your web server.

##Installation 
- Download zip and install the content of **bin/** into local or remote web-server.
- Sql database isn't necessary,  
- PHP required.  

Facultative modifications : 
 
- parameters in **bin/custom/default/model.xml**  
- Paths in **bin/js/baseUrl.js**  

##Development:  

- Source is in [Haxe](http://haxe.org/). -[Haxe-Foundation](http://haxe-foundation.org/) / [Haxe silexlabs community](http://www.silexlabs.org/)- 

- Dependency :   

 [FLnet api](https://github.com/flashline/FLnet-haxe)  to be installed :  
 - in src/  
 - or as haxe lib  
 - or everywhere, adding  -cp everywhere/ in build.xml.

##let me know
...if you find bugs. I will correct them as soon as possible (tell me where error occures: Mobile, PC or Mac and the browser's name)  
Do not hesitate to leave me encouragement and if this application please to you , talk about it around you :) 

English is not my mother language as you can see... As Droopy says, I'd be an happy taxpayer...  
if a real english speaking corrects:  

- [application's texts](https://github.com/flashline/FL-Calendar/blob/master/bin/custom/en/language.xml) or  
- [documentation](https://github.com/flashline/FL-Calendar/blob/master/bin/doc/help.en.html)  

 
 
