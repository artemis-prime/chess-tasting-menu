# Chess two ways

## An exploration of React, React Native, and Domain Driven Design

<div align='center'>
<p >(...and chess)</p>
<image src='./docs/web-shot-larger.png' width='80%'/>
</div>


### Workspace structure
This `yarn` monorepo has three packages:

```  
"packages": [
  "just-the-chess",
  "apps/chess-web",
  "apps/chess-rn"
]
```


They are named and organized this way to further re-enforce the separation of concerns between the core domain (in `just-the-chess/`), and the two actual apps (in `chess-web` and in `chess-rn`)

### Running the apps

#### The web version is deployed as a [Github Pages site](https://artemis-prime.github.io/chess-two-ways/) for the this repo. 
If you are looking at the web version on a **mobile device**, it's strongly recommended that you **use Firefox or Safari**, since Chrome turns long presses into a context menu trigger.  This is a known issue for drag 'n drop web apps, that despite my best efforts, I've not yet found a great solution for. [View it here](https://artemis-prime.github.io/chess-two-ways/) or proceed as follows to run it local on web or as a React Native app locally.

Please run all scripts from the monorepo root (where the root `package.json` lives), as the individual package scripts are not meant to be used by the uninitiated.

* First, run `yarn install` to install all dependencies for all targets.

* Then run either `yarn prep:web` or `yarn prep:rn` depending on your desired version.

* To see the React web version, run `yarn serve:web`.  This will start a [vite](https://vitejs.dev/) dev server at `localhost:8080/chess-two-ways/`.  The first time you may need to open a tab manually.  

* To see the React Native version (running in an Android emulator), run `yarn deploy:rn`.  This will take a few minutes to launch your emulator and build an Android pkg and install it there. 

React Native: The above assumes you have Java 11, and the Android SDK correctly installed and configured.  In practice you also need Android Studio to create key files and emulator profiles.  [Instructions are here](https://reactnative.dev/docs/environment-setup).  Select 'React Native CLI Quickstart' (not Expo), and then whatever Development OS you are on, and 'Android' for the Target OS. 


<image src='./docs/rn-port-moves.png' width='20%' align='right' style='margin-left: 20px;'/>

## Domain Driven Design 

DDD is about developing a self-contained, cleanly-written domain that is agnostic about how it's displayed or how apps that use it are implementated.  It's easy to unit test, and easy to create a CLI for. It is delightfully unburdened and unpoluted by knowledge of UI stack quirks, or any slings and arrows of outrageous pixels. It's "just the domain!" Please find the [longer discussion and links here](./docs/DDD.md).

## Domain architecture
The core functionality of Chess is implemented in `just-the-chess/` and [discussed here](./docs/CORE_ARCH.md). 


## Shared UI architecture
Both the React Web and React Native apps are conceived and architected in the same way. This is deliberate and has many advantages. The approach is [discussed here](./docs/UI-COMMON-ARCH.md). 

<br clear="both"/>

## Platform notes
The React web app uses the most wonderful [Vite](https://vitejs.dev/) dev server and bundler.  It lives in `apps/chess-web` and specific notes [are here](./apps/chess-web/WEB-NOTES.md). The React Native app has been developed and tested on Linux using Android emulation with the Metro bundler and dev server.  It lives in `apps/chess-rn` and is [discussed here](./apps/chess-rn/RN-NOTES.md).

