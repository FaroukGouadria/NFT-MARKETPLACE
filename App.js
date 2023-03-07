import React, {useEffect, useState, useRef} from 'react';
import {
  Button,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import BackgroundTimer from 'react-native-background-timer';
import MetaMaskSDK from '@metamask/sdk';
import {WebView} from 'react-native-webview';
import {ethers} from 'ethers';

const sdk = new MetaMaskSDK({
  openDeeplink: link => {
    Linking.openURL(link);
  },
  timer: BackgroundTimer,
  dappMetadata: {
    name: 'React Native Dapp',
    url: 'Duetodata NFT',
  },
});

const ethereum = sdk.getProvider();

const provider = new ethers.providers.Web3Provider(ethereum);

const App = () => {
  const [response, setResponse] = useState();
  const [account, setAccount] = useState();
  const [chain, setChain] = useState();
  const [balance, setBalance] = useState();
  const [ether, setEther] = useState();
  const webViewRef = useRef(null);

  useEffect(() => {
    //console.log('provider', provider);
    setEther(provider);
  }, [provider]);

  const textStyle = {
    color: Colors.darker,
    margin: 10,
    fontSize: 16,
  };

  const getBalance = async () => {
    if (!ethereum.selectedAddress) {
      return;
    }
    const bal = await provider.getBalance(ethereum.selectedAddress);
    setBalance(ethers.utils.formatEther(bal));
  };

  const getProviderDetails = async () => {
    const providerDetails = await provider.then(() => {
      console.log('providerDetails', providerDetails);
      const script = `window.ethereum = ${JSON.stringify(providerDetails)};`;
      webViewRef.current.injectJavaScript(script);
    });

    /*     setEther(
      `window.ethereum = ${JSON.stringify({
        chainId: parseInt(chain, 16),
        name: 'Ether Injection',
      })}`,
    ); */
    //setEther(`window.ethereum = ${JSON.stringify(providerDetails)}`);
  };

  useEffect(() => {
    ethereum.on('chainChanged', chain => {
      console.log('CHAIN', chain);

      setChain(chain);
    });
    ethereum.on('connect', connectInfo => {
      console.log('CONNECT INFO', connectInfo);
      const runScript = `
          window.ethereum = new Proxy(window.ethereum, {
            get: (target, name) => {
              if (name === 'selectedAddress') {
                return '${ethereum.selectedAddress}';
              }
              return target[name];
            },
          });
        `;

      webViewRef.current.injectJavaScript(runScript);
      //getProviderDetails();
    });
    ethereum.on('accountsChanged', accounts => {
      console.log('ACCOUNTS', accounts);
      setAccount(accounts?.[0]);

      getBalance();
    });
  }, []);

  const connect = async () => {
    try {
      const result = await ethereum.request({method: 'eth_requestAccounts'});
      console.log('RESULT Connect Account', result?.[0]);
      setAccount(result?.[0]);
      getBalance();
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  const exampleRequest = async () => {
    try {
      const result = await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x13881',
            chainName: 'Mumbai Testnet',
            blockExplorerUrls: ['https://polygonscan.com'],
            nativeCurrency: {symbol: 'MATIC', decimals: 18},
            rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
          },
        ],
      });
      console.log('RESULT', result);
      setResponse(result);
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  const sign = async () => {
    const msgParams = JSON.stringify({
      domain: {
        // Defining the chain aka Rinkeby testnet or Ethereum Main Net
        chainId: parseInt(ethereum.chainId, 16),
        // Give a user friendly name to the specific contract you are signing for.
        name: 'Ether Mail',
        // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        // Just let's you know the latest version. Definitely make sure the field name is correct.
        version: '1',
      },

      // Defining the message signing data content.
      message: {
        /*
         - Anything you want. Just a JSON Blob that encodes the data you want to send
         - No required fields
         - This is DApp Specific
         - Be as explicit as possible when building out the message schema.
        */
        contents: 'Hello, Bob!',
        attachedMoneyInEth: 4.2,
        from: {
          name: 'Cow',
          wallets: [
            '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
            '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
          ],
        },
        to: [
          {
            name: 'Bob',
            wallets: [
              '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
              '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
              '0xB0B0b0b0b0b0B000000000000000000000000000',
            ],
          },
        ],
      },
      // Refers to the keys of the *types* object below.
      primaryType: 'Mail',
      types: {
        // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
        EIP712Domain: [
          {name: 'name', type: 'string'},
          {name: 'version', type: 'string'},
          {name: 'chainId', type: 'uint256'},
          {name: 'verifyingContract', type: 'address'},
        ],
        // Not an EIP712Domain definition
        Group: [
          {name: 'name', type: 'string'},
          {name: 'members', type: 'Person[]'},
        ],
        // Refer to PrimaryType
        Mail: [
          {name: 'from', type: 'Person'},
          {name: 'to', type: 'Person[]'},
          {name: 'contents', type: 'string'},
        ],
        // Not an EIP712Domain definition
        Person: [
          {name: 'name', type: 'string'},
          {name: 'wallets', type: 'address[]'},
        ],
      },
    });

    var from = ethereum.selectedAddress;

    var params = [from, msgParams];
    var method = 'eth_signTypedData_v4';

    const resp = await ethereum.request({method, params});
    setResponse(resp);
  };

  const sendTransaction = async () => {
    const to = '0x0000000000000000000000000000000000000000';
    const transactionParameters = {
      to, // Required except during contract publications.
      from: ethereum.selectedAddress, // must match user's active address.
      value: '0x5AF3107A4000', // Only required to send ether to the recipient from the initiating external account.
    };

    try {
      // txHash is a hex string
      // As with any RPC call, it may throw an error
      const txHash = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      setResponse(txHash);
    } catch (e) {
      console.log(e);
    }
  };
  const onMessage = message => {
    console.log('NEW MESSAGE', message);
    console.log('NEW MESSAGE', message.nativeEvent.data);
    const action = JSON.parse(message.nativeEvent.data);
    console.log('NEW MESSAGE', action);
    if (action.method === 'openLink') {
    } else if (action.method === 'accountsChanged') {
    } else if (action.method === 'chainChanged') {
    }
  };

  return ethereum !== undefined ? (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Button title={account ? 'Connected' : 'Connect'} onPress={connect} />
        <Button title="Sign" onPress={sign} />
        <Button title="Send transaction" onPress={sendTransaction} />
        <Button title="Add chain Mumbai" onPress={exampleRequest} />

        <Text style={textStyle}>{chain && `Connected chain: ${chain}`}</Text>
        <Text style={textStyle}>
          {account && `Connected account: ${account}\n\n`}
          {account && balance && `Balance: ${balance} ETH`}
        </Text>
        <Text style={textStyle}>
          {response && `Last request response: ${response}`}
        </Text>
        <WebView
          ref={webViewRef}
          startInLoadingState={true}
          style={{height: 600, backgroundColor: 'black'}}
          originWhitelist={['*']}
          source={{uri: 'http:192.168.130.128:3000'}}
          onLoad={() => {
            // console.log('PROVIDER', ether._metamask);
            const script = `window.ethereum = ${ethereum._metamask}`;
            const runScript = `
  window.ethereum = new Proxy(window.ethereum)
`;
            /*   const Script = `
            window.ethereum = new Proxy(window.ethereum, {
              get: (target, name) => {
                if (name === 'selectedAddress') {
                  return '${selectedAddress}';
                }
                return target[name];
              },
            });
          `; */
            //webViewRef.current.injectJavaScript(runScript);
          }}
          onLoadStart={e => {
            //alreadyInjected = false;
            //console.log('Injected Ether onLoadStart', ether);
            console.log('load start');
          }}
          onLoadProgress={e => {
            console.log('progress:', e.nativeEvent.progress);
            //console.log('Injected Ether onLoadProgress', ether);
          }}
          javaScriptEnabledAndroid={true}
          //injectedJavaScript={runScript}
          onMessage={onMessage}
        />
      </ScrollView>
    </SafeAreaView>
  ) : null;
};

export default App;
