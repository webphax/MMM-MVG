# MMM-MVG
Station monitor for the Münchner Verkehrsgesellschaft (MVG) bus, tram and train system.

Currently this version is in early Alpha status and still needs some adjustments.

## Prerequisite
A working installation of [MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror)

## Dependencies
  * npm
  * [request](https://www.npmjs.com/package/request)

## Installation
1. Navigate into your MagicMirror's `modules` folder.
2. Execute `git clone https://github.com/webphax/MMM-MVG.git`.
3. Restart your MagicMirror app

## Configuration
### Single Station Configuration
Sample minimum configuration entry for your `~/MagicMirror/config/config.js`:

    ...
    
    {
        module: 'MMM-MVG',
        position: 'top_right',
        config: {
			stations: [
				{
					url: "http://www.mvg-live.de/ims/dfiStaticAnzeige.svc?haltestelle=hackerbr%FCcke&ubahn=checked&bus=checked&tram=checked&sbahn=checked", // Configure your search query via http://www.mvg-live.de/ims/dfiStaticAuswahl.svc	
				},
			],		
            maxConn: 5,     // How many connections would you like to see? It applies to all stations (Maximum: 10)
			reload: 30   	// How often should the information be updated? It applies to all stations (In seconds)		
        }
    },
    
    ...

### Multi Station Configuration
Sample minimum configuration entry for your `~/MagicMirror/config/config.js`:

    ...
    
    {
        module: 'MMM-MVG',
        position: 'top_right',
        config: {
			stations: [
				{
					url: "http://www.mvg-live.de/ims/dfiStaticAnzeige.svc?haltestelle=hackerbr%FCcke&ubahn=checked&bus=checked&tram=checked&sbahn=checked", // Configure your search query via http://www.mvg-live.de/ims/dfiStaticAuswahl.svc	
				},
                {
					url: "http://www.mvg-live.de/ims/dfiStaticAuswahl.svc?haltestelle=hauptbahnhof&ubahn=checked&bus=checked&tram=checked&sbahn=checked", // Configure your search query via http://www.mvg-live.de/ims/dfiStaticAuswahl.svc	
				},
			],		
            maxConn: 5,     // How many connections would you like to see? It applies to all stations (Maximum: 10)
			reload: 30   	// How often should the information be updated? It applies to all stations (In seconds)		
        }
    },
    
    ...