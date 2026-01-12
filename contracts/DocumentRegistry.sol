// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract DocumentRegistry {

    struct DocumentMetadata {
        string documentHash; // SHA-256 hash of the document content
        string ipfsCid;      // IPFS Content Identifier (storage pointer)
        string fileName;
        string patientId;    // Using string for simplicity, could be address or bytes32
        uint256 timestamp;
        address owner;       // Address that added the record
    }

    // Mapping from document hash to its metadata
    mapping(string => DocumentMetadata) private documents;
    // Mapping from patientId to an array of their document hashes
    mapping(string => string[]) private patientDocuments;
    // Keep track of existing hashes to prevent duplicates easily
    mapping(string => bool) private documentHashExists;

    event DocumentAdded(
        string indexed documentHash,
        string indexed patientId,
        string ipfsCid,
        string fileName,
        uint256 timestamp
    );

    // Modifier to restrict access (optional, can be expanded)
    modifier onlyServer() {
        // For now, allow any address (replace with proper access control later)
        _;
    }

    /**
     * @dev Adds metadata of a new document to the registry.
     * Enforces uniqueness based on the document hash.
     */
    function addDocument(
        string memory _documentHash,
        string memory _patientId,
        string memory _ipfsCid,
        string memory _fileName
    ) public onlyServer {
        require(!documentHashExists[_documentHash], "Document hash already exists.");

        uint256 currentTime = block.timestamp;

        documents[_documentHash] = DocumentMetadata({
            documentHash: _documentHash,
            ipfsCid: _ipfsCid,
            fileName: _fileName,
            patientId: _patientId,
            timestamp: currentTime,
            owner: msg.sender
        });

        patientDocuments[_patientId].push(_documentHash);
        documentHashExists[_documentHash] = true;

        emit DocumentAdded(_documentHash, _patientId, _ipfsCid, _fileName, currentTime);
    }

    /**
     * @dev Retrieves metadata for a specific document hash.
     */
    function getDocument(string memory _documentHash) public view returns (DocumentMetadata memory) {
        require(documentHashExists[_documentHash], "Document hash does not exist.");
        return documents[_documentHash];
    }

     /**
     * @dev Retrieves all document hashes associated with a patientId.
     */
    function getDocumentHashesByPatient(string memory _patientId) public view returns (string[] memory) {
        return patientDocuments[_patientId];
    }

    /**
     * @dev Retrieves metadata for all documents associated with a patientId.
     * Note: This can be gas-intensive if a patient has many documents.
     */
    function getAllDocumentsByPatient(string memory _patientId) public view returns (DocumentMetadata[] memory) {
        string[] memory hashes = patientDocuments[_patientId];
        DocumentMetadata[] memory results = new DocumentMetadata[](hashes.length);

        for (uint i = 0; i < hashes.length; i++) {
            results[i] = documents[hashes[i]];
        }

        return results;
    }
}