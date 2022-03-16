module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@assets': ['./src/assets'],
          '@utils': ['./src/utils'],
          '@stores': ['./src/stores'],
          '@apis': ['./src/apis'],
          '@contants': ['./src/contants'],
          '@navigators': ['./src/navigators'],
          '@screens': ['./src/screens'],
          '@components': './src/components',
        },
      },
    ],
  ],
};
