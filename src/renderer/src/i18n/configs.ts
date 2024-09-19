import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import translation_en from './locales/en.json'
import translation_ja from './locales/ja.json'

i18n
  .use(initReactI18next)
  .use(LanguageDetector) // ユーザーの言語設定を検知するために必要
  .init({
    fallbackLng: 'en', // デフォルトの言語を設定
    returnEmptyString: false, // 空文字での定義を許可に
    resources: {
      // 辞書情報
      // 用意した翻訳ファイルを読み込む
      en: {
        translation: translation_en,
      },
      ja: {
        translation: translation_ja,
      },
    },
    interpolation: {
      // 翻訳された文字列内のHTMLやReactコンポーネントをエスケープすることを無効に
      escapeValue: false,
    },
    react: {
      // 指定したHTMLノードを翻訳時にそのまま保持して表示するための設定
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'span'],
    },
  })

export default i18n
