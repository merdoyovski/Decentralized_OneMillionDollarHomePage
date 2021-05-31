import React, { Component } from 'react';
import './Header.css';

export default class Header extends Component {

  // TODO: Menu

  render() {
    return (
      <header>
        <div>
          <h3>Decentralized Ads</h3>
          <span>Powered by Ethereum</span>
        </div>

        <div>
          <button>Ad Info</button>
        </div>
      </header>
    )
  }
}