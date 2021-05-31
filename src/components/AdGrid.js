import React, { Component } from 'react';
import './AdGrid.css';
import EtherContext from './EtherContext.js';

export default class AdGrid extends Component {
  static contextType = EtherContext;

  generateAds() {
    let ads = [];
    for (let i = 0; i < this.props.ad_count; ++i)
      ads.push(<Ad key={i} id={i} default_ad_src={this.props.default_ad_src} />);
    return ads;
  }

  render() {
    if (this.context.contract)
      return (
        <div class="grid">
          {this.generateAds()}
        </div>
      );
    else
      return <span id="ad-grid-loading">Connecting...</span>
  }
}

class Ad extends Component {
  static contextType = EtherContext;

  constructor(props) {
    super(props);

    this.state = {
      src: "",
    };

    this.img = React.createRef();

    this.onClick = this.onClick.bind(this);
  }

  async componentDidMount() {
    const { contract } = this.context;
    
    this.setState({
      src: (await contract.methods.getUrl(this.props.id).call()) || this.props.default_ad_src,
    });
  }

  setUrl(ad_index, url) {
    const { contract, account } = this.context;

    const img = this.img.current;
    const previous_src = img.src;

    // TODO: temporary gif, replace
    img.src = "https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif";

    contract.methods.setImgUrl(ad_index, url).send({ from: account })
      .then(() => img.src = url)
      .catch(() => img.src = previous_src);
  }

  setPrice(ad_index, price) {
    const { contract, account } = this.context;
    contract.methods.setBuyPrice(ad_index, price).send({ from: account });
  }

  // TODO: Info box for each box
  async onClick() {
    const { contract, account } = this.context;

    const web3 = await window.web3;
    const ad_index = this.props.id;

    const [price, isBoxOwned, boxOwner] = await Promise.all([
      contract.methods.getBuyPrice(ad_index).call(),
      contract.methods.isBoxOwned(ad_index).call(),
      contract.methods.getOwner(ad_index).call()
    ]);

    if (boxOwner === account) { // Owned by caller, set URL or price
      console.log("Owned by you, set URL or price");
      const newUrl = window.prompt("Enter new image URL", ""); // update html url
      if (newUrl)
        this.setUrl(ad_index, newUrl);

      const newPrice = window.prompt("Enter the new price in wei", ""); // update price in blockchain
      if (newPrice)
        this.setPrice(ad_index, newPrice);
    }
    else if (isBoxOwned) { // Owned by another address, read the price and offer the transaction to the caller
      console.log("Owned by another address");
      contract.methods.buyOwnedBox(ad_index).send({
        from: account,
        value: web3.utils.toWei(price, 'ether')
      }).catch();
    }
    else { // No owner
      console.log("No owner, buying this");
      contract.methods.buyEmptyBox(ad_index).send({
        from: account,
        value: web3.utils.toWei("100", 'wei')
      }).catch();
    }
  }

  render() {
    return <img ref={this.img} class="grid-item"
      src={this.state.src} onClick={this.onClick} alt="" />;
  }
}