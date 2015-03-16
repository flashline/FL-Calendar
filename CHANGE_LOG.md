#What's new ?



##June 10 2014 - v 1.4.1 :  
- App's location :  
New online url is **www.apixline.org/pm/app/web/html5/calendar/** : [(en)](http://www.apixline.org/pm/app/web/html5/calendar/en.html) , [(fr)](http://www.apixline.org/pm/app/web/html5/calendar/) , [(es)](http://www.apixline.org/pm/app/web/html5/calendar/es.html)   
Firefox-marketplace installation is [here](https://marketplace.firefox.com/app/fl-calendar). It's recommended to reinstall.

- Security behaviour :  
When safe-mode is off, if app is disconnected after a time-out, when  a day or month is recording : the reconnection is now automatic .  
Otherwise, the login window is used like before.  

##October 18 2014 - v 1.4.2 :  
- Now on [Google Play](https://play.google.com/store/apps/details?id=net.apixline.calendar&hl=en)
 ... Thanks Apache Cordova !
 
##December 5 2014 - v 1.4.3 :  
- Bug: If a text contained "%" the app was blocked !! 
  It's now fixed.
  
##January 12 2015 - v 1.4.4 :  
- If the text of a day contains a digit 0-9 folowed by "h" or "H"  
then the beginning of text -when day is closed- is green colored.  
if you got source:
The color and rule may be changed by modifying :  
  [www.apixline.org/pm/app/web/html5/calendar/custom/default/model.xml]( http://www.apixline.org/pm/app/web/html5/calendar/custom/default/model.xml)  
Parameters are emphasisRegExp="[0-9][hH:]" and emphasisColor="#119988"

##March 16 2015 - v 1.4.6 :  
- Adding a refresh button for no-browser mobile version.  
- Login/logout and settings buttons become icons instead of text. 
 