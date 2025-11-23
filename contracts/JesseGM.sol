// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract JesseGM {
    mapping(address => uint256) public lastGm;
    mapping(address => uint256) public streak;

    event GMed(address indexed user, uint256 streak);

    function gm() external {
        uint256 lastGmTime = lastGm[msg.sender];
        uint256 currentStreak = streak[msg.sender];

        if (lastGmTime > 0 && block.timestamp - lastGmTime < 36 hours) {
            currentStreak++;
        } else {
            currentStreak = 1;
        }

        lastGm[msg.sender] = block.timestamp;
        streak[msg.sender] = currentStreak;

        emit GMed(msg.sender, currentStreak);
    }

    function getStreak(address user) external view returns (uint256) {
        return streak[user];
    }

    function getLastGm(address user) external view returns (uint256) {
        return lastGm[user];
    }
}
