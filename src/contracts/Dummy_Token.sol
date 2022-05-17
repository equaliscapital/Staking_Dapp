// SPDX-License-Identifier: MIT
pragma solidity >=0.4.17 <0.9.0;

contract Dummy_Token{
    
    string public name = "dummy token";
    string public symbol = "DumToken";
    uint public totalsupply = 1000000000000000000000000;
    uint public decimal = 18;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint _value
    );

    event Approve(
        address indexed _owner,
        address indexed _spender,
        uint _value
    );

    mapping(address => uint256) public balance;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor() {
        balance[msg.sender] = totalsupply;
    }

    function transfer(address _to, uint256 _value) public returns(bool){
        require(balance[msg.sender] >= _value);
        balance[msg.sender] -= _value;
        balance[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns(bool){
        allowance[msg.sender][_spender] = _value;
        emit Approve(msg.sender, _spender, _value);
        return true;
    }

    function transferfrom(address _from, address _to, uint256 _value) public returns(bool){
        require(balance[_from] >= _value);
        require(_value <= allowance[_from][msg.sender]);
        allowance[_from][msg.sender] -= _value;
        balance[_from] -= _value;
        balance[_to] += _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

}