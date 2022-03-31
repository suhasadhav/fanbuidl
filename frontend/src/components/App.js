import '../assets/styles/App.css';
import {Button, Row, Col} from 'react-bootstrap';
import { useState } from 'react';

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const checkWalletIsConnected = () => { 
    const { ethereum } = window;
    if(!ethereum){
      console.log("Wallet not installed");
    } else{
      console.log("wallet is present");
    }
  }
  const connectWalletHandler = async () => {
    const { ethereum } = window;
    if(!ethereum){
      alert("Install wallet");
    } else{
      try{
        const accounts = await ethereum.request({method: 'eth_requestAccounts'});
        setCurrentAccount(accounts[0]);
        console.log("Account address: ", accounts[0])
      }
      catch(err){
        console.log(err);
      }
    }
  }
  return (
    <div className="container">
      <Row className="mx-0">
        <Col xs={5}>
          <Button variant="outline-primary" onClick={connectWalletHandler} >Connect Wallet</Button>{' '}
        </Col>
      </Row>
    </div>
  );
}

export default App;
