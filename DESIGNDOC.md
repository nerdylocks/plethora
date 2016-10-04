## DESIGNDOC

#### Describe how you would improve upon your current design
- Use a technology that natively supports geospatial queries (i.e. Elasticsearch, MongoDB, PostGIS). That way, the application layer doesn't have to do the heavy lifting
- Use a places geodump of "places" for faster performance instead of relying on a third party API
- Refactor the earthquake points grouping logic to be more general to support flexible region definitions

#### Why did you choose the region definition you did? What other definitions did you consider and what are the pros/cons of each approach?

I chose geographical region definition because I think it is most relevant to the user.

- Pros: it enables the points to be clustered based on the provided coordinates, makes request parameters tunable and flexible
- Cons: The current implementation memory and CPU intensive


After looking at the raw USGS data, I considered the `net` field to group the earthquake point by ([the network considered to be the preferred source of information for this event] (http://earthquake.usgs.gov/data/comcat/data-eventterms.php#net). 

- Pros: Easy computation
- Cons: Would not mean much to the user, puts the implementation in a box, thus limiting type of queries


##### If you wanted to expose this tool as a web service, what approach would you take? What questions would you ask about the product requirements and how would the answers to those questions change your approach?

##### Exposing tool as a web service
- I would would introduce an HTTP server with a web application framework like Express. (See diagram below). This webserver's routes would map to the Earthquakes service controllers.
![](https://i.imgur.com/MZJYAHh.jpg)
- I would have the Sync service run as a job with a certain frequent intervals (to avoid stale data) instead of it running it per request. That way, the user (or application that consumes the API endpoints) doesn't have to wait until the latest USGS data is retrieved on each request.


##### Questions I would ask
- How will this application be used? Will data be consumed by a webapp, by another application?
	* If by another application, I would automate documentation ensure documentation is up-to-date so breaking changes won't affect the maintainers of the consuming application
- How up-to-date does the USGS data need to be? Realtime?
	* If realtime, I would introduce websockets
- What is the release cycle of this app?
	* If very often, I would implement new features over shorter sprints
- Where would the application live? Would a partner run it on their own? or would we host it ourselves?
	* If ourselves, I would integrate the deployment scripts with a CI system
	* If by partners, would provide installation (and upgrade) scripts that is cognizant of varying environments
- How far back (in days) of data do we need to keep?
	* If very far back out, I would split out the Earthquakes service (with an HTTP server) and run it on a more preferment machine and run the webserver that the webapp runs on (assuming we'd have a webapp) on a cheaper machine.
- What is the acceptance criteria for each new feature?
	* This is just an important question to determine the definition of success of each sub-task
- Do we need to collect performance matrix?
	* If yes, I would thoroughly log events and pipe logs to a third party analysis tool like SumoLogic