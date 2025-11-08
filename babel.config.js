const dotenvFiles = {
  dev: '.env.dev',
  release: '.env.release',
  prod: '.env.prod',
};

const APP_ENV = process.env.APP_ENV || 'release';

module.exports = {
  presets: ['@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: dotenvFiles[APP_ENV], // ✅ APP_ENV에 맞게 env 파일 선택
        safe: false,
        allowUndefined: false,
      },
    ],
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './src', // ✅ "@/..." → src/... 매핑
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      },
    ],
    'react-native-reanimated/plugin', // ✅ 반드시 마지막에 추가
  ],
};
