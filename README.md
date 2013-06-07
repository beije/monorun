# Monorun! #

A javascript (Canvas) game, still being developed and is considered to be in pre-alpha state, though the game does run, it doesn't have any implementation for the core game mechanics.

## Installation ##

Monorun itself doesn't need anything else but a web browser. Though to run the complete game, with the high score you'll need to have a webserver with php and mysql.

There's a config file in `/monorun/api/config.example.php` copy this file to the same folder and rename it to `config.php`

The following options are available in the config

* DB_USERNAME = STRING, The database username
* DB_PASSWORD = STRING, The user's password
* DB_DATABASE = STRING, The database name
* DB_HOST = STRING, The IP or hostname to the database
* ANALYTICS = STRING, if you have Google analytics or any other tracking script, add it here, it will be outputted by `/monorun/api/analytics.php`
* DEBUG = BOOLEAN, `false` if you want to use the generated JS cache file (`/monorun/api/clientscript.php`), `true` when you want to develop on the code

To setup the high score you need to add this to your crontab, which will run the cron script every 10 minutes.

`*/10 * * * * php monorun/api/cron.php  > /dev/null 2>&1`

### Back end ###

Monorun was developed on debian 7 with apache, php and mysql installed. The backend part needs the following versions of software

* PHP 5.4 (PDO support for mysql)(or higher)
* mod_rewrite

The game h

### Front end ###

We've developed against all modern browsers and we've tested specifically against Windows Phone 8 and Android 4.1.2 (Chrome browser). We've tried sporadically to test the game on iOS devices, but we can't say we know for sure that everything works.

## Documentation ##

Most of the code is documented inline.