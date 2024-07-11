# nftrone-db-server
Local DB management for the NFTrone project.

# Goals
- To provide safe and flexible data-storage level for the NFTrone project to supply frontend with required metadata.
- To practice in Backend development. 

# Structure 
Heavily inspired by 
https://github.com/leejh3224/clean-architecture-express-typescript



# Libs and techs used here
## DB 
[SQLite](https://www.sqlite.org/)

For now I wanted to deliver ASAP to go on with the Frontend part. This is a one man (demo) project, so I wanted to cut as many corners as possible, while maintaining in clean and easily maintainable.

ATM Local DB would be enough. Choosing relational DB was a matter of being at least familiar with them.

In this iteration DB structure looks like this: 
```
+---------+              +--------+                +-------+
| Project |------------->| Layer  |--------------->| Image |
+---------+   hasMany    +--------+     hasMany    +-------+
     |                    ^    |                      ^
     | belongsTo          |    | belongsTo            | belongsTo
     +--------------------+    +----------------------+  
```

In the next iterations new tables will be introduced to store generated and saved image variants. 

## ORM
[Sequelize 6](https://sequelize.org/)

The decision to introduce ORM to the project has been inspired mainly by my desire to practice some real world practices. As I bonus I get: 
- Easier initial setup
- Easier migrations.

## Setup and Run
Just run the project `npm run start` or `yarn run start`.
On the initial load db will be created. 

## Testing
Run `npm run test` or `yarn run test` for tests.

