import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { Box, Card, CircularProgress, Container, Grid2 } from '@mui/material'
import { load } from 'js-yaml'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useToggle } from 'react-use'
const childProcess = window.require('child_process')
const fs = window.require('fs')
const path = window.require('path')

type DockerCompose = {
  services: {
    server: {
      image: string
    }
  }
}

export const Loader = (): JSX.Element => {
  const { t } = useTranslation()

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
    const dockerVerExec = childProcess.exec('docker -v')
    dockerVerExec.stdout.on('data', (data: string) => {
      const ver = data.toString().match(/^Docker version ((\d+.?)+),/)
      if (!ver) {
        setDockerVer(t('インストールされていません。'))
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
    })
    dockerVerExec.stderr.on('data', (data: string) => {
      setDockerVer(t('インストールされていません。'))
      setDockerLoaderIcon(loadFailureIcon)
      setIsDocker(false)
    })
    // Docker Compose
    const dockerComposeVerExec = childProcess.exec('docker compose version')
    dockerComposeVerExec.stdout.on('data', (data: string) => {
      const ver = data.match(/^Docker Compose version v((\d+.?)+)-/)
      if (!ver) {
        setDockerComposeVer(t('インストールされていません。'))
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
    })
    dockerComposeVerExec.stderr.on('data', (data: string) => {
      setDockerComposeVer(t('インストールされていません。'))
      setDockerComposeLoaderIcon(loadFailureIcon)
      setIsDocker(false)
    })
    // Docker Image
    const dockerImageExec = childProcess.exec(
      'docker image ls --format json symbolplatform/symbol-server',
    )
    dockerImageExec.stdout.on('data', (data: string) => {
      const ver = JSON.parse(data).Tag
      setDockerImageVer(ver)
      setDockerImageLoaderIcon(loadingCompleteIcon)
      setIsDockerImage(true)
    })
    if (!isDockerImage) {
      setDockerImageVer(t('ダウンロード中'))
      const dockerComposeYamlPath = path.join(path.resolve(), '/public/docker-compose.yml')
      const dockerComposeYaml = load(
        fs.readFileSync(dockerComposeYamlPath, 'utf-8'),
      ) as DockerCompose
      const imageName = dockerComposeYaml.services.server.image
      const dockerPullExec = childProcess.exec(`docker pull -q ${imageName}`)
      dockerPullExec.stdout.on('data', (data: string) => {
        try {
          const stdout = childProcess.execSync(
            'docker image ls --format json symbolplatform/symbol-server',
          )
          const ver = JSON.parse(stdout.toString()).Tag
          setDockerImageVer(ver)
          setDockerImageLoaderIcon(loadingCompleteIcon)
          setIsDockerImage(true)
        } catch {
          setDockerImageVer(t('ダウンロードに失敗しました'))
        }
      })
      dockerPullExec.stderr.on('data', (_data: string) => {
        setDockerImageVer(t('ダウンロードに失敗しました'))
      })
    }
  }, [])

  useEffect(() => {
    if (!isDocker) return
    if (!isDockerImage) return

    const dockerComposeExec = childProcess.exec(
      'docker compose -f public/docker-compose.yml --progress json up -d',
    )
    dockerComposeExec.stderr.on('data', (data: string) => {
      const status = JSON.parse(data).status
      setDockerContainerStatus(status)
      if (status === 'Running' || status === 'Started') {
        setDockerContainerLoaderIcon(loadingCompleteIcon)
      }
    })
  }, [isDockerImage])

  return (
    <>
      <Container maxWidth="sm">
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
