"use client"
import { useEffect, useState } from 'react'
import styles from './page.module.css'
import { checkIfSukuWalletIsInstalled, connectWithSukuWallet, openInstalationPage } from 'suku-connect-button'
import Provider from '@walletconnect/ethereum-provider'

export default function Home() {
  const [installed, setInstalled] = useState(false)
  const [connected, setConnected] = useState(false)
  const [userAddress, setUserAddress] = useState('')
  const [chain, setChain] = useState(0)

  const redirect = async () => {
    openInstalationPage()
  }

  const onClick = async () => {
    const sukuProvider = await Provider.init({
      projectId: 'eebf7eb6eaef98191d4e3fae949c81de', // REQUIRED your projectId
      chains: [1], // REQUIRED chain ids
      showQrModal: false, // REQUIRED set to "true" to use @walletconnect/modal
      methods: ['eth_signTypedData', 'eth_signTypedData_v4', 'eth_sign'], // REQUIRED ethereum methods
      events: ['display_uri'], // REQUIRED ethereum events
    })

    sukuProvider.on('connect', (payload) => {
      console.log(payload)
      setConnected(true)
      setUserAddress(sukuProvider.accounts[0])
      setChain(sukuProvider.chainId)
    })

    await connectWithSukuWallet(sukuProvider)
    console.debug(sukuProvider)

    if (!sukuProvider) return
  }

  useEffect(() => {
    const checkInstalled = async () => {
      const installed = await checkIfSukuWalletIsInstalled()
      setInstalled(installed)
    }

    checkInstalled()
  }, [])

  return (
    <main className={styles.main}>
      <h1>Information</h1>
      <div>
        <h2>Is Installed: {installed ? 'yes' : 'no'}</h2>
        <h2>Is Connected: {connected ? 'yes' : 'no'}</h2>
        {
          connected && (
            <>
              <h2>User Address: {userAddress}</h2>
              <h2>Chain Id: {chain}</h2>
            </>
          )
        }
      </div>
      <button onClick={onClick} className={styles.sukuButton}>Suku Connect</button>
      <button onClick={redirect} className={styles.sukuButton}>Open Instalation Page</button>
    </main>
  )
}
