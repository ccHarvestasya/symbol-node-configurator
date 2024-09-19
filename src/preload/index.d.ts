import { ElectronAPI } from '@electron-toolkit/preload'
import { exec, execSync } from 'child_process'
import { readFileSync } from 'fs'
import { join, resolve } from 'path'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    child_process: {
      exec: typeof exec
      execSync: typeof execSync
    }
    fs: {
      readFileSync: typeof readFileSync
    }
    path: {
      join: typeof join
      resolve: typeof resolve
    }
  }
}
