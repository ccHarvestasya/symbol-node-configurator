// 各モジュールのインポート
import { app, BrowserWindow } from 'electron'
import isDev from 'electron-is-dev'
import path from 'path'

const __dirname = import.meta.dirname;

// ブラウザウィンドウに関する処理
function createWindow() {
  // ブラウザウィンドウの作成
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // ウィンドウプロセスの初期化スクリプト指定
    },
  })

  // URLの読み込み
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000' // 開発環境の場合
      : `file://${path.join(__dirname, '../build/index.html')}`, // 本番環境の場合
  )
}

// 初期化が完了し、ウィンドウの起動準備ができた時に呼ばれる処理（APIの呼び出しはこの処理の後）
app.whenReady().then(() => {
  createWindow()

  // DjangoをGunicorn経由で起動する処理（※後ほど記述）

  app.on('activate', function () {
    // 開いているウィンドウがなければ開く
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// ウィンドウが閉じた時の処理（macOSでは明示的にアプリケーションを終了した時）
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
