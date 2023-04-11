pragma solidity ^0.5.0;

contract MobileAdder{
    
    struct Mobile{
        uint id;
        string name;
        uint price;
    }

    event phoneAdded(
        uint id,
        string name,
        uint price
    );

    uint public phonecount;

    mapping(uint => Mobile) public phone;

    function addMobile(string memory _name, uint _price) public {
        phonecount++;
        phone[phonecount] = Mobile(phonecount, _name, _price);
        emit phoneAdded(phonecount, _name, _price);
    }
    function removeMobile(uint _id) public {
        require(phonecount >= 1);
        delete phone[_id];
        phonecount--;

        // update the id of each phone after the removed phone
        for (uint i = _id + 1; i <= phonecount + 1; i++) {
            phone[i - 1] = phone[i];
            phone[i - 1].id--;
        }
    }
}