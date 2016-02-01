# Monorun! #

A javascript (Canvas) game, built from scratch with some dependency to jQuery (selector fetching and events). The game has a small backend which stores high scores.

## Installation ##

Monorun itself doesn't need anything else but a web browser. Though to run the complete game, with the high score you'll need to have a webserver with php and mysql.

There's a config file in `/monorun/api/config.example.php` copy this file to the same folder and rename it to `config.php`

The following options are available in the config

* `DB_USERNAME` = `STRING`, The database username
* `DB_PASSWORD` = `STRING`, The user's password
* `DB_DATABASE` = `STRING`, The database name
* `DB_HOST`     = `STRING`, The IP or hostname to the database
* `ANALYTICS`   = `STRING`, if you have Google analytics or any other tracking script, add it here, it will be outputted by `/monorun/api/analytics.php`
* `DEBUG`       = `BOOLEAN`, `false` if you want to use the generated JS cache file (`/monorun/api/clientscript.php`), `true` when you want to develop on the code

To setup the high score you need to add this to your crontab, which will run the cron script every 10 minutes.

`*/10 * * * * php monorun/api/cron.php  > /dev/null 2>&1`

### Back end ###

Monorun is developed on a linux configuration that runs apache, php and mysql (So you'll need those). Apache will need to have the module `rewrite` enabled and PHP must be `PHP 5.10` or higher (Sinve we use `PDO` when connecting with the database).

#### mysql ####

There's a mysql dump file, `monorun/api/monorun.sql`, that you need to manually import.

#### cache ####

The game concatenates all the js files in `monorun/clientscript` and `monorun/libs` to one file, if the config flag `DEBUG` is set to false a file in cache should be generated `monorun/cache/clientscript-cache.js` and this file will be read instead of concatenating every page view. It's important to remove this file everytime you update the game from git, so it's regenerated with the latest javascript.

### Front end ###

We've developed against all modern browsers and we've tested specifically against Windows Phone 8 and Android 4.1.2 (Chrome browser). We've tried sporadically to test the game on iOS devices, but we can't say we know for sure that everything works.

## Documentation ##

Most of the code is documented inline.

# Credits #

Originally developed and designed by [Benjamin Horn](http://benjaminhorn.io) and [Carlos Eriksson](http://carloseriksson.com/).

## Other versions ##

Monorun has been ported to a couple of other platforms as well:

* [monorun-libgdx - Java/libgdx - Johan Johansson](https://github.com/swemaniac/monorun-libgdx)
* [monorun-sdl - C/SDL - Johnny Härtell](https://github.com/jhartell/monorun-sdl)
* [monorun-for-windows-phone - C#/XNA - Benjamin Horn](https://github.com/beije/monorun-for-windows-phone)

