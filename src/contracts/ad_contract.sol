pragma solidity ^0.8.0;
// SPDX-License-Identifier: UNLICENSED

contract ethereumAds {
    mapping(uint256 => adBox) public adBoxes;
    
    uint private initial_price = 100 wei;
    string private initial_url = "https://previews.123rf.com/images/alexwhite/alexwhite1211/alexwhite121100559/16225798-buy-now-icon.jpg";
    uint private box_count = 100;
    
    address payable private contract_owner;

    struct adBox {
        address owner;
        address renter;
        string img_url;
        string ad_url;
        uint buy_price;
        bool rented;
        uint rent_start;
        uint rent_period;
        uint rent_price_daily;
    }
    
    event boxBought(address indexed _buyer, uint _price);
    event boxRented(address indexed _renter, uint _price);
    event boxCountChanged(address indexed _renter, uint _price);
    event initialUrlChanged(address indexed _renter, string _price);
    event initialPriceChanged(address indexed _renter, uint _price);

    constructor() {
        contract_owner = payable(msg.sender);
    }
    
    // Setters for contract owner 
    
    function setBoxCount(uint _box_count) external{
        require(msg.sender == contract_owner,  "Only the owner of this contract can update the box count");
        box_count = _box_count;
        emit boxCountChanged(msg.sender , _box_count);
    }
    
    function setInitialUrl(string memory _initial_url) external{
        require(msg.sender == contract_owner,  "Only the owner of this contract can update the initial URL");
        initial_url = _initial_url;
        emit initialUrlChanged(msg.sender , _initial_url);
    }
    
    function setInitialPrice(uint _initial_price) external{
        require(msg.sender == contract_owner, "Only the owner of this contract can update the initial price");
        initial_price = _initial_price;
        emit initialPriceChanged(msg.sender , _initial_price);
    }
    
    function setContractOwner(address _new_owner) external{
        require(msg.sender == contract_owner, "Only the owner of this contract can assign a new contract owner");
        require(_new_owner != address(0));
        contract_owner = payable(_new_owner);
    }
    
    // Ad box interaction functions

    function buyOwnedBox(uint _box_index) external payable {
        require(adBoxes[_box_index].buy_price != 0, "This box isn't for sale.");
        require(msg.sender != adBoxes[_box_index].owner, "You can't buy the box you own.");
        require(msg.value >= adBoxes[_box_index].buy_price, "Value sent is less than the buy price");
        require(adBoxes[_box_index].owner != address(0), "This box is not owned but marked as owned. This error shouldn't occur.");
        require(!adBoxes[_box_index].rented , "This box is currently rented. Wait until the renting period ends to purchase it.");
        
        
        adBoxes[_box_index].owner = msg.sender;
        adBoxes[_box_index].buy_price = 0;
        
        emit boxBought(msg.sender, msg.value);

        payable(adBoxes[_box_index].owner).transfer(msg.value);
    }

    function buyEmptyBox(uint _box_index) external payable {
        require(msg.value >= initial_price, "Value sent is less than the buy price of an empty box");
        require(adBoxes[_box_index].owner == address(0), "This box is owned but should't be. This error shouldn't occur.");

        adBoxes[_box_index].owner = msg.sender;
        adBoxes[_box_index].buy_price = 0;
        
        emit boxBought(msg.sender, msg.value);

        contract_owner.transfer(msg.value);
    }
    
    function rentBox(uint _box_index, uint _many_days) external payable {
        require(msg.value >= adBoxes[_box_index].rent_price_daily * _many_days, "Value sent is less than the rent cost");
        require(!adBoxes[_box_index].rented , "The box is already on rent.");
        require(adBoxes[_box_index].rent_price_daily != 0 , "The box is not for rent.");
         
        adBoxes[_box_index].rent_start = block.number; // This should be checked
        adBoxes[_box_index].rent_period = _many_days * 60 ; // days to seconds
        
        adBoxes[_box_index].rented = true;
        adBoxes[_box_index].renter = msg.sender;
        
        
        emit boxRented(msg.sender, msg.value);

        payable(adBoxes[_box_index].owner).transfer(msg.value);
    }
    
    function retrieveRentedBox(uint _box_index) external {
        require(msg.sender >= adBoxes[_box_index].owner , "Only the real owner of the box can retrieve it.");
        require(adBoxes[_box_index].rented , "The box must be rented to be retrieved.");
        require(adBoxes[_box_index].rent_start + adBoxes[_box_index].rent_period/4 >= block.number, "Rent period didn't end yet.");
   
        adBoxes[_box_index].rented = false;
        adBoxes[_box_index].renter = address(0);
    }
    
    // Setters for box owners/renters

    function setBuyPrice(uint _box_index, uint _price) external {
        require(msg.sender == adBoxes[_box_index].owner, "Only the owner of the ad box can change the buy price");

        adBoxes[_box_index].buy_price = _price;
    }
    
    function setRentPrice(uint _box_index, uint _price) external {
        require(msg.sender == adBoxes[_box_index].owner, "Only the owner of the ad box can change the rent price");

        adBoxes[_box_index].rent_price_daily = _price;
    }

    function setImgUrl(uint _box_index, string memory _url) external {
        
        if(adBoxes[_box_index].rented){
            require(msg.sender == adBoxes[_box_index].renter,  "Only the renter of the ad box can change the IMG URL");
        }
        
        else{
            require(msg.sender == adBoxes[_box_index].owner, "Only the owner of the ad box can change the IMG URL");
        }
        
        adBoxes[_box_index].img_url = _url;
    }
    
    
    function setAdUrl(uint _box_index, string memory _url) external {
        
        if(adBoxes[_box_index].rented){
            require(msg.sender == adBoxes[_box_index].renter,  "Only the renter of the ad box can change the Ad URL");
        }
        
        else{
            require(msg.sender == adBoxes[_box_index].owner, "Only the owner of the ad box can change the Ad URL");
        }
        
        adBoxes[_box_index].ad_url = _url;
    }
    
    // Getters

    function getBuyPrice(uint _box_index) external view returns (uint) {
        return adBoxes[_box_index].buy_price;
    }
    
    function getRentPrice(uint _box_index) external view returns (uint) {
        return adBoxes[_box_index].rent_price_daily;
    }

    function getImgUrl(uint _box_index) external view returns (string memory) {
        return adBoxes[_box_index].img_url;
    }
    
    function getAdUrl(uint _box_index) external view returns (string memory) {
        return adBoxes[_box_index].ad_url;
    }

    function getOwner(uint _box_index) external view returns (address) {
        return adBoxes[_box_index].owner;
    }
    
    function getBoxCount() external view returns (uint){
        return box_count;   
    }
    
    function getInitialUrl() external view returns (string memory){
        return initial_url;   
    }

    function isBoxOwned(uint _box_index) external view returns (bool){
        return adBoxes[_box_index].owner == address(0) ? false : true;
    }
}