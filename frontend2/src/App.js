import { useEffect, useState } from "react";

//Custom Import
import "./App.css";
import WalletConnect from "./components/WalletConnect";
import Dashboard from "./components/Dashboard";
function App() {
  const [accounts, setAccounts] = useState([]);
  const { ethereum } = window;

  const isMetaMaskConnected = () => accounts && accounts.length > 0;
  const isMetaMaskInstalled = () => Boolean(ethereum && ethereum.isMetaMask);

  const onClickConnect = async () => {
    if (isMetaMaskInstalled()) {
      console.log("Called onclickconnect");
      try {
        const newAccounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log(newAccounts);
        handleNewAccounts(newAccounts);
      } catch (error) {
        if (error.code === 4001) {
          console.log("Please connect to MetaMask.");
        } else {
          console.error(error);
        }
      }
    } else {
      alert("Please install Metamask wallet");
    }
  };

  function handleNewAccounts(newAccounts) {
    console.log("Handling new accounts: " + newAccounts);
    setAccounts(newAccounts);
    if (isMetaMaskConnected()) {
      //initializeAccountButtons();
    }
    //updateButtons();
  }

  async function getNetworkAndChainId() {
    try {
      const chainId = await ethereum.request({
        method: "eth_chainId",
      });
      const networkId = await ethereum.request({
        method: "net_version",
      });
      console.log("ChainId: " + chainId);
      console.log("networkId: " + networkId);
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    async function checkConnection() {
      try {
        await ethereum
          .request({
            method: "eth_accounts",
          })
          .then((res) => {
            setAccounts(res);
          });
      } catch (err) {
        console.error("Error on init when getting accounts", err);
      }
    }

    // If metamask is installed
    if (Boolean(ethereum && ethereum.isMetaMask)) {
      ethereum.autoRefreshOnNetworkChange = true;

      //getNetworkAndChainId();
      //ethereum.on("chainChanged", handleNewChain);
      //ethereum.on("networkChanged", handleNewNetwork);
      ethereum.on("accountsChanged", function (newAccounts) {
        console.log("Account changed: " + newAccounts);
        setAccounts(newAccounts);
      });
      checkConnection();
    }
  }, [ethereum]);

  return (
    <div className="App">
      {!isMetaMaskConnected() && <WalletConnect onClick={onClickConnect} />}
      {isMetaMaskConnected() && <Dashboard accounts={accounts} />}
    </div>
  );
}

export default App;
