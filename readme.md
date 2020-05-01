# T4NG Coding Challenge - A Team

### Team
 * Arden Klemmer, [@ardenk](https://github.com/ardenk), &Partners
 * Yoni Knoll, [@infinityplusone](https://github.com/infinityplusone), &Partners
 * David Truxall, [@davetrux](https://github.com/davetrux), Perspecta
 * Jon Stone, PSG
 * Jon Luzader, [@jzade](https://github.com/jzade), PSG
 * John Line, PSG

### Additional Support
 * Kila Thomas, Trilogy Federal
 * David Park, Perspecta

### Resources
 * **Tracking:** [Trello](https://trello.com/b/4l8HlRHd/t4ng-coding-challenge-team-a)
 * **Google Drive:** [Full Team](https://drive.google.com/drive/folders/1cVGc_tJ_WsjPxeRmXye-49xNhipiHFor?usp=sharing) • [Team A](https://drive.google.com/drive/folders/1V6fF3Xka_HsSyPyPs9pnezLZ9qd_Z8pj?usp=sharing)

 ### TSA-API Setup
 * To test locally:
 * Setup your environment variables (all described in server.js)
 * navigate to local repo  and run "npm i" then "node server.js" - navigate to your localhost:[port] which is set by your env variable
 
 ### WARNING - On First run, the TXI library fulltext index is going to run on the airports-meta.json file
 ### THIS WILL TAKE 3-5 MINUTES - a 0.....50.....100 will be displayed in console
 ### Once the index completes, you can open up server.js and comment out line 41 loadDatabase() - the index will persist locally and will no longer run each time you execute "node server.js" 
 * we are working on finding a better library to work with PouchDB with better performance as well as a better way to manage the index that is scalable (and not a comment toggle..lol) - any suggestions please pass them across :) 
 
 ### API Routes: 
 * /
 * /api/v1/test
 * /api/v1/airport/[3-letter airport code]
 * /api/v1/airports
 * /api/v1/geohash/[latitute]/[longitude]
 * /api/v1/airport_fuzzy/[free-text]
