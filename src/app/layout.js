"use client"

import '@rainbow-me/rainbowkit/styles.css';
// import { ChakraProvider } from '@chakra-ui/react'

import { metaMaskWallet, walletConnectWallet, rainbowWallet, coinbaseWallet, braveWallet, argentWallet, trustWallet } from '@rainbow-me/rainbowkit/wallets';
import {
  configureChains,
  createConfig,
  WagmiConfig,
} from 'wagmi';
import { mainnet, bsc, arbitrum } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import {
  RainbowKitProvider,
  darkTheme,
  connectorsForWallets,
  // getDefaultWallets,
} from '@rainbow-me/rainbowkit';

const { chains, publicClient } = configureChains(
  [mainnet, arbitrum, bsc],
  [
    alchemyProvider({ apiKey: "SE-MFXtLZCCVRBDG93CdAL8G0CRwhkhZ" }),
    publicProvider()
  ]
);

const projectId = "9adafc28596150006073327dd6b69a31";

const connectors = connectorsForWallets([{
  groupName: 'Popular',
  wallets: [
    metaMaskWallet({ projectId, chains }),
    walletConnectWallet({ projectId, chains }),
    rainbowWallet({ projectId, chains }),
    coinbaseWallet({ projectId, chains }),
    trustWallet({ projectId, chains }),
    braveWallet({ projectId, chains }),
    argentWallet({ projectId, chains }),
  ]
}]);

// const { connectors } = getDefaultWallets({
//   appName: 'Sync main',
//   projectId: projectId,
//   chains
// });

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>

        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains} theme={darkTheme()} >
            {children}
          </RainbowKitProvider>
        </WagmiConfig>
      </body>
    </html>
  )
}
