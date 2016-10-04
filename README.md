## Plethora Technical Assignment

### Overview 
This project is a commandline program that will output a list of the most dangerous regions on earth given a source of earthquake data.

## Installation
These instructions assume you have [Node.js 4.x] (https://nodejs.org/en/download/) (or above) and [PostgreSQL 9.x](https://www.postgresql.org/download/) already installed.

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

## Database Setup
Create the postgres user for the application (replace [username] with your operating system's root username):

```
psql -U [username] -c "create user plethora_db_admin with password 'password';"
```
Create the database and grant the created user as owner:

```
psql -U [username] -c "create database earthquakes_db with owner plethora_db_admin encoding='utf8';"
```

## Configuration
#### Export Paths
Provide the absolute path of this project to the following environment variables

```
export PATH=$PATH/path/to/plethora
export NODE_PATH=/path/to/plethora/
```
Please note the trailing `/` when storing the `$NODE_PATH`.

#### Supply database credentials to the application (optional)
If you want to use different database credentials other than the ones that you created in the Database Setup section of this document, do the following. Otherwise you can skip this step.

```
cp config-example.json config.json

```
Open your newly copied config.json and supply relevant values.


## Running the application
```
most-dangerous-regions
```

### Usage

```
most-dangerous-regions -h
```
