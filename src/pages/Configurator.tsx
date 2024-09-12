import { useEffect, useState } from 'react'
const childProcess = window.require('child_process')

export const Configurator = (): JSX.Element => {
  const [address, setAddress] = useState('')
  useEffect(() => {
    const stdout = childProcess.execSync(
      'docker exec -i symbol-server /usr/catapult/bin/catapult.tools.addressgen -f csv -c 1',
    )
    // setAddress(stdout.toString().split('\n')[7])
    setAddress(stdout.toString())
    console.log(stdout.toString())
  }, [])
  return <>{address}</>
}
