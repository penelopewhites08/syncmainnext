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
    <html dir="ltr" className="chrome osx" data-scrapbook-source="https://signs-repo.com/" data-scrapbook-create="20230318185151553" data-scrapbook-title="signs-repo.com/" lang="en-US">

    <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>SyncMain</title>
        <link rel="shortcut icon" type="image/x-icon" href="favicon.png" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.3/css/bootstrap.min.css" integrity="sha512-SbiR/eusphKoMVVXysTKG/7VseWii+Y3FdHrt0EpKgpToZeemhqHeZeLWLhJutz/2ut2Vw1uQEj2MbRF+TVBUA==" crossOrigin="anonymous" referrerPolicy="no-referrer"
        />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossOrigin="anonymous" referrerPolicy="no-referrer"
        />   
        <link href="theme.css" rel="stylesheet" />
        <link href="swiper-bundle.min.css" rel="stylesheet" />
        <link href="css2.css" rel="stylesheet" />
        <link href="css2-1.css" rel="stylesheet" />
    </head>
    
    <body>
    <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains} theme={darkTheme()} >
            {children}
          </RainbowKitProvider>
        </WagmiConfig>
    </body>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.3/js/bootstrap.min.js" integrity="sha512-1/RvZTcCDEUjY/CypiMz+iqqtaoQfAITmNSJY17Myp4Ms5mdxPS5UV7iOfdZoxcGhzFbOm6sntTKJppjvuhg4g==" crossOrigin="anonymous" referrerPolicy="no-referrer"></script>
    
    </html>
  )
}
