import { createTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import './App.css'
import logo from './logo.svg'
const childProcess = window.require('child_process')

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

function App() {
  const [progressText, setProgressText] = useState('')

  useEffect(() => {
    // childProcess.exec(
    //   'docker compose -f public/docker-compose.yml --progress json up -d',
    //   (error: ExecException | null, stdout: string, stderr: string) => {
    //     if (stdout) console.log('stdout', stdout)
    //     if (stderr) console.log('stderr', stderr)
    //     if (error !== null) console.log('err', error)
    //   },
    // )

    // {"id":"70a40b01fdb5","parent_id":"catapult","text":"Pull complete","percent":100}
    // {"id":"ce751654c79b","parent_id":"catapult","text":"Downloading","status":"[================\u003e
    //             ]  109.3MB/334.7MB","current":109287683,"total":334671305,"percent":32}
    // {"id":"ce751654c79b","parent_id":"catapult","text":"Downloading","status":"[================\u003e
    //             ]  113.6MB/334.7MB","current":113588483,"total":334671305,"percent":33}
    // App.tsx:24 stderr {"id":"ce751654c79b","parent_id":"catapult","text":"Extracting","status":"[=================================================\u003e ]  333.7MB/334.7MB","current":333676544,"total":334671305,"percent":99}
    // 2App.tsx:24 stderr {"id":"ce751654c79b","parent_id":"catapult","text":"Extracting","status":"[==================================================\u003e]  334.7MB/334.7MB","current":334671305,"total":334671305,"percent":100}
    // 2App.tsx:24 stderr {"id":"ce751654c79b","parent_id":"catapult","text":"Pull complete","percent":100}
    // 2App.tsx:24 stderr {"id":"catapult","text":"Pulled"}
    // 2App.tsx:24 stderr {"id":"Network public_default","status":"Creating"}
    // App.tsx:24 stderr {"id":"Network public_default","status":"Error"}
    // App.tsx:24 stderr {"id":"Network public_default","status":"Created"}
    // 2App.tsx:24 stderr {"id":"Container catapult","status":"Creating"}
    // App.tsx:24 stderr {"error":true,"message":"Error response from daemon: Conflict. The container name \"/catapult\" is already in use by container \"d74adb09c8be1d656e7dc25cb13c9ebd71b427f64239384d00508a3d822403ac\". You have to remove (or rename) that container to be able to reuse that name."}
    // App.tsx:24 stderr {"id":"Container catapult","status":"Created"}
    // App.tsx:24 stderr {"id":"Container catapult","status":"Starting"}
    // App.tsx:24 stderr {"id":"Container catapult","status":"Started"}

    const dockerCompose = childProcess.exec(
      'docker compose -f public/docker-compose.yml --progress json up -d',
    )
    dockerCompose.stdout.on('data', (data: string) => {
      progressProcess(data)
    })
    dockerCompose.stderr.on('data', (data: string) => {
      progressProcess(data)
    })
  }, [])

  const progressProcess = (data: string) => {
    const lines = data.split('\n')
    for (const line of lines) {
      if (line !== '') {
        console.log(line)
        console.log(JSON.parse(line))
        setProgressText(line)
      }
    }
  }

  return (
    <div className="App">
      <p>{progressText}</p>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App
