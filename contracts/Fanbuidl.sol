//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// console.sol is required for printing logs using console.log function
import "hardhat/console.sol";

contract Fanbuidl {
    /* 
        TODO:   
            1. Optimize usage of data structures as lot of structs and dynamic arrays
               are being used
            2. Include OZ contracts like ownable, SafeMath

    */
    // Contract owner address
    address public immutable owner;

    // Percent Fee charged by contract to creator
    uint8 public creatorFee;

    // Total collected fee from creators
    uint256 public collectedFee;

    // Withdraw Lock
    bool public withdrawLock;

    // Content Creator Structure
    struct Creator {
        string accountName;
        string desription;
        uint256 balance;
        uint256 subDays;
        uint256 subFee;
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
        uint256 startDate;
        uint256 endDate;
    }

    // Subscription Storage
    Subcscription[] public subscriptions;

    /* 
        Subscription list with address=>(creator1, creator2), So any address can subscribe to multiple creators
        ex. addr1 => [cr1, cr2]
            addr2 => [cr2, cr3]
            here cr1, cr2, cr3 are indexes of subscriptions array (Subscription[])
    */
    mapping(address => uint256[]) public subList;

    // Allows execution by only Owner
    modifier ownerOnly() {
        require(msg.sender == owner);
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
    event fundsReceived(address, uint256);

    // Subscription Event
    // (subscriber, creator, startDate, endDate, subFee)
    event gotSubscribed(address, address, uint256, uint256, uint256);

    event feeCollected(address, uint256);

    /*
        Constructor:
            - Setup owner address ( who deploys this contract for admin purpose)
    */
    constructor() {
        owner = msg.sender;
        creatorFee = 10;
    }

    /*
        Name: getOwner
        Return Values: 
            - ownerAddress (address): Address of the owner
    */
    function getOwner() public view returns (address) {
        return owner;
    }

    /*
        Name: createCreator
        parameters: 
            - name (string): Name of the creator
            - desc (string): Description
            - subdays(uint): Subscription days
            - fee (uint): subscription fee for subtype selected
    */
    function createCreator(
        string memory name,
        string memory desc,
        uint256 subdays,
        uint256 fee
    ) public {
        require(
            creatorList[msg.sender].check == false,
            "Creator already exists"
        );
        creators.push(msg.sender);
        creatorList[msg.sender] = Creator(
            name,
            desc,
            0,
            subdays,
            fee,
            true,
            true
        );
        emit creatorCreated(msg.sender, creatorList[msg.sender].accountName);
    }

    /*
        Name: getCreator
        Parameters:
            - ad (address): address of creator
        Usage: get creator details from the address
    */
    function getCreator(address ad) public view returns (Creator memory cr) {
        require(creatorList[ad].check == true, "Creator does not exists");
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
        uint256 subdays,
        int256 _subFee
    ) public {
        require(
            creatorList[msg.sender].check == true,
            "Creator does not exists"
        );
        require(
            creatorList[msg.sender].active == true,
            "Your creator account is deactivated"
        );
        bool updated = false;

        if (
            keccak256(abi.encodePacked(_name)) !=
            keccak256(abi.encodePacked(""))
        ) {
            if (
                keccak256(
                    abi.encodePacked(creatorList[msg.sender].accountName)
                ) != keccak256(abi.encodePacked(_name))
            ) {
                updated = true;
                creatorList[msg.sender].accountName = _name;
            }
        }
        if (
            keccak256(abi.encodePacked(_desc)) !=
            keccak256(abi.encodePacked(""))
        ) {
            if (
                keccak256(
                    abi.encodePacked(creatorList[msg.sender].desription)
                ) != keccak256(abi.encodePacked(_desc))
            ) {
                updated = true;
                creatorList[msg.sender].desription = _desc;
            }
        }
        if (subdays != 0) {
            if (creatorList[msg.sender].subDays != subdays) {
                updated = true;
                creatorList[msg.sender].subDays = subdays;
            }
        }
        if (_subFee != 0) {
            if (creatorList[msg.sender].subFee != uint256(_subFee)) {
                updated = true;
                creatorList[msg.sender].subFee = uint256(_subFee);
            }
        }
        if (updated) {
            emit creatorUpdated(
                msg.sender,
                creatorList[msg.sender].accountName
            );
        } else {
            revert("Nothing updated");
        }
    }

    /*
        Name: activateCreator
        Usage: Activate creator account of contract calling address
    */
    function activateCreator() public {
        require(
            creatorList[msg.sender].check == true,
            "Your creator account does not exists"
        );
        require(
            creatorList[msg.sender].active == false,
            "your account is Already activated"
        );
        creatorList[msg.sender].active = true;
        emit creatorActivated(msg.sender, creatorList[msg.sender].accountName);
    }

    /*
        Name: deactivateCreator
        Usage: Deactivate creator account of contract calling address
    */
    function deactivateCreator() public {
        require(
            creatorList[msg.sender].check == true,
            "Your creator does not exists"
        );
        require(
            creatorList[msg.sender].active == true,
            "Your creator account is already deactivated"
        );
        creatorList[msg.sender].active = false;
        emit creatorDeactivated(
            msg.sender,
            creatorList[msg.sender].accountName
        );
    }

    /*
        Name: subscribeMe
            Subscribe current user to the passed creator address
        Parameters:
            - address
    */
    function subscribeMe(address creator) external payable {
        require(creator != msg.sender, "No need to subscribe to own content!");
        require(
            msg.sender.balance >= creatorList[creator].subFee,
            "Insufficient Balance"
        );
        require(
            msg.value == creatorList[creator].subFee,
            "Send Subscription fee"
        );
        require(creatorList[creator].check == true, "Creator does not exists");
        require(
            creatorList[creator].active == true,
            "Creator account is deactivated"
        );

        uint256[] memory indexes = subList[msg.sender];
        bool expired;
        uint256 i;
        for (i = 0; i < indexes.length; i++) {
            if (subscriptions[indexes[i]].creator == creator) {
                expired = subscriptions[indexes[i]].endDate < block.timestamp;
                require(expired, "Already subscribed to this creator");
                break;
            }
        }
        payable(address(this)).transfer(msg.value);
        uint256 _end = block.timestamp +
            (creatorList[creator].subDays * 1 days);
        if (expired) {
            subscriptions[indexes[i]].startDate = block.timestamp;
            subscriptions[indexes[i]].endDate = _end;
        } else {
            subscriptions.push(Subcscription(creator, block.timestamp, _end));
            subList[msg.sender].push(subscriptions.length - 1);
        }

        uint256 contractFee;
        contractFee = (msg.value * creatorFee) / 100;
        creatorList[creator].balance += (creatorList[creator].subFee -
            contractFee);
        collectedFee += contractFee;
        emit gotSubscribed(
            msg.sender,
            creator,
            block.timestamp,
            _end,
            creatorList[creator].subFee
        );
        emit feeCollected(msg.sender, contractFee);
    }

    /*
        Name: getActiveSubscriptions
            Get creator address array of subscriber for which subscription is Active
        Parameters:
            - address of subscriber
    */
    function getActiveSubscriptions(address subscriber)
        public
        view
        returns (Subcscription[] memory)
    {
        uint256 x = subList[subscriber].length;
        Subcscription[] memory activeSubs = new Subcscription[](x);
        uint256 j = 0;
        for (uint256 i = 0; i < x; i++) {
            if (subscriptions[i].endDate > block.timestamp) {
                activeSubs[j] = subscriptions[i];
                j += 1;
            }
        }
        return activeSubs;
    }
    
    // Get Subscription count for any particular user
    function getActiveSubscriptionCount(address subscriber) public view returns(uint){
        return(subList[subscriber].length);
    }

    // Get expiring subscriptions within 7 days
    function getExpiringSubscriptionCount(address subscriber) public view returns(uint){
        uint256[] storage x = subList[subscriber];
        uint256 j = 0;
        for (uint256 i = 0; i < x.length; i++) {
            if ((subscriptions[x[i]].endDate >= block.timestamp) && (subscriptions[x[i]].endDate <= block.timestamp + 7 days) ) {
                j += 1;
            }
        }
        return j;
    }

    /*
        Name: getExpiredSubscriptions
            Get creator address array of subscriber for which subscription is expired
        Parameters:
            - address of subscriber
    */
    function getExpiredSubscriptions(address subscriber)
        public
        view
        returns (Subcscription[] memory)
    {
        uint256 x = subList[subscriber].length;
        Subcscription[] memory expiredSubs = new Subcscription[](x);
        uint256 j = 0;
        for (uint256 i = 0; i < x; i++) {
            if (subscriptions[i].endDate < block.timestamp) {
                expiredSubs[j] = subscriptions[i];
                j += 1;
            }
        }
        return expiredSubs;
    }

    /*
        Name: withdrawFunds
            Withdraw funds which are not part of the totalbalance
    */
    function withdrawFunds(uint256 _amount) public payable ownerOnly {
        require(_amount < collectedFee, "Insufficient funds");
        require(withdrawLock == false, "Withdraw Locked");
        withdrawLock = true;
        payable(owner).transfer(_amount);
        collectedFee -= _amount;
        withdrawLock = false;
    }

    /*
        Name: setCreatorFee
            Set creator fees percentage for the contract
    */
    function setCreatorFee(uint8 _fee) public ownerOnly {
        require(creatorFee != _fee, "Already set");
        require(_fee < 50, "More than 50%");
        creatorFee = _fee;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {
        emit fundsReceived(msg.sender, msg.value);
    }

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
