import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge } from 'electron'
import { exec, execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('child_process', { exec: exec, execSync: execSync })
    contextBridge.exposeInMainWorld('fs', { readFileSync: readFileSync })
    contextBridge.exposeInMainWorld('path', { join: join, resolve: resolve })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
