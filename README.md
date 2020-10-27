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

You may use the `.env.example` file as a template to create a `.env` file which will be loaded automatically. If you desire to change anything using the `.env` file, the server will need to restart.

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

Run `node bin/www`. NodeJS should then tell you the port and admin passphrase. If you wish to daemonize it, I would suggest `pm2`.

```bash
sudo node install -g pm2
pm2 start bin/www
# Some helpful commands to know:
pm2 logs
pm2 restart all
pm2 stop all
```

## On the origins

This project started out as a help queue and was modified to fit needs. If you find any references to help, help-queue, student, ta, zoom, in-class, or something else not relevant to a simple conflict-avoiding site, it's an artefact of legacy. You may suggest any changes by forking this project as your own, applying changes, and making a pull request here. Please test out any changes you make, to decrease the likelihood of bugs getting through.