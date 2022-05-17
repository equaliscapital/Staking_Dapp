// SPDX-License-Identifier: MIT
pragma solidity >=0.4.17 <0.9.0;

import "./Dummy_Token.sol";
import "./Tether_Token.sol";

contract Staking_Dapp{

    string public name = "Staking Dapp";
    address public owner;
    Dummy_Token public dummy_token;
    Tether_Token public tether_token;

    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasstaked;
    mapping(address => bool) public isstaking;

    constructor(Dummy_Token _dummyToken, Tether_Token _tetherToken) {
        dummy_token = _dummyToken;
        tether_token = _tetherToken;
        owner = msg.sender;
    }

    function stakeTokens(uint _amount) public{
        require(_amount > 0, "amount cannot be zero");
        tether_token.transferfrom(msg.sender, address(this), _amount);
        stakingBalance[msg.sender] += _amount;
        if(!hasstaked[msg.sender]){
            stakers.push(msg.sender);
        }
        isstaking[msg.sender] = true;
        hasstaked[msg.sender] = true;
    }

    function unstakeTokens() public{
        uint balance = stakingBalance[msg.sender];
        require(balance > 0, "staking balance is zero");
        tether_token.transfer(msg.sender, balance);
        stakingBalance[msg.sender] = 0;
        isstaking[msg.sender] = false;
    }

    function issuedummy() public{
        require(msg.sender == owner, "caller must be the owner for this function");
        for(uint i = 0; i<stakers.length; i++){
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if(balance > 0){
                dummy_token.transfer(recipient, balance);
            }
        }
    }

}