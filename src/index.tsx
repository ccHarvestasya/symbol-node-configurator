import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import './index.css'
import { Loader } from './pages/Loader'
import reportWebVitals from './reportWebVitals'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

const rootElement = document.getElementById('root') as HTMLElement
const root = createRoot(rootElement)
root.render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Loader />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
