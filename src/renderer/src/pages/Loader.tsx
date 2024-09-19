import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { Box, Card, CircularProgress, Container, Grid2 } from '@mui/material'
import { load } from 'js-yaml'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useToggle } from 'react-use'
import symbolLogo from '../assets/symbol_logo.png'
const childProcess = window.child_process
const fs = window.fs

type DockerCompose = {
  services: {
    server: {
      image: string
    }
  }
}

export const Loader = (): JSX.Element => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const loadingIcon = <CircularProgress size={15} />
  const loadingCompleteIcon = (
    <CheckCircleOutlineIcon color="info" style={{ width: 19, verticalAlign: -6 }} />
  )
  const loadFailureIcon = (
    <HighlightOffIcon color="error" style={{ width: 19, verticalAlign: -6 }} />
  )

  const [dockerVer, setDockerVer] = useState('')
  const [dockerLoaderIcon, setDockerLoaderIcon] = useState(loadingIcon)
  const [dockerComposeVer, setDockerComposeVer] = useState('')
  const [dockerComposeLoaderIcon, setDockerComposeLoaderIcon] = useState(loadingIcon)
  const [dockerImageVer, setDockerImageVer] = useState('')
  const [dockerImageLoaderIcon, setDockerImageLoaderIcon] = useState(loadingIcon)
  const [dockerContainerStatus, setDockerContainerStatus] = useState('')
  const [dockerContainerLoaderIcon, setDockerContainerLoaderIcon] = useState(loadingIcon)
  const [isDocker, setIsDocker] = useToggle(true)
  const [isDockerImage, setIsDockerImage] = useToggle(false)

  const requestedDockerVer = '27.2.0'
  const requestedDockerComposeVer = '2.29.0'

  useEffect(() => {
    // Docker
    childProcess.exec('docker -v', (error, stdout, _stderr) => {
      if (stdout) {
        const ver = stdout.toString().match(/^Docker version ((\d+.?)+),/)
        if (!ver) {
          setDockerVer(t('Not installed.'))
          setDockerLoaderIcon(loadFailureIcon)
          setIsDocker(false)
        } else if (ver[1] < requestedDockerVer) {
          setDockerVer(`Docer version > ${requestedDockerVer}`)
          setDockerLoaderIcon(loadFailureIcon)
          setIsDocker(false)
        } else {
          setDockerVer(ver[1])
          setDockerLoaderIcon(loadingCompleteIcon)
        }
      }
      if (error) {
        console.error(error)
        setDockerVer(t('Not installed.'))
        setDockerLoaderIcon(loadFailureIcon)
        setIsDocker(false)
      }
    })
    // Docker Compose
    childProcess.exec('docker compose version', (error, stdout, _stderr) => {
      if (stdout) {
        const ver = stdout.match(/^Docker Compose version v((\d+.?)+)-/)
        if (!ver) {
          setDockerComposeVer(t('Not installed.'))
          setDockerComposeLoaderIcon(loadFailureIcon)
          setIsDocker(false)
        } else if (ver[1] < requestedDockerComposeVer) {
          setDockerComposeVer(`Docer Compose version > ${requestedDockerComposeVer}`)
          setDockerComposeLoaderIcon(loadFailureIcon)
          setIsDocker(false)
        } else {
          setDockerComposeVer(ver[1])
          setDockerComposeLoaderIcon(loadingCompleteIcon)
        }
      }
      if (error) {
        console.error(error)
        setDockerComposeVer(t('Not installed.'))
        setDockerComposeLoaderIcon(loadFailureIcon)
        setIsDocker(false)
      }
    })
    // Docker Image
    childProcess.exec(
      'docker image ls --format json symbolplatform/symbol-server',
      (error, stdout, stderr) => {
        if (error) {
          console.error(error)
          setDockerImageVer(t('Connection error.'))
          setDockerImageLoaderIcon(loadFailureIcon)
        } else if (stdout === '' && error === null && stderr === '') {
          setDockerImageVer(t('Downloading.'))
        } else if (stdout !== '' && error === null && stderr === '') {
          const ver = JSON.parse(stdout).Tag
          setDockerImageVer(ver)
          setDockerImageLoaderIcon(loadingCompleteIcon)
          setIsDockerImage(true)
        }
      }
    )
    if (!isDockerImage) {
      setDockerImageVer(t('Now Downloading...'))
      const dockerComposeYamlPath = './public/compose.yaml'
      const dockerComposeYaml = load(
        fs.readFileSync(dockerComposeYamlPath, 'utf-8')
      ) as DockerCompose
      const imageName = dockerComposeYaml.services.server.image
      console.log(imageName)
      childProcess.exec(`docker pull -q ${imageName}`, (error, stdout, stderr) => {
        if (stdout) {
          try {
            const stdout = childProcess.execSync(
              'docker image ls --format json symbolplatform/symbol-server'
            )
            const ver = JSON.parse(stdout.toString()).Tag
            setDockerImageVer(ver)
            setDockerImageLoaderIcon(loadingCompleteIcon)
            setIsDockerImage(true)
          } catch {
            setDockerImageVer(t('Download failed.'))
          }
        } else if (stderr) {
          console.error(stderr)
          setDockerImageVer(t('Download failed.'))
        } else if (error) {
          console.error(error)
          setDockerImageVer(t('Download failed.'))
        }
      })
    }
  }, [])

  useEffect(() => {
    if (!isDocker) return
    if (!isDockerImage) return

    childProcess.exec(
      'docker compose -f ./public/compose.yaml --progress json up -d',
      (_error, _stdout, stderr) => {
        const status = JSON.parse(stderr).status
        setDockerContainerStatus(status)
        if (status === 'Running' || status === 'Started') {
          setDockerContainerLoaderIcon(loadingCompleteIcon)
          setDockerContainerStatus(t('Container started.'))
          navigate('/home')
        }
      }
    )
  }, [isDockerImage])

  return (
    <>
      <Container maxWidth="sm">
        <img src={symbolLogo} alt="Symbol Logo" width={150} />
        <Box component="section" sx={{ p: 2 }}>
          <Grid2 container alignItems="center" justifyContent="center" direction="column">
            <Grid2>
              <Card variant="outlined" sx={{ m: 0.3, p: 0.5 }}>
                {dockerLoaderIcon} Docker: {dockerVer}
              </Card>
              <Card variant="outlined" sx={{ m: 0.3, p: 0.5 }}>
                {dockerComposeLoaderIcon} Docker Compose: {dockerComposeVer}
              </Card>
              <Card variant="outlined" sx={{ m: 0.3, p: 0.5 }}>
                {dockerImageLoaderIcon} Symbol Server Image: {dockerImageVer}
              </Card>
              <Card variant="outlined" sx={{ m: 0.3, p: 0.5 }}>
                {dockerContainerLoaderIcon} Symbol Server Container: {dockerContainerStatus}
              </Card>
            </Grid2>
          </Grid2>
        </Box>
      </Container>
    </>
  )
}
