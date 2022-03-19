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

    // Content Creator Structure
    struct Creator {
        string accountName;
        string desription;
        uint balance;
        uint subDays;
        uint subFee;
        bool active;
        bool check;
    }

    // Creator List
    address[] public creators;

    // Key storage of creators array
    // creatorList[uint] will point to element in creators
    mapping(address => Creator) public creatorList;

    // Subscription structure 
    struct Subcscription {
        address creator;
        uint startDate;
        uint endDate;
    }

    // Subscription Storage
    Subcscription[] public subscriptions;
    
    /* 
        Subscription list with address=>(creator1, creator2), So any address can subscribe to multiple creators
        ex. addr1 => [cr1, cr2]
            addr2 => [cr2, cr3]
            here cr1, cr2, cr3 are indexes of subscriptions array (Subscription[])
    */
    mapping(address => uint[]) public subList;
    
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

    // Funds received to the Contract
    event fundsReceived(address, uint);

    // Subscription Event
    // (subscriber, creator, startDate, endDate, subFee)
    event gotSubscribed(address, address, uint, uint, uint);
    
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
        uint subdays, 
        uint fee
        ) public{
        require(creatorList[msg.sender].check==false, "Creator already exists");
        creators.push(msg.sender);
        creatorList[msg.sender] = Creator(name, desc, 0, subdays, fee, true, true);
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
        uint subdays, 
        int _subFee
        ) public {
        require(creatorList[msg.sender].check==true, "Creator does not exists");
        require(creatorList[msg.sender].active==true, "Your creator account is deactivated");
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
        if(subdays != 0){
            if(creatorList[msg.sender].subDays != subdays){
                updated = true;
                creatorList[msg.sender].subDays = subdays;
            }
        }
        if(_subFee != 0){
            if(creatorList[msg.sender].subFee != uint(_subFee)){
                updated =true;
                creatorList[msg.sender].subFee = uint(_subFee);
            }
        }
        if(updated){
            emit creatorUpdated(msg.sender, creatorList[msg.sender].accountName);
        }else{
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

    /*
        Name: subscribeMe
            Subscribe current user to the passed creator address
        Parameters:
            - address
    */
    function subscribeMe(address creator) payable external{
        require(creator!=msg.sender, "No need to subscribe to own content!");
        require(msg.sender.balance>=creatorList[creator].subFee, "Insufficient Balance");
        require(msg.value==creatorList[creator].subFee, "Send Subscription fee");
        require(creatorList[creator].check==true, "Creator does not exists");
        require(creatorList[creator].active==true, "Creator account is deactivated");

        uint[] memory indexes = subList[msg.sender];
        bool expired;
        uint i;
        for (i=0; i<indexes.length; i++){
            if(subscriptions[indexes[i]].creator==creator){
                expired = subscriptions[indexes[i]].endDate<block.timestamp;
                require(expired, "Already subscribed to this creator");
                break;
            }
        }
        payable(address(this)).transfer(msg.value);
        uint _end = block.timestamp + (creatorList[creator].subDays * 1 days);
        if(expired){
            subscriptions[indexes[i]].startDate = block.timestamp;
            subscriptions[indexes[i]].endDate = _end;
        }else{
            subscriptions.push(Subcscription(creator, block.timestamp, _end));
            subList[msg.sender].push(subscriptions.length - 1);
        }

        creatorList[creator].balance += creatorList[creator].subFee;
        emit gotSubscribed(msg.sender, creator, block.timestamp, _end, creatorList[creator].subFee);
    }

    /*
        Name: getActiveSubscriptions
            Get creator address array of subscriber for which subscription is Active
        Parameters:
            - address of subscriber
    */
    function getActiveSubscriptions(address subscriber) public view returns(Subcscription[] memory){
        uint x = subList[subscriber].length;
        Subcscription[] memory activeSubs = new Subcscription[](x);
        uint j=0;
        for(uint i=0; i < x; i++){
            if(subscriptions[i].endDate>block.timestamp){
                activeSubs[j] = subscriptions[i];
                j+=1;
            }
        }
        return activeSubs;
    }

    /*
        Name: getExpiredSubscriptions
            Get creator address array of subscriber for which subscription is expired
        Parameters:
            - address of subscriber
    */
    function getExpiredSubscriptions(address subscriber) public view returns(Subcscription[] memory){
        uint x = subList[subscriber].length;
        Subcscription[] memory expiredSubs = new Subcscription[](x);
        uint j=0;
        for(uint i=0; i < x; i++){
            if(subscriptions[i].endDate<block.timestamp){
                expiredSubs[j] = subscriptions[i];
                j+=1;
            }
        }
        return expiredSubs;
    }


    function withdrawFunds() public payable ownerOnly{

    }
    
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {
        emit fundsReceived(msg.sender, msg.value);
    }

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
