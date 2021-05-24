import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import ethAds from '../abis/ethereumAds.json';

class App extends Component {

  async componentDidMount() {
    await this.loadWeb3();
    const web3 = await window.web3;

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    web3.eth.defaultAccount = this.state.account;
    
    const contract_address = "0x783a37A8E947e9D99dc484AE1410A294C93C66bA"; 
    const abi = ethAds.abi;

    await this.setState({contract: await new web3.eth.Contract(abi, contract_address)}) // Use this to call the contract

    var box_count_promise = await this.state.contract.methods.getBoxCount().call();
    const box_count = parseInt(box_count_promise._hex, 16)
    
    var c = document.getElementById("grid").children;
    var i;
    for (i = 0; i < box_count; i++) {
      const box_url = await this.state.contract.methods.getUrl(i).call();
      c[i].src = box_url;
    }
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

  async interactBox(_box_index) {
    const web3 = await window.web3;

    var pricePromise = await this.state.contract.methods.getPrice(_box_index).call();
    const price = parseInt(pricePromise._hex, 16)

    var isBoxOwned = await this.state.contract.methods.isBoxOwned(_box_index).call();
    var boxOwner = await this.state.contract.methods.getOwner(_box_index).call();

    if (isBoxOwned) {
      if (boxOwner == this.state.account) { // Owned by caller, set URL or price
        console.log("Owned by you, set URL or price");
        var newUrl = await window.prompt("Enter new image URL", ""); // update html url
        if(newUrl != null && newUrl != ""){ 
          this.setUrl(_box_index, newUrl); 
        }
        
        var newPrice = await window.prompt("Enter the new price in wei", ""); // update price in blockchain
        if(newPrice != null && newPrice != ""){ 
          this.setPrice(_box_index, newPrice); 
        }
      }
      else { // Owned by another address, read the price and offer the transaction to the caller
        console.log("Owned by another address");
        await this.state.contract.methods.buyOwnedBox(_box_index).send({ value: web3.utils.toWei(price.toString(), 'wei') });
      }
    }
    else { // No owner
      console.log("No owner, buying this");
      await this.state.contract.methods.buyEmptyBox(_box_index).send({ value: web3.utils.toWei("100", 'wei') });
    }
  }

  async setUrl(_box_index, url){
    await this.state.contract.methods.setUrl(_box_index, url).send();
    // TODO: Change the image without refreshing
  }

  async setPrice(_box_index, price){
    await this.state.contract.methods.setPrice(_box_index, price).send();
  }

  // TODO: Rent
  // TODO: Instantiate HTML boxes
  // TODO: Header
  // TODO: Info box for each box
  // TODO: Menu

  constructor(props) {
    super(props)
    this.state = {
      account: "",
      contract: ""
    }
    this.interactBox = this.interactBox.bind(this)
  }

  render() {
    return (
      <div class="grid" id="grid">
        <img name="grid0" class="grid-item" src="" onClick={() => this.interactBox(0)} alt=""></img>
        <img name="grid1" class="grid-item" src="" onClick={() => this.interactBox(1)} alt=""></img>
        <img name="grid2" class="grid-item" src="" onClick={() => this.interactBox(2)} alt=""></img>
        <img name="grid3" class="grid-item" src="" onClick={() => this.interactBox(3)} alt=""></img>
        <img name="grid4" class="grid-item" src="" onClick={() => this.interactBox(4)} alt=""></img>
        <img name="grid5" class="grid-item" src="" onClick={() => this.interactBox(5)} alt=""></img>
        <img name="grid6" class="grid-item" src="" onClick={() => this.interactBox(6)} alt=""></img>
        <img name="grid7" class="grid-item" src="" onClick={() => this.interactBox(7)} alt=""></img>
        <img name="grid8" class="grid-item" src="" onClick={() => this.interactBox(8)} alt=""></img>
        <img name="grid9" class="grid-item" src="" onClick={() => this.interactBox(9)} alt=""></img>
        <img name="grid0" class="grid-item" src="" onClick={() => this.interactBox(0)} alt=""></img>
        <img name="grid1" class="grid-item" src="" onClick={() => this.interactBox(1)} alt=""></img>
        <img name="grid2" class="grid-item" src="" onClick={() => this.interactBox(2)} alt=""></img>
        <img name="grid3" class="grid-item" src="" onClick={() => this.interactBox(3)} alt=""></img>
        <img name="grid4" class="grid-item" src="" onClick={() => this.interactBox(4)} alt=""></img>
        <img name="grid5" class="grid-item" src="" onClick={() => this.interactBox(5)} alt=""></img>
        <img name="grid6" class="grid-item" src="" onClick={() => this.interactBox(6)} alt=""></img>
        <img name="grid7" class="grid-item" src="" onClick={() => this.interactBox(7)} alt=""></img>
        <img name="grid8" class="grid-item" src="" onClick={() => this.interactBox(8)} alt=""></img>
        <img name="grid9" class="grid-item" src="" onClick={() => this.interactBox(9)} alt=""></img>
        <img name="grid0" class="grid-item" src="" onClick={() => this.interactBox(0)} alt=""></img>
        <img name="grid1" class="grid-item" src="" onClick={() => this.interactBox(1)} alt=""></img>
        <img name="grid2" class="grid-item" src="" onClick={() => this.interactBox(2)} alt=""></img>
        <img name="grid3" class="grid-item" src="" onClick={() => this.interactBox(3)} alt=""></img>
        <img name="grid4" class="grid-item" src="" onClick={() => this.interactBox(4)} alt=""></img>
        <img name="grid5" class="grid-item" src="" onClick={() => this.interactBox(5)} alt=""></img>
        <img name="grid6" class="grid-item" src="" onClick={() => this.interactBox(6)} alt=""></img>
        <img name="grid7" class="grid-item" src="" onClick={() => this.interactBox(7)} alt=""></img>
        <img name="grid8" class="grid-item" src="" onClick={() => this.interactBox(8)} alt=""></img>
        <img name="grid9" class="grid-item" src="" onClick={() => this.interactBox(9)} alt=""></img>
        <img name="grid0" class="grid-item" src="" onClick={() => this.interactBox(0)} alt=""></img>
        <img name="grid1" class="grid-item" src="" onClick={() => this.interactBox(1)} alt=""></img>
        <img name="grid2" class="grid-item" src="" onClick={() => this.interactBox(2)} alt=""></img>
        <img name="grid3" class="grid-item" src="" onClick={() => this.interactBox(3)} alt=""></img>
        <img name="grid4" class="grid-item" src="" onClick={() => this.interactBox(4)} alt=""></img>
        <img name="grid5" class="grid-item" src="" onClick={() => this.interactBox(5)} alt=""></img>
        <img name="grid6" class="grid-item" src="" onClick={() => this.interactBox(6)} alt=""></img>
        <img name="grid7" class="grid-item" src="" onClick={() => this.interactBox(7)} alt=""></img>
        <img name="grid8" class="grid-item" src="" onClick={() => this.interactBox(8)} alt=""></img>
        <img name="grid9" class="grid-item" src="" onClick={() => this.interactBox(9)} alt=""></img>
        <img name="grid0" class="grid-item" src="" onClick={() => this.interactBox(0)} alt=""></img>
        <img name="grid1" class="grid-item" src="" onClick={() => this.interactBox(1)} alt=""></img>
        <img name="grid2" class="grid-item" src="" onClick={() => this.interactBox(2)} alt=""></img>
        <img name="grid3" class="grid-item" src="" onClick={() => this.interactBox(3)} alt=""></img>
        <img name="grid4" class="grid-item" src="" onClick={() => this.interactBox(4)} alt=""></img>
        <img name="grid5" class="grid-item" src="" onClick={() => this.interactBox(5)} alt=""></img>
        <img name="grid6" class="grid-item" src="" onClick={() => this.interactBox(6)} alt=""></img>
        <img name="grid7" class="grid-item" src="" onClick={() => this.interactBox(7)} alt=""></img>
        <img name="grid8" class="grid-item" src="" onClick={() => this.interactBox(8)} alt=""></img>
        <img name="grid9" class="grid-item" src="" onClick={() => this.interactBox(9)} alt=""></img>
        <img name="grid0" class="grid-item" src="" onClick={() => this.interactBox(0)} alt=""></img>
        <img name="grid1" class="grid-item" src="" onClick={() => this.interactBox(1)} alt=""></img>
        <img name="grid2" class="grid-item" src="" onClick={() => this.interactBox(2)} alt=""></img>
        <img name="grid3" class="grid-item" src="" onClick={() => this.interactBox(3)} alt=""></img>
        <img name="grid4" class="grid-item" src="" onClick={() => this.interactBox(4)} alt=""></img>
        <img name="grid5" class="grid-item" src="" onClick={() => this.interactBox(5)} alt=""></img>
        <img name="grid6" class="grid-item" src="" onClick={() => this.interactBox(6)} alt=""></img>
        <img name="grid7" class="grid-item" src="" onClick={() => this.interactBox(7)} alt=""></img>
        <img name="grid8" class="grid-item" src="" onClick={() => this.interactBox(8)} alt=""></img>
        <img name="grid9" class="grid-item" src="" onClick={() => this.interactBox(9)} alt=""></img>
        <img name="grid0" class="grid-item" src="" onClick={() => this.interactBox(0)} alt=""></img>
        <img name="grid1" class="grid-item" src="" onClick={() => this.interactBox(1)} alt=""></img>
        <img name="grid2" class="grid-item" src="" onClick={() => this.interactBox(2)} alt=""></img>
        <img name="grid3" class="grid-item" src="" onClick={() => this.interactBox(3)} alt=""></img>
        <img name="grid4" class="grid-item" src="" onClick={() => this.interactBox(4)} alt=""></img>
        <img name="grid5" class="grid-item" src="" onClick={() => this.interactBox(5)} alt=""></img>
        <img name="grid6" class="grid-item" src="" onClick={() => this.interactBox(6)} alt=""></img>
        <img name="grid7" class="grid-item" src="" onClick={() => this.interactBox(7)} alt=""></img>
        <img name="grid8" class="grid-item" src="" onClick={() => this.interactBox(8)} alt=""></img>
        <img name="grid9" class="grid-item" src="" onClick={() => this.interactBox(9)} alt=""></img>
        <img name="grid0" class="grid-item" src="" onClick={() => this.interactBox(0)} alt=""></img>
        <img name="grid1" class="grid-item" src="" onClick={() => this.interactBox(1)} alt=""></img>
        <img name="grid2" class="grid-item" src="" onClick={() => this.interactBox(2)} alt=""></img>
        <img name="grid3" class="grid-item" src="" onClick={() => this.interactBox(3)} alt=""></img>
        <img name="grid4" class="grid-item" src="" onClick={() => this.interactBox(4)} alt=""></img>
        <img name="grid5" class="grid-item" src="" onClick={() => this.interactBox(5)} alt=""></img>
        <img name="grid6" class="grid-item" src="" onClick={() => this.interactBox(6)} alt=""></img>
        <img name="grid7" class="grid-item" src="" onClick={() => this.interactBox(7)} alt=""></img>
        <img name="grid8" class="grid-item" src="" onClick={() => this.interactBox(8)} alt=""></img>
        <img name="grid9" class="grid-item" src="" onClick={() => this.interactBox(9)} alt=""></img>
        <img name="grid0" class="grid-item" src="" onClick={() => this.interactBox(0)} alt=""></img>
        <img name="grid1" class="grid-item" src="" onClick={() => this.interactBox(1)} alt=""></img>
        <img name="grid2" class="grid-item" src="" onClick={() => this.interactBox(2)} alt=""></img>
        <img name="grid3" class="grid-item" src="" onClick={() => this.interactBox(3)} alt=""></img>
        <img name="grid4" class="grid-item" src="" onClick={() => this.interactBox(4)} alt=""></img>
        <img name="grid5" class="grid-item" src="" onClick={() => this.interactBox(5)} alt=""></img>
        <img name="grid6" class="grid-item" src="" onClick={() => this.interactBox(6)} alt=""></img>
        <img name="grid7" class="grid-item" src="" onClick={() => this.interactBox(7)} alt=""></img>
        <img name="grid8" class="grid-item" src="" onClick={() => this.interactBox(8)} alt=""></img>
        <img name="grid9" class="grid-item" src="" onClick={() => this.interactBox(9)} alt=""></img>
        <img name="grid0" class="grid-item" src="" onClick={() => this.interactBox(0)} alt=""></img>
        <img name="grid1" class="grid-item" src="" onClick={() => this.interactBox(1)} alt=""></img>
        <img name="grid2" class="grid-item" src="" onClick={() => this.interactBox(2)} alt=""></img>
        <img name="grid3" class="grid-item" src="" onClick={() => this.interactBox(3)} alt=""></img>
        <img name="grid4" class="grid-item" src="" onClick={() => this.interactBox(4)} alt=""></img>
        <img name="grid5" class="grid-item" src="" onClick={() => this.interactBox(5)} alt=""></img>
        <img name="grid6" class="grid-item" src="" onClick={() => this.interactBox(6)} alt=""></img>
        <img name="grid7" class="grid-item" src="" onClick={() => this.interactBox(7)} alt=""></img>
        <img name="grid8" class="grid-item" src="" onClick={() => this.interactBox(8)} alt=""></img>
        <img name="grid9" class="grid-item" src="" onClick={() => this.interactBox(9)} alt=""></img>  
        <img name="grid0" class="grid-item" src="" onClick={() => this.interactBox(0)} alt=""></img>
        <img name="grid1" class="grid-item" src="" onClick={() => this.interactBox(1)} alt=""></img>
        <img name="grid2" class="grid-item" src="" onClick={() => this.interactBox(2)} alt=""></img>
        <img name="grid3" class="grid-item" src="" onClick={() => this.interactBox(3)} alt=""></img>
        <img name="grid4" class="grid-item" src="" onClick={() => this.interactBox(4)} alt=""></img>
        <img name="grid5" class="grid-item" src="" onClick={() => this.interactBox(5)} alt=""></img>
        <img name="grid6" class="grid-item" src="" onClick={() => this.interactBox(6)} alt=""></img>
        <img name="grid7" class="grid-item" src="" onClick={() => this.interactBox(7)} alt=""></img>
        <img name="grid8" class="grid-item" src="" onClick={() => this.interactBox(8)} alt=""></img>
        <img name="grid9" class="grid-item" src="" onClick={() => this.interactBox(9)} alt=""></img>
        <img name="grid0" class="grid-item" src="" onClick={() => this.interactBox(0)} alt=""></img>
        <img name="grid1" class="grid-item" src="" onClick={() => this.interactBox(1)} alt=""></img>
        <img name="grid2" class="grid-item" src="" onClick={() => this.interactBox(2)} alt=""></img>
        <img name="grid3" class="grid-item" src="" onClick={() => this.interactBox(3)} alt=""></img>
        <img name="grid4" class="grid-item" src="" onClick={() => this.interactBox(4)} alt=""></img>
        <img name="grid5" class="grid-item" src="" onClick={() => this.interactBox(5)} alt=""></img>
        <img name="grid6" class="grid-item" src="" onClick={() => this.interactBox(6)} alt=""></img>
        <img name="grid7" class="grid-item" src="" onClick={() => this.interactBox(7)} alt=""></img>
        <img name="grid8" class="grid-item" src="" onClick={() => this.interactBox(8)} alt=""></img>
        <img name="grid9" class="grid-item" src="" onClick={() => this.interactBox(9)} alt=""></img>
        <img name="grid0" class="grid-item" src="" onClick={() => this.interactBox(0)} alt=""></img>
        <img name="grid1" class="grid-item" src="" onClick={() => this.interactBox(1)} alt=""></img>
        <img name="grid2" class="grid-item" src="" onClick={() => this.interactBox(2)} alt=""></img>
        <img name="grid3" class="grid-item" src="" onClick={() => this.interactBox(3)} alt=""></img>
        <img name="grid4" class="grid-item" src="" onClick={() => this.interactBox(4)} alt=""></img>
        <img name="grid5" class="grid-item" src="" onClick={() => this.interactBox(5)} alt=""></img>
        <img name="grid6" class="grid-item" src="" onClick={() => this.interactBox(6)} alt=""></img>
        <img name="grid7" class="grid-item" src="" onClick={() => this.interactBox(7)} alt=""></img>
        <img name="grid8" class="grid-item" src="" onClick={() => this.interactBox(8)} alt=""></img>
        <img name="grid9" class="grid-item" src="" onClick={() => this.interactBox(9)} alt=""></img>
        <img name="grid0" class="grid-item" src="" onClick={() => this.interactBox(0)} alt=""></img>
        <img name="grid1" class="grid-item" src="" onClick={() => this.interactBox(1)} alt=""></img>
        <img name="grid2" class="grid-item" src="" onClick={() => this.interactBox(2)} alt=""></img>
        <img name="grid3" class="grid-item" src="" onClick={() => this.interactBox(3)} alt=""></img>
        <img name="grid4" class="grid-item" src="" onClick={() => this.interactBox(4)} alt=""></img>
        <img name="grid5" class="grid-item" src="" onClick={() => this.interactBox(5)} alt=""></img>
        <img name="grid6" class="grid-item" src="" onClick={() => this.interactBox(6)} alt=""></img>
        <img name="grid7" class="grid-item" src="" onClick={() => this.interactBox(7)} alt=""></img>
        <img name="grid8" class="grid-item" src="" onClick={() => this.interactBox(8)} alt=""></img>
        <img name="grid9" class="grid-item" src="" onClick={() => this.interactBox(9)} alt=""></img>
        <img name="grid0" class="grid-item" src="" onClick={() => this.interactBox(0)} alt=""></img>
        <img name="grid1" class="grid-item" src="" onClick={() => this.interactBox(1)} alt=""></img>
        <img name="grid2" class="grid-item" src="" onClick={() => this.interactBox(2)} alt=""></img>
        <img name="grid3" class="grid-item" src="" onClick={() => this.interactBox(3)} alt=""></img>
        <img name="grid4" class="grid-item" src="" onClick={() => this.interactBox(4)} alt=""></img>
        <img name="grid5" class="grid-item" src="" onClick={() => this.interactBox(5)} alt=""></img>
        <img name="grid6" class="grid-item" src="" onClick={() => this.interactBox(6)} alt=""></img>
        <img name="grid7" class="grid-item" src="" onClick={() => this.interactBox(7)} alt=""></img>
        <img name="grid8" class="grid-item" src="" onClick={() => this.interactBox(8)} alt=""></img>
        <img name="grid9" class="grid-item" src="" onClick={() => this.interactBox(9)} alt=""></img>
        <img name="grid0" class="grid-item" src="" onClick={() => this.interactBox(0)} alt=""></img>
        <img name="grid1" class="grid-item" src="" onClick={() => this.interactBox(1)} alt=""></img>
        <img name="grid2" class="grid-item" src="" onClick={() => this.interactBox(2)} alt=""></img>
        <img name="grid3" class="grid-item" src="" onClick={() => this.interactBox(3)} alt=""></img>
        <img name="grid4" class="grid-item" src="" onClick={() => this.interactBox(4)} alt=""></img>
        <img name="grid5" class="grid-item" src="" onClick={() => this.interactBox(5)} alt=""></img>
        <img name="grid6" class="grid-item" src="" onClick={() => this.interactBox(6)} alt=""></img>
        <img name="grid7" class="grid-item" src="" onClick={() => this.interactBox(7)} alt=""></img>
        <img name="grid8" class="grid-item" src="" onClick={() => this.interactBox(8)} alt=""></img>
        <img name="grid9" class="grid-item" src="" onClick={() => this.interactBox(9)} alt=""></img>
        <img name="grid0" class="grid-item" src="" onClick={() => this.interactBox(0)} alt=""></img>
        <img name="grid1" class="grid-item" src="" onClick={() => this.interactBox(1)} alt=""></img>
        <img name="grid2" class="grid-item" src="" onClick={() => this.interactBox(2)} alt=""></img>
        <img name="grid3" class="grid-item" src="" onClick={() => this.interactBox(3)} alt=""></img>
        <img name="grid4" class="grid-item" src="" onClick={() => this.interactBox(4)} alt=""></img>
        <img name="grid5" class="grid-item" src="" onClick={() => this.interactBox(5)} alt=""></img>
        <img name="grid6" class="grid-item" src="" onClick={() => this.interactBox(6)} alt=""></img>
        <img name="grid7" class="grid-item" src="" onClick={() => this.interactBox(7)} alt=""></img>
        <img name="grid8" class="grid-item" src="" onClick={() => this.interactBox(8)} alt=""></img>
        <img name="grid9" class="grid-item" src="" onClick={() => this.interactBox(9)} alt=""></img>
        <img name="grid0" class="grid-item" src="" onClick={() => this.interactBox(0)} alt=""></img>
        <img name="grid1" class="grid-item" src="" onClick={() => this.interactBox(1)} alt=""></img>
        <img name="grid2" class="grid-item" src="" onClick={() => this.interactBox(2)} alt=""></img>
        <img name="grid3" class="grid-item" src="" onClick={() => this.interactBox(3)} alt=""></img>
        <img name="grid4" class="grid-item" src="" onClick={() => this.interactBox(4)} alt=""></img>
        <img name="grid5" class="grid-item" src="" onClick={() => this.interactBox(5)} alt=""></img>
        <img name="grid6" class="grid-item" src="" onClick={() => this.interactBox(6)} alt=""></img>
        <img name="grid7" class="grid-item" src="" onClick={() => this.interactBox(7)} alt=""></img>
        <img name="grid8" class="grid-item" src="" onClick={() => this.interactBox(8)} alt=""></img>
        <img name="grid9" class="grid-item" src="" onClick={() => this.interactBox(9)} alt=""></img>
        <img name="grid0" class="grid-item" src="" onClick={() => this.interactBox(0)} alt=""></img>
        <img name="grid1" class="grid-item" src="" onClick={() => this.interactBox(1)} alt=""></img>
        <img name="grid2" class="grid-item" src="" onClick={() => this.interactBox(2)} alt=""></img>
        <img name="grid3" class="grid-item" src="" onClick={() => this.interactBox(3)} alt=""></img>
        <img name="grid4" class="grid-item" src="" onClick={() => this.interactBox(4)} alt=""></img>
        <img name="grid5" class="grid-item" src="" onClick={() => this.interactBox(5)} alt=""></img>
        <img name="grid6" class="grid-item" src="" onClick={() => this.interactBox(6)} alt=""></img>
        <img name="grid7" class="grid-item" src="" onClick={() => this.interactBox(7)} alt=""></img>
        <img name="grid8" class="grid-item" src="" onClick={() => this.interactBox(8)} alt=""></img>
        <img name="grid9" class="grid-item" src="" onClick={() => this.interactBox(9)} alt=""></img>
        <img name="grid0" class="grid-item" src="" onClick={() => this.interactBox(0)} alt=""></img>
        <img name="grid1" class="grid-item" src="" onClick={() => this.interactBox(1)} alt=""></img>
        <img name="grid2" class="grid-item" src="" onClick={() => this.interactBox(2)} alt=""></img>
        <img name="grid3" class="grid-item" src="" onClick={() => this.interactBox(3)} alt=""></img>
        <img name="grid4" class="grid-item" src="" onClick={() => this.interactBox(4)} alt=""></img>
        <img name="grid5" class="grid-item" src="" onClick={() => this.interactBox(5)} alt=""></img>
        <img name="grid6" class="grid-item" src="" onClick={() => this.interactBox(6)} alt=""></img>
        <img name="grid7" class="grid-item" src="" onClick={() => this.interactBox(7)} alt=""></img>
        <img name="grid8" class="grid-item" src="" onClick={() => this.interactBox(8)} alt=""></img>
        <img name="grid9" class="grid-item" src="" onClick={() => this.interactBox(9)} alt=""></img>
        
      </div>
    );
  }
}

export default App;
