import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import TetherToken from '../build/Tether_Token.json';
import DummyToken from '../build/Dummy_Token.json';
import StakingDapp from '../build/Staking_Dapp.json';
import { Component } from 'react';

class App extends Component{

  async componentWillMount(){
    
    await this.loadweb3()
    await this.loadBlockchainData()

  }

  async loadBlockchainData(){
    
    const web3 = window.web3
    
    const accounts = await web3.eth.getAccounts()
    this.setState({accounts : accounts[0]})
    
    const networkId = await web3.eth.net.getId()
    
    const TetherTokenData = TetherToken.networks[networkId]

    if(TetherTokenData){

      const tetherToken = new web3.eth.Contract(TetherToken.abi, TetherTokenData.address)
      this.setState({tetherToken})
      let tethertokenbalance = await tetherToken.methods.balance(this.state.account).call()
      this.setState({tethertokenbalance : tethertokenbalance.toString()})

    }

    const DummyTokenData = DummyToken.networks[networkId]

    if(DummyTokenData){

      const dummyToken = new web3.eth.Contract(DummyToken.abi, DummyTokenData.address)
      this.setState({dummyToken})
      let dummytokenbalance = await dummyToken.methods.balance(this.state.account).call()
      this.setState({dummytokenbalance : dummytokenbalance.toString()})

    }

    const StakingDappData = StakingDapp.networks[networkId]

    if(StakingDappData){

      const stakingdapp = new web3.eth.Contract(StakingDapp.abi, StakingDappData.address)
      this.setState({stakingdapp})
      let stakingdappbalance = await stakingdapp.methods.stakingBalance(this.state.account).call()
      this.setState({stakingdappbalance : stakingdappbalance.toString()})

    }

  }
  
  // connect web3, metamask to dapp
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  stakeTokens = (amount) =>{
    this.setState({loading: true})
    this.state.tetherToken.methods.approve(this.state.stakingdapp.address, amount).send({from: this.state.account}).on('transactionHash', (hash) => {
      this.state.stakingdapp.methods.stakeTokens(amount).send({from:this.state.account}).on('transactionHash', (hash) => {
        this.setState({loading: false})
      })
    })
  }

  unstakeTokens = (amount) =>{
    this.setState({loading: true})
    this.state.tetherToken.methods.approve(this.state.stakingdapp.address, amount).send({from: this.state.account}).on('transactionHash', (hash) => {
      this.setState({loading: false})
    })
  }

  constructor(props){
    super(props)
    this.state = {
      account: '0x0',
      tetherToken: {},
      dummyToken: {},
      stakingdapp: {},
      tethertokenbalance: '0',
      dummytokenbalance: '0',
      stakingdappbalance: '0',
      loading: true
    }
  }

  render(){

    let content 
    if(this.state.loading){
      content = <p id='loader' className="text-center">Loading...</p>
    } else{
      content = <Main 
        tethertokenbalance = {this.state.tethertokenbalance}
        dummytokenbalance = {this.state.dummytokenbalance}
        stakingdappbalance = {this.state.stakingdappbalance}
        stakeTokens = {this.stakeTokens}
        unstakeTokens = {this.unstakeTokens}
      />
    }
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className = "container-fluid mt-5">
          <div className = "row">
            
          </div>
        </div>
      </div>
    )
  }

}

function App2() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App2;
