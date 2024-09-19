import './assets/main.css'

import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { Configurator } from '@renderer/pages/Configurator'
import { Home } from '@renderer/pages/Home'
import { Loader } from '@renderer/pages/Loader'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Loader />} />
          <Route path="/home" element={<Home />} />
          <Route path="/configurator" element={<Configurator />} />
          <Route path="/*" element={<Loader />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
)
