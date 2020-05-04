# RGB Filter

In browser image processing for old fashion stylizing.

### [Demo](https://bouvens.github.io/rgb-filter/)

[npm-badge]: https://img.shields.io/npm/v/state-control.png?style=flat-square
[npm]: https://www.npmjs.org/package/state-control

## What's this?

This Javascript application decomposes every pixel into 3 primitive stripes of clear colors: red, green and blue. Result may be zoomed without smoothing.

On the next photo you can find usual white on IPS panel on the left side and decomposed by this application white on the right side.

![Zoomed IPS panel](https://raw.githubusercontent.com/bouvens/rgb-filter/master/images/ips.jpg)

Also there’s an animated noise on the colors!

## How to run locally

Run in bash:
```Shell
git clone git@github.com:bouvens/rgb-filter.git
cd rgb-filter
yarn
yarn run start
```

Also there's a script for local build:
```Shell
yarn run build
```

## References

* The Moon from ~~sky~~ NASA
* Sunset from [Pixabay](https://pixabay.com/photo-1626515/)
* Wikipe-tan from Wikipedia
* Throbber from [there](https://loading.io/spinner/triangles)
* GIF encoding from [library](https://github.com/jnordberg/gif.js)

This experiment made with [state-control ![npm][npm-badge]][npm]
