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
        bool active;
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
        - Setup owner address ( who deploys this contract for admin purpose)
    */
    constructor() {
        owner = msg.sender;
    }

    /*
        Name: createCreator

        struct Creator {
            string accountName;
            string desription;
            uint balance;
            SubscriptionType subType;
            bool active;
    }
    */
    function createCreator(string calldata name, string calldata desc, SubscriptionType subtype) public{
        require(creatorList[msg.sender].active==false, "Creator already exists");
        creators.push(Creator(name, desc, 0, subtype, true));
        creatorList[msg.sender] = creators[creators.length - 1];
    }
}
