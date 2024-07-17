// SPDX-License-Identifier: GPL-3.0
//run this contract on remix IDE online at https://remix.ethereum.org/
pragma solidity ^0.8.0;

contract Certificate {

    struct Cert {
        address issuer;
        address recipient;
        string certId;
        uint256 issueDate;
        string certHash; // Store hash of the certificate content
    }

    mapping(string => Cert) public certificates;

    event CertificateIssued(address indexed issuer, address indexed recipient, string certId);
    event CertificateRevoked(address indexed issuer, string certId); // New event for revocation

    modifier onlyIssuer(string memory certId) {
        require(certificates[certId].issuer == msg.sender, "Only the issuer can modify this certificate");
        _;
    }

    function issueCertificate(address recipient, string memory certId, string memory certHash) public {
        require(certificates[certId].recipient == address(0), "Certificate ID already exists");
        certificates[certId] = Cert(msg.sender, recipient, certId, block.timestamp, certHash);
        emit CertificateIssued(msg.sender, recipient, certId);
    }

    function verifyCertificate(string memory certId) public view returns (bool isValid, address issuer, uint256 issueDate) {
        Cert memory cert = certificates[certId];
        isValid = cert.recipient != address(0);
        issuer = cert.issuer;
        issueDate = cert.issueDate;
    }

    function revokeCertificate(string memory certId) public onlyIssuer(certId) {
        delete certificates[certId];
        emit CertificateRevoked(msg.sender, certId);
    }

    function getCertificateHash(string memory certId) public view returns (string memory) {
        return certificates[certId].certHash;
    }
}
