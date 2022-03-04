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
        uint subFee;
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

    /*
        Constructor:
            - Setup owner address ( who deploys this contract for admin purpose)
    */
    constructor() {
        owner = msg.sender;
    }

    /*
        Name: createCreator
        parameters: 
            - name (string): Name of the creator
            - desc (string): Description
            - subtype(SubscriptionType): subscription type activated (Weekly, Monthly, etc)
            - fee (uint): subscription fee for subtype selected
    */
    function createCreator(string calldata name, string calldata desc, SubscriptionType subtype, uint fee) public{
        require(creatorList[msg.sender].check==false, "Creator already exists");
        creators.push(Creator(name, desc, 0, subtype, fee, true, true));
        creatorList[msg.sender] = creators[creators.length - 1];
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
        Name: activateCreator
        Parameters:
            - ad (address): address of creator
        Usage: Activate creator executable by own
    */
    function activateCreator(address ad) public{
        require(ad==msg.sender, "You can activate your account only");
        require(creatorList[ad].check==true, "Creator does not exists");
        require(creatorList[ad].active==false, "Creator Already activated");
        creatorList[ad].active = true;
    }

    /*
        Name: deactivateCreator
        Parameters:
            - ad (address): address of creator
        Usage: Deactivate creator executable by own
    */
    function deactivateCreator(address ad) public{
        require(ad==msg.sender, "You can deactivate your account only");
        require(creatorList[ad].check==true, "Creator does not exists");
        require(creatorList[ad].active==true, "Creator Already deactivated");
        creatorList[ad].active = false;
    }
    

}
