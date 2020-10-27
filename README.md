# Remote Connectinos Conflict Avoidance
This project is only as good as a whiteboard, in terms of security and usefulness. If no one uses this, it won't stop conflicts. If a student were to try very hard, they could get pseudo-admin access and remove everyone from the list (rather like erasing the whole list from a whiteboard, don't you think?).

## Environment keys:
```
PORT
PRIMARY
SECONDARY
ADMIN_SECRET
```

The `PORT` is the port you will be listening on. Default is `8000`.

The `PRIMARY` and `SECONDARY` are for selecting colors. If none is specified, one will be chosen at program startup.

The `ADMIN_SECRET` is the secret an admin should use to get permissions to remove students from lists.

## The `/controllers/servers.js` file

This is the file you must create in order for your site to actually display things. It doesn't have to be long. It only has to look like this:

```JavaScript
// This file ignored by Git

module.exports = [
    "192.168.123.1",
    "192.168.123.2",
    "192.168.123.3",
]
```

That is, it should `modules.export` a list, with one string item for every computer you keep track of (a unique string for each unique resource).

## Starting the project

Run `node bin/www`. NodeJS should then tell you the port and admin passphrase.