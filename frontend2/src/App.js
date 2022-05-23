import "./App.css";

import { useEffect, useState } from "react";

function App() {
  const [accounts, setAccounts] = useState(0);
  const { ethereum } = window;

  const isMetaMaskConnected = () => accounts && accounts.length > 0;

  const onClickConnect = async () => {
    console.log("Called onclickconnect");
    try {
      const newAccounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      handleNewAccounts(newAccounts);
    } catch (error) {
      console.error(error);
    }
  };

  const checkConnection = async () => {
    try {
      const newAccounts = await ethereum.request({
        method: "eth_accounts",
      });
      console.log(newAccounts);
    } catch (err) {
      console.error("Error on init when getting accounts", err);
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
  useEffect(() => {
    checkConnection();
  }, []);

  //TODO: set initial state of accounts if Metamask is connected

  return (
    <div className="App">
      <header className="App-header">
        <h2>{accounts}</h2>
        <a onClick={onClickConnect}>Connect</a>
      </header>
    </div>
  );
}

export default App;
