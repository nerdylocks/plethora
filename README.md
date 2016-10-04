## Plethora Technical Assignment

### Overview 
This project is a commandline program that will output a list of the most dangerous regions on earth given a source of earthquake data.

### Installation
These instructions assume you have [Node.js 4.x](https://nodejs.org/en/download/) and [PostgreSQL 9.4.4](https://www.postgresql.org/download/) already installed.

```
https://github.com/nerdylocks/plethora.git
```

cd into the cloned directory

```
cd plethora
```

Install dependencies using NPM:

```
npm install
```

#### Database Setup
Create the postgres user for the application (replace [username] with your OS X root username):

```
psql -U [username] -c "create user plethora_db_admin with password 'password';"
```
Create the database and grant the created user as owner:

```
psql -U [username] -c "create database earthquakes_db with owner plethora_db_admin encoding='utf8';"
```

### Configuration
```
PATH=$PATH:/path/to/plethora
export NODE_PATH=/path/to/plethora/
```
Please note the trailing `/` when storing the `$NODE_PATH`.

### Running the appication
```
most-dangerous-regions
```

## Usage
```
most-dangerous-regions -h

Usage: index [options]

  Options:

    -h, --help           output usage information
    -l, --limit <limit>  Number of most dangerous to list (default=10)
    -d, --days <days>    Number days to go back to analyze data from (default=30)
```
