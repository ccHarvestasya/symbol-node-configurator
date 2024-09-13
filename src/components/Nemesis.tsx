import DeleteIcon from '@mui/icons-material/Delete'
import {
  Grid2,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  TextField,
  Typography,
} from '@mui/material'

export const Nemesis = (): JSX.Element => {
  return (
    <>
      <Grid2 container spacing={2}>
        <Grid2 size={12}>
          <Typography variant="h4" color="primary">
            nemesis
          </Typography>
        </Grid2>

        <Grid2 size={12}>
          <Typography variant="h6">networkIdentifier</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            ネットワークを識別するための値。アドレスの先頭文字が決まる。
          </Typography>
          <TextField
            id="networkIdentifier"
            variant="outlined"
            size="small"
            type="number"
            sx={{ width: 120 }}
          />
        </Grid2>

        <Grid2 size={12}>
          <Typography variant="h6">nemesisGenerationHashSeed</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            ネメシス(ジェネシス)ブロック生成ハッシュシード。ネットワーク毎にユニークな値。
          </Typography>
          <TextField
            id="nemesisGenerationHashSeed"
            variant="outlined"
            size="small"
            type="text"
            sx={{ width: 800 }}
          />
        </Grid2>

        <Grid2 size={12}>
          <Typography variant="h6">nemesisSignerPrivateKey</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            ネメシス(ジェネシス)ブロックに署名するアカウントの秘密鍵。このページで設定するネームスペース、モザイクの所有者。
          </Typography>
          <TextField
            id="nemesisSignerPrivateKey"
            variant="outlined"
            size="small"
            type="text"
            sx={{ width: 800 }}
          />
        </Grid2>

        <Grid2 size={12}>
          <Typography variant="h4" color="primary">
            cpp
          </Typography>
        </Grid2>

        <Grid2 size={12}>
          <Typography variant="h6">cppFileHeader</Typography>
          <Typography variant="subtitle2" color="textSecondary"></Typography>
          <TextField
            id="cppFileHeader"
            variant="outlined"
            size="small"
            type="text"
            sx={{ width: 800 }}
          />
        </Grid2>

        <Grid2 size={12}>
          <Typography variant="h4" color="primary">
            output
          </Typography>
        </Grid2>

        <Grid2 size={12}>
          <Typography variant="h6">cppFile</Typography>
          <Typography variant="subtitle2" color="textSecondary"></Typography>
          <TextField id="cppFile" variant="outlined" size="small" type="text" sx={{ width: 800 }} />
        </Grid2>

        <Grid2 size={12}>
          <Typography variant="h6">binDirectory</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            ネメシス(ジェネシス)ブロック保存ディレクトリ。作業ディレクトリからの相対パス。
          </Typography>
          <TextField
            id="binDirectory"
            variant="outlined"
            size="small"
            type="text"
            sx={{ width: 800 }}
          />
        </Grid2>

        {/* ネームスペースとモザイク */}
        <Grid2 size={12}>
          <Typography variant="h4" color="primary">
            namespaces & mosaic
          </Typography>
        </Grid2>

        <Grid2 size={12}>
          <Typography variant="subtitle2" color="textSecondary">
            無期限のネームスペースとモザイクを作成。ネームスペースは３階層まで作成可能。
          </Typography>
          <List
            sx={{ width: '800px', bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <>
                <ListSubheader component="div" id="nested-list-subheader">
                  NameSpace & Mosaic
                  <IconButton edge="end" aria-label="delete" style={{ float: 'right' }}>
                    <DeleteIcon />
                  </IconButton>
                </ListSubheader>
              </>
            }
          >
            <ListItemButton sx={{ height: 30 }}>
              <ListItemText primary="symbol" />
            </ListItemButton>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4, height: 45 }}>
                <ListItemText
                  primary="xym"
                  secondary="supply: 7,842,928,625.000000 / Transferable"
                />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4, height: 30 }}>
                <ListItemText primary="volt" />
              </ListItemButton>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 8, height: 30 }}>
                  <ListItemText
                    primary="xol"
                    secondary="supply: 8,999,999,999.000000 / Transferable / SupplyMutable / Restrictable / Revokable"
                  />
                </ListItemButton>
              </List>
            </List>
            <ListItemButton sx={{ height: 30 }}>
              <ListItemText primary="nem" />
            </ListItemButton>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4, height: 30 }}>
                <ListItemText
                  primary="xem"
                  secondary="supply: 8,999,999,999.000000 / Transferable"
                />
              </ListItemButton>
            </List>
          </List>
        </Grid2>

        <Grid2 size={12}>
          <Typography variant="h4" color="primary">
            transactions
          </Typography>
        </Grid2>

        <Grid2 size={12}>
          <Typography variant="h6">transactionsDirectory</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            トランザクション保存ディレクトリ。作業ディレクトリからの相対パス。
          </Typography>
          <TextField
            id="transactionsDirectory"
            variant="outlined"
            size="small"
            type="text"
            sx={{ width: 800 }}
          />
        </Grid2>
      </Grid2>
    </>
  )
}
