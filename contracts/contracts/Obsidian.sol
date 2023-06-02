// SPDX-License-Identifier: MIT

pragma solidity ^0.7.6;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "./IObsidianHookReceiver.sol";


contract Obsidian is Ownable {
    /// @dev Placeholder address used to identify transfer of native ETH
    address internal constant ETH_TOKEN_PLACHOLDER = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    /// @notice An ETH amount that must be sent alongside each payment; used as an anti-spam measure
    uint256 public toll;

    /// @notice A privileged address, set by the admin, that can sweep all collected ETH tolls
    address public tollCollector;

    /// @notice The address where ETH funds are sent when collected by the tollCollector
    address payable public tollReceiver;

    /// @notice Token payments pending withdrawal; stealth address => token address => amount
    mapping(address => mapping(address => uint256)) public tokenPayments;

    mapping(uint64 => Announcement) public announcements;
    uint64 public announcementsCounter;

    event TokenWithdrawal(
        address indexed receiver, // stealth address
        address indexed acceptor, // destination of funds
        uint256 amount, // funds
        address indexed token // token address
    );

    struct Announcement {
        address from;
        address receiver;   // stealth address
        uint256 amount;     // funds
        address token;      // token address or ETH placeholder
        bytes32 pkx;        // ephemeral public key x coordinate
        bytes32 ciphertext; // encrypted entropy and payload extension
        uint256 timestamp;
    }


    /**
     * @param _toll Amount of ETH required per send
     * @param _tollCollector Address that can sweep collected funds
     * @param _tollReceiver Address that receives collected funds
     */
    constructor(
        uint256 _toll,
        address _tollCollector,
        address payable _tollReceiver
    ) {
        toll = _toll;
        tollCollector = _tollCollector;
        tollReceiver = _tollReceiver;
    }


    /**
     * @notice Admin only function to update the toll
     * @param _newToll New ETH toll in wei
     */
    function setToll(uint256 _newToll) external onlyOwner {
        toll = _newToll;
    }


    /**
     * @notice Admin only function to update the toll collector
     * @param _newTollCollector New address which has fund sweeping privileges
     */
    function setTollCollector(address _newTollCollector) external onlyOwner {
        tollCollector = _newTollCollector;
    }


    /**
     * @notice Admin only function to update the toll receiver
     * @param _newTollReceiver New address which receives collected funds
     */
    function setTollReceiver(address payable _newTollReceiver) external onlyOwner {
        tollReceiver = _newTollReceiver;
    }


    /**
     * @notice Function only the toll collector can call to sweep funds to the toll receiver
     */
    function collectTolls() external {
        require(msg.sender == tollCollector, "Obsidian: Not toll collector");
        tollReceiver.transfer(address(this).balance);
    }


    // ======================================= Send =================================================

    /**
     * @notice Send and announce ETH payment to a stealth address
     * @param _receiver Stealth address receiving the payment
     * @param _tollCommitment Exact toll the sender is paying; should equal contract toll;
     * the committment is used to prevent frontrunning attacks by the owner;
     * @param _pkx X-coordinate of the ephemeral public key used to encrypt the payload
     * @param _ciphertext Encrypted entropy (used to generated the stealth address) and payload extension
     */
    function sendEth(
        address payable _receiver,
        uint256 _tollCommitment,
        bytes32 _pkx, // ephemeral public key x coordinate
        bytes32 _ciphertext
    ) external payable {
        require(_tollCommitment == toll, "Obsidian: Invalid or outdated toll commitment");

        // also protects from underflow
        require(msg.value > toll, "Obsidian: Must pay more than the toll");

        uint256 amount = msg.value - toll;
        announcements[announcementsCounter++] = Announcement(
            msg.sender,
            _receiver,
            amount,
            ETH_TOKEN_PLACHOLDER,
            _pkx,
            _ciphertext,
            block.timestamp
        );

        _receiver.transfer(amount);
    }


    // ======================================= Withdraw =============================================

    /**
     * @notice Withdraw an ERC20 token payment sent to a stealth address
     * @dev This method must be directly called by the stealth address
     * @param _acceptor Address where withdrawn funds should be sent
     * @param _tokenAddr Address of the ERC20 token being withdrawn
     */
    function withdrawToken(address _acceptor, address _tokenAddr) external {
        _withdrawTokenInternal(msg.sender, _acceptor, _tokenAddr, address(0), 0, IObsidianHookReceiver(0), "");
    }


    /**
     * @notice Low level withdrawal function that should only be called after safety checks
     * @param _stealthAddr The stealth address whose token balance will be withdrawn
     * @param _acceptor Address where withdrawn funds should be sent
     * @param _tokenAddr Address of the ERC20 token being withdrawn
     * @param _sponsor Address which is compensated for submitting the withdrawal tx
     * @param _sponsorFee Amount of the token to pay to the sponsor
     * @param _hook Contract that will be called after the token withdrawal has completed
     * @param _data Arbitrary data that will be passed to the post-withdraw hook contract
     */
    function _withdrawTokenInternal(
        address _stealthAddr,
        address _acceptor,
        address _tokenAddr,
        address _sponsor,
        uint256 _sponsorFee,
        IObsidianHookReceiver _hook,
        bytes memory _data
    ) internal {
        uint256 _amount = tokenPayments[_stealthAddr][_tokenAddr];

        // also protects from underflow
        require(_amount > _sponsorFee, "Obsidian: No balance to withdraw or fee exceeds balance");

        uint256 _withdrawalAmount = _amount - _sponsorFee;
        delete tokenPayments[_stealthAddr][_tokenAddr];
        emit TokenWithdrawal(_stealthAddr, _acceptor, _withdrawalAmount, _tokenAddr);

        SafeERC20.safeTransfer(IERC20(_tokenAddr), _acceptor, _withdrawalAmount);

        if (_sponsorFee > 0) {
            SafeERC20.safeTransfer(IERC20(_tokenAddr), _sponsor, _sponsorFee);
        }

        if (address(_hook) != address(0)) {
            _hook.tokensWithdrawn(_withdrawalAmount, _stealthAddr, _acceptor, _tokenAddr, _sponsor, _sponsorFee, _data);
        }
    }
}
