# RGB Filter

Image processing and GIF generator in a browser for old fashion stylizing.

### Take a look at the [Demo](https://bouvens.github.io/rgb-filter/)

[npm-badge]: https://img.shields.io/npm/v/state-control.png?style=flat-square
[npm]: https://www.npmjs.org/package/state-control

## What's This?

This Javascript application decomposes every pixel into three stripes of bright colors: red, green, and blue. You may zoom the result without smoothing.

In the next photo, you can find the usual white on an IPS panel on the left side and decomposed by this application white on the right side.

![Zoomed IPS panel](https://raw.githubusercontent.com/bouvens/rgb-filter/master/images/ips.jpg)

Also, there're an animated noise on the colors, smooth and discrete stripes, and converting to 8-bit color!

| Before  | After |
| ------------- | ------------- |
| ![Zoomed IPS panel](https://raw.githubusercontent.com/bouvens/rgb-filter/master/images/before.jpg)  | ![Zoomed IPS panel](https://raw.githubusercontent.com/bouvens/rgb-filter/master/images/after.gif)  |

## How to Run Locally

Run in bash:
```Shell
git clone git@github.com:bouvens/rgb-filter.git
cd rgb-filter
yarn
yarn start
```

Also, there's a script for local build in the dist directory:
```Shell
yarn run build
```

## References

* Samples from [1](https://unsplash.com/photos/e_HRcYwbXZ0), [2](https://unsplash.com/photos/-YMhyDPQje4), [3](https://unsplash.com/photos/4IVTllqs5QQ), [4](https://unsplash.com/photos/jC9yDaQJolo), [5](https://unsplash.com/photos/yPfkid807HU)
* Throbber from [there](https://loading.io/spinner/triangles)
* GIF encoding from the [library](https://github.com/jnordberg/gif.js)

This experiment made with [state-control ![npm][npm-badge]][npm]
