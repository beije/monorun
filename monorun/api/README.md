# API Documentation #

## Register Player ##
In order to be able to post a score you must first register the player, this is ideally done at the same time as the game starts.

To register, call this url (or do a post request):

`/api/api.php?do=register`

When a player (or game) is registered, PHP starts a session where it save the timestamp from the registration point. This timestamp is later used to compare the time from game-start to game-end and checks that the score isn't larger than the game-timeframe.

If you don not save (or can not save) the php-cookie, the response from the server is the session id. Save this id.

## Submit high score ##

To submit a highscore you'll need the following parameters:

* `do` = String, `put`
* `score` = Int score (milliseconds)
* `username` = String username (OPTIONAL: if empty the server will generate a random username)
* `playerid` = String, The session id (The one you received when you registered the game) (OPTIONAL: Only needed if you don't have the session-cookie)
* `sourceid` = Int, The highscore source (Web = 1, Android = 2, Windows Phone = 3) (OPTIONAL: if empty or invalid the server will set it to `1`)

Your URL should look something like this:

`/api/api.php?do=put&score=12345&username=ClarkKent&playerid=123123123`

The server will answer with a JSON encoded string on success:


> {
>     "id": "418",
>     "sourceid": 1,
>     "username": "ClarkKent",
>     "dateline": 1375006247,
>     "score": 12345,
>     "position": 20,
>     "secretkey": "a823c42c9931a5048709222e5259ea69"
> }


### Changing username post-submit ###

The API allows you to change the username after the initial post of the highscore.

* `do`: String, `update`,
* `id`: Int, the id that you received after posting the initial score,
* `secretkey`: String, the secret key that you received after posting the initial score,
* `username`: String, the new username

Your URL should look something like this:

`/api/api.php?do=update&id=418&secretkey=a823c42c9931a5048709222e5259ea69&username=LouiseLane`

## Fetch highscore ##
The API allows you to either fetch a single highscore or the top-list of highscores (Limited to ten results).

### Fetching the top-list ###
Just call this url:

`/api/api.php?do=get`

You'll receive a JSON-encoded list of scores (the top ten):


> [
>     {
>         "id": "404",
>         "username": "Phoebe Capricornus",
>         "dateline": "1374973068",
>         "score": "169562",
>         "position": 1
>     },
>     {
>         "id": "410",
>         "username": "Phoebe Fornax",
>         "dateline": "1375003411",
>         "score": "100958",
>         "position": 2
>     },
>     {
>         "id": "400",
>         "username": "Iapetos Coma Berenices",
>         "dateline": "1374969624",
>         "score": "100414",
>         "position": 3
>     },
> 	[etc. etc.]
> ]

### Fetching a single highscore ###
You can also fetch a single highscore by sending in the score id.

`/api/api.php?do=get&id=404`

And the server will respond with:

> [
>     {
>         "id": "404",
>         "username": "Phoebe Capricornus",
>         "dateline": "1374973068",
>         "score": "169562",
>         "position": 1
>     }
> ]