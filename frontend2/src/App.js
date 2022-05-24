import { useEffect, useState } from "react";

//Custom Import
import "./App.css";
import WalletConnect from "./components/WalletConnect";

function App() {
  const [accounts, setAccounts] = useState([]);
  const { ethereum } = window;

  const isMetaMaskConnected = () => accounts && accounts.length > 0;

  const onClickConnect = async () => {
    console.log("Called onclickconnect");
    try {
      const newAccounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log(newAccounts);
      handleNewAccounts(newAccounts);
    } catch (error) {
      console.error(error);
    }
  };

  function handleNewAccounts(newAccounts) {
    setAccounts(newAccounts);
    console.log(accounts);
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
      <header>
        <h2>{accounts[0]}</h2>
        {!isMetaMaskConnected() && <WalletConnect onClick={onClickConnect} />}
      </header>
    </div>
  );
}

export default App;
