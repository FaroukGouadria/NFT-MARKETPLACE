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
import Web3 from 'web3';

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
  const [web3JsContent, setWeb3jsContent] = useState({})
  const [ethersJsContent, setWEthersJsContent] = useState({})
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
    // ethereum.on('chainChanged', chain => {
    //   console.log('CHAIN', chain);

    //   setChain(chain);
    // });
    // ethereum.on('connect', connectInfo => {
    //   console.log('CONNECT INFO', connectInfo);
    //   console.log('INFO', ethereum);
    //   if (webViewRef && webViewRef.current) {
    //     console.log(webViewRef.current.props);
    //     webViewRef.current.injectJavaScript(`
    //     window.alert(${JSON.stringify(account)})
    //       if (window.ethereum) {
    //         console.log(${ethereum})
    //         window.ethereum = new Proxy(window.ethereum, {
    //           get: (target, name) => {
    //             if (name === 'selectedAddress') {
    //               console.log(${ethereum.selectedAddress})
    //               return '${ethereum.selectedAddress}';
    //             }
    //             return target[name];
    //           },
            
    //       });true;
    //       }else {
    //         console.log('MetaMask not found');
    //       }
    //       `);
    //   }
    //   webViewRef.current.injectJavaScript(`
    //   window.alert(${JSON.stringify(account)})
    //     if (window.ethereum) {
    //       console.log(${ethereum})
    //       window.ethereum = new Proxy(window.ethereum, {
    //         get: (target, name) => {
    //           if (name === 'selectedAddress') {
    //             console.log(${ethereum.selectedAddress})
    //             return '${ethereum.selectedAddress}';
    //           }
    //           return target[name];
    //         },
          
    //     });true;
    //     }else {
    //       console.log('MetaMask not found');
    //     }
    //     `);
    // });
    // //getProviderDetails();
    // ethereum.on('accountsChanged', accounts => {
    //   console.log('ACCOUNTS', accounts);
    //   setAccount(accounts?.[0]);
    //   getBalance();
    // });
    const connectmeta = async()=>{

      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          console.log('MetaMask is connected!');
      
          // Get the wallet address
          const accounts = await web3.eth.getAccounts();
          const address = accounts[0];
          console.log(`Wallet address: ${address}`);
      
          // Get the wallet balance
          const balance = await web3.eth.getBalance(address);
          console.log(`Wallet balance: ${balance}`);
      
          // Set the response to web3JsContent
          setWEthersJsContent({
            address,
            balance: balance.toString(),
          });
      
          // Set the response to ethersJsContent
          setWeb3jsContent({
            address,
            balance,
          });
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log('Please install MetaMask!');
      }
    }
    connectmeta()
  }, []);

  const handleWebViewMessage = (event) => {
    console.log('Received message:', event.nativeEvent);
    const {type, data} = JSON.parse(event.nativeEvent.data);
    if (type === 'SELECTED_ADDRESS') {
      console.log('Selected Ethereum address:', data);
    }
  };
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
  // const onMessage = (message) => {
  //   if (message && message.nativeEvent) {
  //     console.log('Received message:', message.nativeEvent);
  //   console.log('NEW MESSAGE', message);
  //   console.log('NEW MESSAGE', message.nativeEvent.data);
  //   const action = JSON.parse(message.nativeEvent.data);
  //   console.log('NEW MESSAGE', action);
  //   if (action.method === 'openLink') {
  //   } else if (action.method === 'accountsChanged') {
  //   } else if (action.method === 'chainChanged') {
  //   }
  //   }
  // };

  const runFirst = `
  window.alert(${JSON.stringify(account)});
  if (window.ethereum) {
    window.ethereum = new Proxy(window.ethereum, {
      get: (target, name) => {
        if (name === 'selectedAddress') {
          console.log(${ethereum.selectedAddress})
          return '${ethereum.selectedAddress}';
        }
        return target[name];
      },
    
  });true;
  }else {
    console.log('MetaMask not found');
  }
  
true; // note: this is required, or you'll sometimes get silent failures
`;
getJsCode = (address) => {
  //const { navigation } = this.props;
  // const { web3JsContent, ethersJsContent } = this.state;
 
  /*     const dapp = navigation.state.params.dapp || {
    url: "",
    title: "",
    name: { en: "" },
  }; */
  console.warn('Address',address)
  //const dappName = dapp.name.en || "";
  return `
    ${web3JsContent}
    ${ethersJsContent}

      (function() {
        let resolver = {};
        let rejecter = {};

        ${
          Platform.OS === "ios" ? "window" : "document"
        }.addEventListener("message", function(data) {
          try {
            const passData = data.data ? JSON.parse(data.data) : data.data;
            const { id, result } = passData;
            if (result && result.error && rejecter[id]) {
              rejecter[id](new Error(result.message));
            } else if (resolver[id]) {
              resolver[id](result);
            }
          } catch(err) {
            console.log('listener message err: ', err);
          }
        })

        communicateWithRN = (payload) => {
          return new Promise((resolve, reject) => {
            console.log('JSON.stringify(payload): ', JSON.stringify(payload));
            window.ReactNativeWebView.postMessage(JSON.stringify(payload));
            const { id } = payload;
            resolver[id] = resolve;
            rejecter[id] = reject;
          })
        }

        function initNotification() {
          setInterval(() => {
            if (!window.Notification) {
              // Disable the web site notification
              const Notification = class {
                constructor(title, options) {
                  this.title = title;
                  this.options = options;
                }
    
                // Override close function
                close() {
                }
    
                // Override bind function
                bind(notification) {
                }
              }
    
              window.Notification = Notification;
            }
          }, 1000)
        }

        function initWeb3() {
          // Inject the web3 instance to web site
          const rskEndpoint = '${this.rskEndpoint}';
          const provider = new Web3.providers.HttpProvider(rskEndpoint);
          const web3Provider = new ethers.providers.Web3Provider(provider)
          const web3 = new Web3(provider);
          // When Dapp is "Money on Chain", webview uses Web3's Provider, others uses Ethers' Provider
          window.ethereum =  web3Provider;
          window.ethereum.selectedAddress = '${address}';
          window.address = '${address}';
          window.ethereum.networkVersion = '${this.networkVersion}';
          window.ethereum.isRWallet = true;
          window.web3 = web3;

          // Adapt web3 old version (new web3 version move toDecimal and toBigNumber to utils class).
          window.web3.toDecimal = window.web3.utils.toDecimal;
          window.web3.toBigNumber = window.web3.utils.toBN;
          
          const config = {
            isEnabled: true,
            isUnlocked: true,
            networkVersion: '${this.networkVersion}',
            onboardingcomplete: true,
            selectedAddress: '${address}',
          }

          // Some web site using the config to check the window.ethereum is exist or not
          window.ethereum.publicConfigStore = {
            _state: {
              ...config,
            },
            getState: () => {
              return {
                ...config,
              }
            }
          }

          window.web3.setProvider(window.ethereum);

          // Override enable function can return the current address to web site
          window.ethereum.enable = () => {
            return new Promise((resolve, reject) => {
              resolve(['${address}']);
            })
          }

          // Adapt web3 old version (new web3 version remove this function)
          window.web3.version = {
            api: '1.2.7',
            getNetwork: (cb) => { cb(null, '${this.networkVersion}') },
          }

          window.ethereum.on = (method, callback) => { if (method) {console.log(method)} }

          // Adapt web3 old version (need to override the abi's method).
          // web3 < 1.0 using const contract = web3.eth.contract(abi).at(address)
          // web3 >= 1.0 using const contract = new web3.eth.Contract()
          window.web3.eth.contract = (abi) => {
            const contract = new web3.eth.Contract(abi);
            contract.at = (address) => {
              contract.options.address = address;
              return contract;
            }

            const { _jsonInterface } = contract;
            _jsonInterface.forEach((item) => {
              if (item.name && item.stateMutability) {
                const method = item.name;
                if (item.stateMutability === 'pure' || item.stateMutability === 'view') {
                  contract[method] = (params, cb) => {
                    console.log('contract method: ', method);
                    contract.methods[method](params).call({ from: '${address}' }, cb);
                  };
                } else {
                  contract[method] = (params, cb) => {
                    console.log('contract method: ', method);
                    contract.methods[method](params).send({ from: '${address}' }, cb);
                  };
                }
              }
            });

            return contract;
          }

          // Override the sendAsync function so we can listen the web site's call and do our things
          const sendAsync = async (payload, callback) => {
            let err, res = '', result = '';
            const {method, params, jsonrpc, id} = payload;
            console.log('payload: ', payload);
            try {
              if (method === 'net_version') {
                result = '${this.networkVersion}';
              } else if (method === 'eth_chainId') {
                result = web3.utils.toHex(${this.networkVersion});
              } else if (method === 'eth_requestAccounts' || method === 'eth_accounts' || payload === 'eth_accounts') {
                result = ['${address}'];
              } else {
                result = await communicateWithRN(payload);
              }

              res = {id, jsonrpc, method, result};
            } catch(err) {
              err = err;
              console.log('sendAsync err: ', err);
            }
            
            console.log('res: ', res);
            if (callback) {
              callback(err, res);
            } else {
              return res || err;
            }
          }

          // ensure window.ethereum.send and window.ethereum.sendAsync are not undefined
          setTimeout(() => {
            if (!window.ethereum.send) {
              window.ethereum.send = sendAsync;
            }
            if (!window.ethereum.sendAsync) {
              window.ethereum.sendAsync = sendAsync;
            }
            if (!window.ethereum.request) {
              window.ethereum.request = (payload) =>
                new Promise((resolve, reject) =>
                  sendAsync(payload).then(response =>
                    response.result
                      ? resolve(response.result)
                      : reject(new Error(response.message || 'provider error'))));
            }
          }, 1000)
        }

        initNotification();
        initWeb3();
      }) ();
    true
  `;
};
injectJavaScript = (address) => {
 
  const jsCode = this.getJsCode(address);
  console.log('before inject',jsCode)
  return jsCode;
};
postMessageToWebView = (result) => {
  if (this.webview && this.webview.current) {
    this.webview.current.postMessage(JSON.stringify(result));
  }
};
const onMessage = async (event) => {
  //const { addNotification } = this.props;
  const { data } = event.nativeEvent;
  const payload = JSON.parse(data);

  console.log(payload);
}
const getWebView = () => {
  //const dappUrl = this.getDappUrl();
  const dappUrl = "https://basic-sample.rlogin.identity.rifos.org";
  console.log("dappUrl", dappUrl);

  const address = "0xB428074FAf1C7c19158925B040dfE0Be3CDAceFd";
  if (address && web3JsContent && ethersJsContent) {
  return (
    <WebView
      source={{ uri: dappUrl }}
      ref={this.webview}
      javaScriptEnabled
      injectedJavaScriptBeforeContentLoaded={this.injectJavaScript(address)}
      // onNavigationStateChange={this.onNavigationStateChange}
      onMessage={()=>onMessage}
      onLoadEnd={(e) => console.warn('onLoadEnd',e.nativeEvent)}
      onLoadStart={(e) => console.warn('onLoadStart',e.nativeEvent)}
      incognito
    />
  );
     }
  //  return <ActivityIndicator style={styles.loading} size="large" />;
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
        {getWebView()}
      </ScrollView>
    </SafeAreaView>
  ) : null;
};

export default App;

