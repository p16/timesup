# Time's up

This is a simple app to use when doing timeboxing activities.

## Why another timer for timeboxing?

I wanted to experiment with [electron](http://electron.atom.io/) and I wanted an app that would give me 3 things:

1. a timer
2. a way to block the screen when the timer is over (I wanted somthing that would literally make me stop)
3. a way to store data about my activities (a very simple `storage.json` file in the app folder at the moment)


Point `2.` is less invasive than I'd like it, but it's enough for making you stop. Basically it will open a full screen window that will cover whatever you have on the screen. To close it you have to click the "close me" link :)

## How does it look?

This is the selection for your timer

![timer selection](/doc/imgs/select-timer.png)

and this is the overlay when the time is up :)

![timer selection](/doc/imgs/times-up-overlay.png)

there is also a view for the recorder activities

![timer selection](/doc/imgs/activities.png)


# Development

## Install

```
npm install
```

## Run

```
./node_modules/.bin/electron index.js
```

## Compile apps

```
npm install -g electron-packager

electron-packager . --all --out=compiled
```


# License

Release under [MIT](/LICENSE) License
