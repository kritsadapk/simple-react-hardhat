//SPDX-License-Identifier: Unlicense
pragma solidity 0.7.3;

contract MyBank {
  string name;
  int balance;

  constructor(string memory _name, int _balance) {
    name = _name;
    balance = _balance;
  }

  function getAccountDetail() public view returns (string memory, int ) {
    return (
      name,
      balance
    );
  }

  function getBalance() public view returns (int){
    return balance;
  }


  function deposite (int _amount) public {
    require(_amount > 0, "Deposite must > 0");
    balance += _amount;
  }

  function withdraw(int _amount) public {
    require(_amount > 0, "Deposite must > 0");
    balance -= _amount;
  }



}