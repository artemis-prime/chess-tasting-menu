module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./src"],
        extensions: ['.js', '.jsx', '.json', '.svg', '.png', '.jpg','.tsx','.ts'],
        alias: {
          "~": "./src",
          "~assets": "../../assets"
        }
      }
    ],
      // https://mobx.js.org/migrating-from-4-or-5.html#getting-started
      // CANNOT USE with Flatlist on Android.  Grree
    //["@babel/plugin-proposal-class-properties", { "loose": false }],
    'react-native-reanimated/plugin',
  ]
};
