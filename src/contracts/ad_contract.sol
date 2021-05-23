pragma solidity ^0.8.0;

contract ethereumAds {
    mapping(uint256 => adBox) public adBoxes;
    uint256 initial_price = 100 wei;
    uint256 MAX_PRICE = 100 ether;
    string initial_url =
        "https://previews.123rf.com/images/alexwhite/alexwhite1211/alexwhite121100559/16225798-buy-now-icon.jpg";
    uint256 box_count = 10;

    struct adBox {
        address owner;
        string url;
        bool owned;
        bool rented;
        uint256 price;
    }

    constructor() {
        for (uint256 i = 0; i < box_count; i++) {
            adBoxes[i].url = initial_url;
        }
    }

    function buyOwnedBox(uint256 _box_index) public payable {
        // Prevents anyone from buying until owner decides a price
        require(adBoxes[_box_index].price != MAX_PRICE);
        require(adBoxes[_box_index].owned == true);
        require(msg.sender != adBoxes[_box_index].owner);
        require(msg.value >= adBoxes[_box_index].price);

        adBoxes[_box_index].owner = msg.sender;

        adBoxes[_box_index].price = MAX_PRICE;
    }

    function buyEmptyBox(uint256 _box_index) public payable {
        require(adBoxes[_box_index].price != MAX_PRICE);
        require(adBoxes[_box_index].owned == false);
        require(msg.value >= initial_price);

        adBoxes[_box_index].owner = msg.sender;
        adBoxes[_box_index].owned = true;

        adBoxes[_box_index].price = MAX_PRICE;
    }

    function setPrice(uint256 _box_index, uint256 _price) public {
        require(msg.sender == adBoxes[_box_index].owner);

        adBoxes[_box_index].price = _price;
    }

    function setUrl(uint256 _box_index, string memory _url) public {
        require(msg.sender == adBoxes[_box_index].owner);
        adBoxes[_box_index].url = _url;
    }

    function getPrice(uint256 _box_index) public view returns (uint256) {
        return adBoxes[_box_index].price;
    }

    function getUrl(uint256 _box_index) public view returns (string memory) {
        return adBoxes[_box_index].url;
    }

    function getOwner(uint256 _box_index) public view returns (address) {
        return adBoxes[_box_index].owner;
    }

    function isBoxOwned(uint256 _box_index) public view returns (bool) {
        return adBoxes[_box_index].owned;
    }
    
    function getBoxCount() public view returns (uint256){
        return box_count;   
    }
}
