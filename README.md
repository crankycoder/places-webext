A demo of digging through PlacesDB to populate a WebExtension widget.


Building the new WebExtension API
---------------------------------

In ./addon-api, there's a Makefile.

You should be able to just run `make` to build an XPI file called
`experiment.xpi`. This addon will expose a new WebExtension that gives raw SQL
access to the Places database.


Building the WebExtension
-------------------------

In ./extension is the source for the WebExtension that loads the Places
database and exposes a new toolbar button with a popup that shows an ordered
list of sites which you are most likely to use at this hour on this day of the
week.

You do not need to 'build' the WebExtension to run this demo.

Installing
----------

First install the new addon.  Go to `about:debugging` in Firefox Developer
Edition and click on `Load Temporary Add-on`.

Install `experiment.xpi`.

Next you'll need to install the WebExtension the same way.  
Click on `Load Temporary Add-on` and select the background.js file in 
the `./extension` directory.


