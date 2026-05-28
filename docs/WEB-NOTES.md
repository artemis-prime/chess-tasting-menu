# Platform notes for web

## Use of the `Vite` bundler
A discerning eye might notice a supreme lack of configuration files in this package. They can blame that on the amazing [`vite`](https://vitejs.dev/) dev server / bundler.  It has so many sensible defaults that you rarely have to configure anything.  It's also written in Go, so it's super fast.  It's now our go to for any React web project.

### location of `index.html` 
That same discerning eye may also notice that `index.html` does not live in some specially annointed place derived from web servers like `public/`.  It is a `vite` convention that it lives at the very root of your source tree.  They consider it part of the code for your app and the actual entry point from which a dependency graph can be built.   

[return to main doc](../README.md)