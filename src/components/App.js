import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import ethAds from '../abis/ethereumAds.json';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      account: "",
      contract: "",
      box_count: 0,
    };

    this.interactBox = this.interactBox.bind(this);
  }

  async componentDidMount() {
    await this.loadWeb3();
    const web3 = await window.web3;

    const contract_address = "0x2EDc9d77356C63d56C2990EdCAbE9e81C0c5a1C5";
    const abi = ethAds.abi;

    const account = (await web3.eth.getAccounts())[0];
    const contract = await new web3.eth.Contract(abi, contract_address);
    const box_count = await contract.methods.getBoxCount().call();

    this.setState({
      account,
      contract,
      box_count,
    });

    const boxes = document.getElementById("grid").children;
    for (let i = 0; i < box_count; ++i)
      this.state.contract.methods.getUrl(i).call()
        .then(url => boxes[i].src = url);
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

  async interactBox(box_index) {
    const web3 = await window.web3;

    const [price, isBoxOwned, boxOwner] = await Promise.all([
      this.state.contract.methods.getPrice(box_index).call(),
      this.state.contract.methods.isBoxOwned(box_index).call(),
      this.state.contract.methods.getOwner(box_index).call()
    ]);

    if (boxOwner == this.state.account) { // Owned by caller, set URL or price
      console.log("Owned by you, set URL or price");
      const newUrl = window.prompt("Enter new image URL", ""); // update html url
      if (newUrl)
        this.setUrl(box_index, newUrl);

      const newPrice = window.prompt("Enter the new price in wei", ""); // update price in blockchain
      if (newPrice)
        this.setPrice(box_index, newPrice);
    }
    else if (isBoxOwned) { // Owned by another address, read the price and offer the transaction to the caller
      console.log("Owned by another address");
      this.state.contract.methods.buyOwnedBox(box_index).send({
        from: this.state.account,
        value: web3.utils.toWei(web3.utils.toWei(price, 'ether'))
      }).catch();
    }
    else { // No owner
      console.log("No owner, buying this");
      this.state.contract.methods.buyEmptyBox(box_index).send({
        from: this.state.account,
        value: web3.utils.toWei("100", 'wei')
      }).catch();
    }
  }

  setUrl(box_index, url) {
    this.state.contract.methods.setUrl(box_index, url).send({ from: this.state.account });
    // TODO: Change the image without refreshing
  }

  setPrice(box_index, price) {
    this.state.contract.methods.setPrice(box_index, price).send({ from: this.state.account });
  }

  // TODO: Rent
  // TODO: Header
  // TODO: Info box for each box
  // TODO: Menu

  generateImgTags(n) {
    let img_tags = [];
    for (let i = 0; i < n; ++i)
      img_tags.push(
        <img class="grid-item" src="" onClick={() => this.interactBox(i)} key={i} />
      );
    return img_tags;
  }

  render() {
    return (
      <div id="grid" class="grid">
        {this.generateImgTags(this.state.box_count)}
      </div>
    );
  }
}

export default App;
