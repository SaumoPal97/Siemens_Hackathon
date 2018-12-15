pragma solidity ^0.4.20;

contract Tacos {
    address public owner;
    uint256 public minimumPriority;
    uint256 public numberOfRequests;
    address[] public users;
    
    struct User {
        uint256[] priority;
        string[] fileNameRequest;
        string[] fileNameAccess;
        uint256 totalPriority;
    }
    
    mapping(address => User) public userInfo; //counter is users.length
    mapping(address => string) public userName; //counter is users.length
    
    function() public payable { }

    function Tacos(uint256 _minimumPriority) public {
        owner = msg.sender;
        if(_minimumPriority > 0) minimumPriority = _minimumPriority;
    }
    
    function kill() public {
        if(msg.sender == owner) selfdestruct(owner);
    }
    
    function checkUserExists(address _user) public constant returns(bool){
        for(uint256 i = 0; i < users.length; i++) {
            if(users[i] == _user) return true;
        }
        return false;
    }

    function register(string _name) public {
        require(!checkUserExists(msg.sender));

        userName[msg.sender] = _name;
        users.push(msg.sender);
    }

    function request(string _fileName) public payable {
        require(checkUserExists(msg.sender));
        require(bytes(userName[msg.sender]).length > 0);
        require(bytes(_fileName).length > 0);
        require(msg.value > minimumPriority);

        userInfo[msg.sender].priority.push(msg.value/minimumPriority); //counter is priority.lengh
        userInfo[msg.sender].fileNameRequest.push(_fileName); //counter is fileName.length
        userInfo[msg.sender].totalPriority += msg.value/minimumPriority;
        numberOfRequests++;
        owner.transfer(msg.value);
    }

    function approve(address _user, string _fileName) public {
        require(msg.sender == owner);
        require(_user != address(0));
        require(bytes(_fileName).length > 0);
        
        uint256 _index = 0;
        for(uint256 i = 0; i < userInfo[_user].fileNameRequest.length; i++) {
            if(keccak256(userInfo[_user].fileNameRequest[i]) == keccak256(_fileName)) {
                _index = i;
                break;
            }
        }
        userInfo[_user].fileNameAccess.push(userInfo[_user].fileNameRequest[_index]);
        userInfo[_user].fileNameRequest[_index] = userInfo[_user].fileNameRequest[userInfo[_user].fileNameRequest.length - 1];
        userInfo[_user].totalPriority -= userInfo[_user].priority[_index];
        userInfo[_user].priority[_index] = userInfo[_user].priority[userInfo[_user].priority.length - 1];
        userInfo[_user].fileNameRequest.length --;
        numberOfRequests--;
    }

    function revoke(address _user, string _fileName) public {
        require(msg.sender == owner);
        require(_user != address(0));
        require(bytes(_fileName).length > 0);

        uint256 _index = 0;
        for(uint256 i = 0; i < userInfo[_user].fileNameAccess.length; i++) {
            if(keccak256(userInfo[_user].fileNameAccess[i]) == keccak256(_fileName)) {
                _index = i;
                break;
            }
        }
        userInfo[_user].fileNameAccess[_index] = userInfo[_user].fileNameAccess[userInfo[_user].fileNameAccess.length - 1];
        userInfo[_user].fileNameAccess.length --;
    }
}
