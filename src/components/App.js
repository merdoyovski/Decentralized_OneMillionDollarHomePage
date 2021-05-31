import React, { Component } from 'react';
import Web3 from 'web3'
import ethAds from '../abis/ethereumAds.json';
import './App.css';
import EtherContext from './EtherContext.js';
import AdGrid from './AdGrid.js';
import Header from './Header.js';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      account: null,
      contract: null,
      ad_count: 0,
    };
  }

  async componentDidMount() {
    await this.loadWeb3();
    const web3 = await window.web3;

    const contract_address = "0xb9bfC54c01d0823dCC2e21ca59546c6B465Acd85";
    const abi = ethAds.abi;

    const account = (await web3.eth.getAccounts())[0];
    const contract = await new web3.eth.Contract(abi, contract_address);
    const ad_count = await contract.methods.getBoxCount().call();
    const default_ad_src = await contract.methods.getInitialUrl().call();

    this.setState({
      account,
      contract,
      ad_count,
      default_ad_src,
    });
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert("Web3 not supported in your browser.")
    }
  }

  // TODO: Rent

  render() {
    console.log({ state: this.state, msg: "App render" });

    return (
      <EtherContext.Provider value={{
        account: this.state.account,
        contract: this.state.contract
      }}>
        <Header />
        <AdGrid ad_count={this.state.ad_count} default_ad_src={this.state.default_ad_src}/>
      </EtherContext.Provider>
    );
  }
}
