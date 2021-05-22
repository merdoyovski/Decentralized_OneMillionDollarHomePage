pragma solidity ^0.8.0; 

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract HTLC {

  mapping(address => htlc_internals)public m_HTLCs;

  struct htlc_internals{
    uint  startTime;
    uint  lockTime;
    string  secret; //abracadabra
    bytes32  hash_of_secret;
    address  receiver;
    uint  amount; 
    IERC20  token;
  }
  
  function create_htlc(address _receiver, address _token, uint _amount, bytes32 _hash) external { 
    require(m_HTLCs[msg.sender].startTime + m_HTLCs[msg.sender].lockTime < block.timestamp, 'A HTLC is already in place. Wait for this to end.');
    htlc_internals memory new_htlc = htlc_internals(0, 10000 seconds, "", _hash, _receiver, _amount, IERC20(_token));
    m_HTLCs[msg.sender] = new_htlc;
  } 

  function fund() external {
    m_HTLCs[msg.sender].startTime = block.timestamp;
    m_HTLCs[msg.sender].token.transferFrom(msg.sender, address(this),  m_HTLCs[msg.sender].amount);
  }

  function withdraw(address _owner, string memory _secret) external { 
    // Secret is correct
    require(keccak256(abi.encodePacked(_secret)) ==  m_HTLCs[_owner].hash_of_secret, 'wrong secret');
    // msg.sender is the Receiver
    require(msg.sender == m_HTLCs[_owner].receiver);
    // Reveal the secret
    m_HTLCs[_owner].secret = _secret; 
    // Send the token
    m_HTLCs[_owner].token.transfer( m_HTLCs[_owner].receiver, m_HTLCs[_owner].amount); 
  } 
  
  function getHash(address _sender) external view returns (bytes32){
      return(m_HTLCs[_sender].hash_of_secret);
  }
  
  function getSecret()external view returns (string memory){
      return(m_HTLCs[msg.sender].secret);
  }

  function refund() external { 
    require(block.timestamp > m_HTLCs[msg.sender].startTime + m_HTLCs[msg.sender].lockTime, 'too early');
    m_HTLCs[msg.sender].token.transfer(msg.sender, m_HTLCs[msg.sender].amount); 
  } 

  function resetTime() external{
    m_HTLCs[msg.sender].startTime = 0;
    m_HTLCs[msg.sender].lockTime = 0;
  }

  
}