import {
  Autocomplete,
  Button,
  FormControl,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import i18n from '../i18n/configs'
import symbolLogo from './symbol_logo.png'

export const Main = (): JSX.Element => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [lang, setLang] = useState('ja')
  const [profileSelectOptions, setProfileSelectOptions] = useState<
    { id: number; network: string; label: string; hint: string }[]
  >([])

  /** 言語選択 */
  const handleChangeLang = (event: SelectChangeEvent) => {
    const language = event.target.value as string
    setLang(language)
    i18n.changeLanguage(language)
  }

  const aaa = () => {
    navigate('/configurator')
  }

  return (
    <>
      <FormControl sx={{ m: 1, mb: 7, minWidth: 120 }} size="small">
        <InputLabel id="lang-select-label">{t('言語')}</InputLabel>
        <Select
          labelId="lang-select-label"
          id="lang-select"
          value={lang}
          label="Lang"
          onChange={handleChangeLang}
        >
          <MenuItem value={'ja'}>日本語</MenuItem>
          <MenuItem value={'en'}>English</MenuItem>
        </Select>
      </FormControl>

      <div className="App">
        <img src={symbolLogo} alt="Symbol Logo" width={150} />

        <Grid2 container sx={{ mt: 9 }}>
          {/*  */}
          <Grid2 size={4}></Grid2>
          <Grid2 size={3.3}>
            <Autocomplete
              disablePortal
              options={profileSelectOptions}
              size="small"
              fullWidth
              renderInput={(params) => <TextField {...params} label={t('プロファイル')} />}
            />
          </Grid2>
          <Grid2 size={0.7} sx={{ pt: 0.2 }}>
            <Button variant="contained" color="primary">
              {t('編集')}
            </Button>
          </Grid2>
          <Grid2 size={4}></Grid2>
          {/*  */}
          <Grid2 size={12} sx={{ my: 3 }}></Grid2>
          {/*  */}
          <Grid2 size={4.5}></Grid2>
          <Grid2 size={3}>
            <Button variant="contained" color="primary" fullWidth>
              {t('メインネット ノード設定')}
            </Button>
          </Grid2>
          <Grid2 size={4.5}></Grid2>
          {/*  */}
          <Grid2 size={12} sx={{ my: 1 }}></Grid2>
          {/*  */}
          <Grid2 size={4.5}></Grid2>
          <Grid2 size={3}>
            <Button variant="contained" color="secondary" fullWidth>
              {t('テストネット ノード設定')}
            </Button>
          </Grid2>
          <Grid2 size={4.5}></Grid2>
          {/*  */}
          <Grid2 size={12} sx={{ my: 1 }}></Grid2>
          {/*  */}
          <Grid2 size={4.5}></Grid2>
          <Grid2 size={3}>
            <Button variant="contained" color="info" fullWidth onClick={aaa}>
              {t('プライベートチェーン作成')}
            </Button>
          </Grid2>
          <Grid2 size={4.5}></Grid2>
        </Grid2>
      </div>
    </>
  )
}
