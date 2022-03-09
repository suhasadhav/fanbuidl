//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// console.sol is required for printing logs using console.log function
import "hardhat/console.sol";

contract Fanbuidl {
    /* 
        TODO:   
            1. Optimize usage of data structures as lot of structs and dynamic arrays
               are being used

    */
    // Contract owner address
    address public immutable owner;

    // Subscription Type for any creator
    enum SubscriptionType {
        Weekly,
        Monthly,
        Quarterly,
        Yearly
    }

    // Content Creator Structure
    struct Creator {
        string accountName;
        string desription;
        uint balance;
        SubscriptionType subType;
        uint24 subFee;
        bool active;
        bool check;
    }

    // Creator Storage
    Creator[] public creators;

    // Key storage of creators array
    // creatorList[uint] will point to element in creators
    mapping(address => Creator) public creatorList;

    // Subscription structure 
    struct Subcscription {
        address subscriber;
        Creator creator;
        uint startDate;
        uint endDate;
    }

    // Subscription Storage
    Subcscription[] public subscriptions;
    
    // Allows execution by only Owner
    modifier ownerOnly {
        require(msg.sender==owner);
        _;
    }

    // If creator is activated get address and accountName
    event creatorActivated(address, string);

    // If creator is deactivated get address and accountName
    event creatorDeactivated(address, string);

    // New creator account created get address and account name
    event creatorCreated(address, string);

    // Creator updated returns address and accountName
    event creatorUpdated(address, string);

    /*
        Constructor:
            - Setup owner address ( who deploys this contract for admin purpose)
    */
    constructor() {
        owner = msg.sender;
    }

    /*
        Name: getOwner
        Return Values: 
            - ownerAddress (address): Address of the owner
    */
    function getOwner() public view returns(address){
        return owner;
    }

    /*
        Name: createCreator
        parameters: 
            - name (string): Name of the creator
            - desc (string): Description
            - subtype(SubscriptionType): subscription type activated (Weekly, Monthly, etc)
            - fee (uint): subscription fee for subtype selected
    */
    function createCreator(
        string memory name, 
        string memory desc, 
        SubscriptionType subtype, 
        uint24 fee
        ) public{
        require(creatorList[msg.sender].check==false, "Creator already exists");
        creators.push(Creator(name, desc, 0, subtype, fee, true, true));
        creatorList[msg.sender] = creators[creators.length - 1];
        emit creatorCreated(msg.sender, creatorList[msg.sender].accountName);
    }

    /*
        Name: getCreator
        Parameters:
            - ad (address): address of creator
        Usage: get creator details from the address
    */
    function getCreator(address ad) public view returns(Creator memory cr){
        require(creatorList[ad].check==true, "Creator does not exists");
        return creatorList[ad];
    }

    /*
        Name: updateCreator
        Parameters:
            - _name (string): New name for the creator
            - _desc (string): New description
            - _subType (int8): Subscription type ( if no update send -1 )
            - _subFee (uint24): Subscription fee ( if no update send -1 )
        Usage: Update creator details for the calling address
    */
    function updateCreator(
        string memory _name, 
        string memory _desc, 
        int8 _subType, 
        int24 _subFee
        ) public {
        require(creatorList[msg.sender].check==true, "Your creator account does not exists");
        require(creatorList[msg.sender].active==true, "Your creator account is deactivated");
        require(_subFee < 1000000);
        bool updated = false;

        if(keccak256(abi.encodePacked(_name)) != keccak256(abi.encodePacked(""))){
            if(keccak256(abi.encodePacked(creatorList[msg.sender].accountName)) != keccak256(abi.encodePacked(_name))){
                updated =true;
                creatorList[msg.sender].accountName = _name;
            }
        }
        if(keccak256(abi.encodePacked(_desc)) != keccak256(abi.encodePacked(""))){
            if(keccak256(abi.encodePacked(creatorList[msg.sender].desription)) != keccak256(abi.encodePacked(_desc))){
                updated =true;
                creatorList[msg.sender].desription = _desc;
            }
        }
        if(_subType >= 0){
            if(creatorList[msg.sender].subType != SubscriptionType(uint8(_subType))){
                updated =true;
                creatorList[msg.sender].subType = SubscriptionType(uint8(_subType));
            }
        }
        if(_subFee >= 0){
            if(creatorList[msg.sender].subFee != uint24(_subFee)){
                updated =true;
                creatorList[msg.sender].subFee = uint24(_subFee);
            }
        }
        if(updated){
            emit creatorUpdated(msg.sender, creatorList[msg.sender].accountName);
        }
        else{
            revert("Nothing updated");
        }
    }

    /*
        Name: activateCreator
        Usage: Activate creator account of contract calling address
    */
    function activateCreator() public{
        require(creatorList[msg.sender].check==true, "Your creator account does not exists");
        require(creatorList[msg.sender].active==false, "your account is Already activated");
        creatorList[msg.sender].active = true;
        emit creatorActivated(msg.sender, creatorList[msg.sender].accountName);
    }

    /*
        Name: deactivateCreator
        Usage: Deactivate creator account of contract calling address
    */
    function deactivateCreator() public{
        require(creatorList[msg.sender].check==true, "Your creator does not exists");
        require(creatorList[msg.sender].active==true, "Your creator account is already deactivated");
        creatorList[msg.sender].active = false;
        emit creatorDeactivated(msg.sender, creatorList[msg.sender].accountName);
    }
}
