### Mini Kickstarter

This application is a small command-line program with the basic features of Kickstarter. Specifically, creating projects, backing projects, and viewing an overview of project statuses.

## Getting Started

This project is built with Node.js. If you do not have Node installed, you can get it via homebrew or on the [Node website](http://nodejs.org). Installing Node will also install npm.

To install Mini Kickstarter, run the command `npm install -g opheliasdaisies/mini-ksr` in your terminal. This will install the project globally, and it will be able to be run in any directory from the command line with the command `kickstarter`.

You also have the option to install Mini Kickstarter locally to a specific directory. To do so, clone the git repo and then while in the project directory run `npm install`. This will install the project and you will be able to run it from the command line with the command `./kickstarter.js`.

## Database Setup

This project uses PostgreSQL. Before running Mini Kickstarter, make sure you have Postgres installed and running.

By default, Mini Kickstarter will look for a Postgres database named 'kickstarter' with no username or password. Under this default, if you create a 'kickstarter' database you will be good to go! Most systems will let you use the command `createdb kickstarter` to do this.

If this doesn't work for your setup, you can create a custom config in your home directory. The custom config file should be named `<NODE_ENV>_config_ks.json`. Mini-Kickstarter devaults NODE_ENV to 'devleopment'. The config file should follow this structure:
```json
{
  "postgresql": {
    "database": "<database name>",
    "host": "localhost",
    "dialect": "postgres",
    "name": "<user>",
    "password": "<password>"
  }
}
```
To create the tables for Mini Kickstarter, the first time you run the project you need to use the flag `-s` or `--sync`. This will generate the correct tables for the project if the tables do not already exist.

You do have the ability to force a re-sync of your tables, but this will erase all of your data! Do so with caution! To force a re-sync you can add append the `-f` or `-force` flag.

## Using Mini Kickstarter

### Create a Project

You can create a project with the command `project <project name> <target value>`.
This will create a new project with the given project name and target goal.
```bash
$ kickstarter project Project_Sugar_Cube 500
Project Project_Sugar_Cube has been successfully created with a target of $500.00.
```

### Back a Project

You can back a project with the command `back <backer name> <project name> <credit card> <pledge amount>`.
This will back a given project with a credit card and an amount to pledge, and associate it with a backer name.
```bash
$ kickstarter back John Project_Sugar_Cube 4111111111111111 2
John backed Project_Sugar_Cube for $2.
```

### List Project Pledges

You can retrieve a list of all of the pledges towards a project with the command `list <project name>`.
This will list all of the backers, each individual pledge amount, and the amount the project needs to raise to achieve its target goal.
```bash
$ kickstarter list Project_Sugar_Cube
-- Kim backed for $100
-- John backed for $2
Project_Sugar_Cube still needs $398 to be fully funded.
```

### List Backer Pledges

You can retrieve a list of all the projects a backer has supported with the command `backer <backer name>`.
This will list all of the projects the backer has supported, and how much the backer has pledged towards each one.
```bash
$ kickstarter backer John
-- Backed Project Ice-Cream-Sundae for $30.
-- Backed Project_Sugar_Cube for $2.
```

### Sync Tables

In order to create the database tables, add the flag `-s` or `--sync` to any command, or simply run `kickstarter -s`. Adding the `-f` or `--force` flag will overwrite the current database tables, erase all data, and re-create them.
```bash
$ kickstarter -s
Tables have been created if they did not exist.

$ kickstarter -sf project Project_Sugar_Cube 500
Tables have been created or overwritten.
Project Project_Sugar_Cube has been successfully created with a target of $500.00.
```

### Help

Adding the `-h` or `--help` flag will bring up information on how to use the program. Entering an invalid command will also bring up the command line help information.

## Uninstalling

To uninstall Mini Kickstarter, run the command `npm rm -g mini-ksr`.

## Testing

This project uses the [tap](https://www.npmjs.com/package/tap) testing framework. To run the tests, use the command `npm test` from the project directory.

By default, the tests assume that there is a `kickstarter_test` database with no user and no password. If you wish to use a different database you can create a custom config in your home directory as outlined in the [Database Setup](#database-setup) section above.
