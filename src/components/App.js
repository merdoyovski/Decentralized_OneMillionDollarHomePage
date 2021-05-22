import React, { Component } from 'react';
import Web3 from 'web3'
 
import logo from '../logo.png';
import './App.css';
import HTLC from '../abis/HTLC.json';
import ERC20 from '/home/mertmalaz/Desktop/Codes/marketplace/node_modules/@openzeppelin/contracts/build/contracts/ERC20.json';
 
class App extends Component {

    
  async loadWeb3()
  {
    await this.setState({htlc: '0xC032AF45D669290D8378cEf896734F414eD7427d'})
    if(window.ethereum)
    {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if(window.web3)
    {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else
    {
      window.alert("Web3 not supported in your browser.")
    }
  }

  async loadBlockchainData()
  {
    const web3 = await window.web3
 
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    console.log(0)
    var netw = ""
    await web3.eth.net.getId().then(net_id => {
      switch (net_id) {
        case 1:
          netw = "Mainnet"
          break
        case 3:
          netw = "Ropsten"
          break
        case 42:
          netw = "Kovan"
          break
        default:
          netw = 'This is an unknown network.'
      }
    })

    this.setState({net: netw})
    console.log(this.state.net)
    console.log(this.state.account)
   // this.setState({hash: hash_secret})
    console.log(0)
    web3.eth.defaultAccount = this.state.account;
    console.log(0)
  }

  async start_htlc()
  {
    const web3 = await window.web3

    const abi =  HTLC.abi
    var address_htlc = '0x437d50f0a87A76e6698FBc9e543Bee98CfF2BD1C'
    var contract_htlc = await new web3.eth.Contract(abi, this.state.htlc,{gasPrice: web3.utils.toWei('22', 'gwei'), from: this.state.account})

    await console.log("this.state.rec_adr")
    await console.log(this.state.rec_adr)
    await console.log("this.state.token_adr")
    await  console.log(this.state.token_adr)
    await  console.log("this.state.amount")
    await  console.log(this.state.amount)
    await  console.log("this.state.hash")
    await  console.log(this.state.hash)

    contract_htlc.methods.create_htlc(this.state.rec_adr, this.state.token_adr, this.state.amount, this.state.hash).send()
  }

  async approve()
  {
    const web3 = await window.web3

    let contract_address = this.state.token_adr
    const abi =  ERC20.abi
    var address_htlc = '0x437d50f0a87A76e6698FBc9e543Bee98CfF2BD1C'

    const token_contract = web3.eth.Contract(abi, contract_address, {gasPrice: web3.utils.toWei('22', 'gwei'), from: this.state.account});
    token_contract.methods.approve(this.state.htlc, this.state.amount).send();
    
  }

  async fund()
  {
    const web3 = await window.web3
 
    const abi =  HTLC.abi
    var address_htlc = '0x437d50f0a87A76e6698FBc9e543Bee98CfF2BD1C'
    var contract_htlc = new web3.eth.Contract(abi, this.state.htlc,{gasPrice: web3.utils.toWei('22', 'gwei'), from: this.state.account})
 
    contract_htlc.methods.fund().send();
  }

  async getHash()
  {
    await this.loadWeb3()
    if(this.state.hash === "")
    {
      const web3 = await window.web3
      const abi =  HTLC.abi
      var contract_htlc = await new web3.eth.Contract(abi, this.state.htlc,{gasPrice: web3.utils.toWei('22', 'gwei'), from: this.state.account})

      var promise = await contract_htlc.methods.getHash(this.state.rec_adr).call()
      await this.setState({hash: promise})
      await console.log(0)
      await console.log(promise )
      await console.log(0)
    }
  }

  async startSwap()
  {

    await this.loadWeb3()
    console.log("Loaded web3")
    //await new Promise(resolve => setTimeout(resolve, 20000));

    await this.loadBlockchainData()
    console.log("Loaded Blockchain Data")
    // await new Promise(resolve => setTimeout(resolve, 20000));

    
 
    await this.getHash()


    await this.start_htlc()
    console.log("Started HTLC")
    // await new Promise(resolve => setTimeout(resolve, 20000));

    await this.approve()
    console.log("Approved")
    //await new Promise(resolve => setTimeout(resolve, 20000));

    await this.fund()
    console.log("Funded")
    //await new Promise(resolve => setTimeout(resolve, 20000));
  }


/*
  async seeHash()
  {
    await this.loadWeb3()
    
    const web3 = await window.web3
 
    const abi =  HTLC.abi
    var address_htlc = '0x437d50f0a87A76e6698FBc9e543Bee98CfF2BD1C'
    var contract_htlc = new web3.eth.Contract(abi, this.state.htlc,{gasPrice: web3.utils.toWei('22', 'gwei'), from: this.state.account})

      
    var hash_ = contract_htlc.methods.getHash(this.state.rec_adr).call()
    this.setState({hash: hash_})
     
    console.log(0)
    console.log(this.state.hash)
    console.log(0)
    
  }
   
  async seeSecret()
  {
    await this.loadWeb3()
    
    const web3 = await window.web3
 
    const abi =  HTLC.abi
    var address_htlc = '0x437d50f0a87A76e6698FBc9e543Bee98CfF2BD1C'
    var contract_htlc = new web3.eth.Contract(abi, this.state.htlc,{gasPrice: web3.utils.toWei('22', 'gwei'), from: this.state.account})

      
    var secret_ = contract_htlc.methods.getSecret().call()
    this.setState({secret: secret_})

    console.log(0)
    console.log(this.state.secret)
    console.log(0)
  }*/

  async withdraw()
  {
    await this.loadWeb3()
    const web3 = await window.web3
    await this.loadBlockchainData()
 
    const abi =  HTLC.abi
    var address_htlc = '0x437d50f0a87A76e6698FBc9e543Bee98CfF2BD1C'
    var contract_htlc = await new web3.eth.Contract(abi, this.state.htlc,{gasPrice: web3.utils.toWei('22', 'gwei'), from: this.state.account})

    var secret_2 = await contract_htlc.methods.getSecret().call()
    await console.log("secret_2")
    await console.log(this.state.secret)
    await console.log("secret_2")
    //this.setState({secret: secret_})

    if(this.state.secret === '')
    {
      var secret_ = await contract_htlc.methods.getSecret().call()
      this.setState({secret: secret_})
    }


    var test = contract_htlc.methods.withdraw(this.state.rec_adr, this.state.secret ).send()
    console.log(test)
  }
 
 

  constructor(props)
  {
    super(props)
    this.state = {
      account: "",
      net: "",
      rec_adr: "",
      token_adr: "",
      amount: "",
      hash: "",
      secret: "",
      htlc: ""
    }
    this.startSwap = this.startSwap.bind(this)
    //this.seeHash = this.seeHash.bind(this)
    //this.seeSecret = this.seeSecret.bind(this)
    this.withdraw = this.withdraw.bind(this)
  }
 
  handleRecChanged(event) { this.setState({rec_adr: event.target.value}); }
  handleTokChanged(event) { this.setState({token_adr: event.target.value}); }
  handleAmountChanged(event) { this.setState({amount: event.target.value}); }
  handleHashChanged(event) { this.setState({hash: event.target.value}); }
  

  // Wİthdraw Part
  //handleSeeHashChanged(event) { this.setState({hash: event.target.value}); }
  //handleSeeSecretChanged(event) { this.setState({secret: event.target.value}); }
  handleSecretChanged(event) { this.setState({secret: event.target.value}); }



  handleButtonClicked() {
    console.log(this.state.rec_adr);
    console.log(this.state.token_adr);
    console.log(this.state.amount);
    console.log(this.state.hash);
  }

  render() {
    return (
      <form>
        <h1>Start the swap here</h1>
          <p>Enter the receiver's address:</p>
          <input type="text" id="rec_adr" value={this.state.rec_adr} onChange={this.handleRecChanged.bind(this)} />

          <p>Enter the address of the token to be sent:</p>
          <input type="text" id="token_adr" value={this.state.token_adr} onChange={this.handleTokChanged.bind(this)}/>

          <p>Enter the amount to be sent:</p>
          <input type="text" id="amount" value={this.state.amount} onChange={this.handleAmountChanged.bind(this)}/>

          <p>Enter the hash of the secret:</p>
          <input type="text" id="hash" value={this.state.hash} onChange={this.handleHashChanged.bind(this)}/>
 
          <div class='form-sub'>
            <button id='swapButton' onClick={this.startSwap} type='button'>HTLC, Approve, Fund</button>
          </div>

        <h1>Withdraw here</h1>
        {/*
        <p>See the hash:</p>
          <input type="text" id="seehash" value={this.state.rec_adr}  onChange={this.handleRecChanged.bind(this)} />
          <div class='form-sub'>
            <button id='seeSecretButton' onClick={this.seeHash} type='button'>See the Hash</button>
         </div> 
         
        <p>See the secret:</p>
          <input type="text" id="Ssecret" value={this.state.secret}  onChange={this.handleSeeSecretChanged.bind(this)} />
          <div class='form-sub'>
            <button id='seeSecretButton' onClick={this.seeSecret} type='button'>See the Secret</button>
         </div>
        */}
        <p>Enter the secret (Leave empty if not known):</p>
          <input type="text" id="Esecret" value={this.state.secret} onChange={this.handleSecretChanged.bind(this)} />
          <div class='form-sub'>
            <button id='withdrawButton' onClick={this.withdraw} type='button'>Withdraw</button>
            
        </div>


      </form>

      

      
    );
    
  }
}

export default App;
