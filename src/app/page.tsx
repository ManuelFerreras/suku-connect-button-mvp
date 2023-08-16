"use client"
import { useEffect, useState } from 'react'
import styles from './page.module.css'

import { EthereumProvider } from '@walletconnect/ethereum-provider'

export default function Home() {
  const [installed, setInstalled] = useState(false)

  const onClick = async () => {
    // Check if Suku Wallet is Installed. If not, redirect to the Chrome Web Store.
    if (!installed) {
      window.open(`https://chrome.google.com/webstore/detail/suku-wallet/fopmedgnkfpebgllppeddmmochcookhc`, '_blank')
      return
    }

    // If installed, Create the Wallet Connect Session.
    const provider = await EthereumProvider.init({
      projectId: 'eebf7eb6eaef98191d4e3fae949c81de', // REQUIRED your projectId
      chains: [1], // REQUIRED chain ids
      showQrModal: false, // REQUIRED set to "true" to use @walletconnect/modal
      methods: ['eth_signTypedData', 'eth_signTypedData_v4', 'eth_sign'], // REQUIRED ethereum methods
      events: ['display_uri'], // REQUIRED ethereum events
    })

    provider.on('display_uri', (uri: string) => {
      console.debug(uri)
      window.postMessage({ type: 'createWalletConnectConnection', uri }, "*");
    })

    await provider.connect()
  }

  useEffect(() => {
    // Listen for messages from the extension.
    window.addEventListener('message', (event) => {
      if (event?.data === 'installed') {
        setInstalled(true)
      }
    })

    // Check if Suku Wallet is installed.
    window.postMessage('sukuWalletInstalled', "*");
  }, [])

  return (
    <main className={styles.main}>
      <button onClick={onClick} className={styles.sukuButton}>Suku Connect</button>
    </main>
  )
}
