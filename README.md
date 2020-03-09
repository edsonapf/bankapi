# FBank API

A simple API to simulate bank transactions like withdraw, deposits and transfers using *NodeJS*, *Express* and *Postgresql*.

## Pre-requirements

- NodeJS version 12 or superior
- Postgres version 12
- Sequelize package

**To install sequelize package run this command at the terminal**

```
npm install -g sequelize-cli
```

## Installation

Run these commands to install all project dependencies

```
npm install
```

After install the dependencies, create a database called *fbank* and run this command below to create the tables on the database

```
sequelize db:migrate
```

## Start the application


```
npm start
```

**Make sure your pc is not using port 3000**
