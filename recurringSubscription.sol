pragma solidity ^0.5.2;

interface DAI {
    function balanceOf(address tokenOwner) external view returns(uint balance);
    function allowance(address tokenOwner, address spender) external view returns(uint remaining);
    function transfer(address to, uint tokens) external returns(bool success);
    function transferFrom(address from, address to, uint tokens) external returns(bool success);
}

//Prevent overflows.
library SafeMath {

    function mul(uint256 a, uint256 b) internal pure returns(uint256 c) {
        if (a == 0) {
            return 0;
        }
        c = a * b;
        require(c / a == b);
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns(uint256) {
        return a / b;
    }

    function sub(uint256 a, uint256 b) internal pure returns(uint256) {
        require(b <= a);
        return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns(uint256 c) {
        c = a + b;
        require(c >= a);
        return c;
    }

}

contract RecurringSubscription {

    using SafeMath for uint256;
    address public merchant;
    address public contractOwner;
    address public contractManager;
    uint256 public subscriptionPrice;
    string public billingInterval;
    uint256 public aMonthInSeconds;

    event subscriptionEvent(address indexed SubscriberAddress, uint256 SubscriptionAmount, string BillingInterval);

    DAI public DAIcontract; //Token address.

    constructor(address _contractManager) public {
        DAIcontract = DAI(0x...); //DAI 
        merchant = 0x...;
        contractOwner = msg.sender;
        contractManager = _contractManager;
        //subscriptionPrice is hardcoded and unmodifiable to ensure you can never be billed anything but this amount per charge.
        subscriptionPrice = 799 / 100 * (10) ** 18; //This is equal to 7.99 DAI. The division is because Solidity does not allow decimals, and the 10 to the 18th power operation is to convert to the proper amount of token decimals places.
        //billingInterval is hardcoded and unmodifiable. The charge function ensures you can never be charged more than once per billing interval.
        billingInterval = "Monthly";
        aMonthInSeconds = 60; //2629744;
    }

    struct Subscriptions {
        uint256 timeOfFirstCharge; //Time in Unix seconds.
        uint256 timeOfLastCharge; //Time in Unix seconds.
        uint256 timesCharged; //Time in Unix seconds.
        uint256 nonce;
    }

    mapping(address => Subscriptions) public subscriptionRegistry; // List of all subscribers. Lookup via subscriber address.
    address[] public subscriberList;

    // ====================================================== Functions ====================================================== \\

    function initiateSubscription(address _subscriberAddress) external {
        require(msg.sender == contractManager, "You are not authorized to call this function.");
        if (isSubscriber(_subscriberAddress)) revert();
        subscriptionRegistry[_subscriberAddress].timeOfFirstCharge = now;
        subscriptionRegistry[_subscriberAddress].timeOfLastCharge = now;
        subscriptionRegistry[_subscriberAddress].timesCharged = 1;
        subscriptionRegistry[_subscriberAddress].nonce = subscriberList.push(_subscriberAddress) - 1;

        DAIcontract.transferFrom(_subscriberAddress, merchant, subscriptionPrice);

        emit subscriptionEvent(_subscriberAddress, subscriptionPrice, billingInterval);

    }

    function cancelSubscription(address _subscriberAddress) public {
        address subscriberAddress;
        if (msg.sender == contractManager){
            subscriberAddress = _subscriberAddress;
        }
        if (msg.sender != contractManager){
            require(msg.sender == _subscriberAddress, "You are not authorized to choose an address other than your own.");
            subscriberAddress = _subscriberAddress;
        }
        //Prevent the contractManager from using cancelSubscription and initiateSubscription in succession to drain an account. One month must pass at least before deletion of an address is allowed.
        //This does not stop the subscriber from cancelling before the next recurring billing period. That is done in the token contract by setting the approval amount of this contract to 0.
        require(now - subscriptionRegistry[subscriberAddress].timeOfFirstCharge >= aMonthInSeconds, "Cannot delete the subscriber address from the list. Too little time has passed since this subscriber address was last charged.");
        if (!isSubscriber(subscriberAddress)) revert();
        uint256 rowToDelete = subscriptionRegistry[subscriberAddress].nonce;
        address keyToMove = subscriberList[subscriberList.length - 1];
        subscriberList[rowToDelete] = keyToMove;
        subscriptionRegistry[keyToMove].nonce = rowToDelete;
        subscriberList.length--;
        delete subscriptionRegistry[subscriberAddress];
    }

    function isSubscriber(address _subscriberAddress) public view returns(bool isASubscriber) {
        if (subscriberList.length == 0) return false;
        return (subscriberList[subscriptionRegistry[_subscriberAddress].nonce] == _subscriberAddress);
    }

    function getSubscriberCount() public view returns(uint256 subscriberCount) {
        return subscriberList.length;
    }

    function chargeSubscriber(address _subscriberAddress) public {
        require(msg.sender == contractManager, "You are not authorized to call this function.");
        require(subscriptionRegistry[_subscriberAddress].timeOfFirstCharge > 0, "The subscriber address doesn't exist in the array.");
        //A month in this contract is defined as 2629744 seconds, which is based on a 365.24 day year (31556926 seconds).
        require(now - subscriptionRegistry[_subscriberAddress].timeOfLastCharge >= aMonthInSeconds, "You have tried to bill the subscriber address too early.");
        subscriptionRegistry[_subscriberAddress].timesCharged++;
        subscriptionRegistry[_subscriberAddress].timeOfLastCharge = now;
        DAIcontract.transferFrom(_subscriberAddress, merchant, subscriptionPrice);
    }

    function updateContractManager(address _newContractManager) public {
        //Update the contract manager which automatically runs things.
        require(msg.sender == contractOwner, "You are not authorized to call this function.");
        contractManager = _newContractManager;
    }
}