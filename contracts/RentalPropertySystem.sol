// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RentalPropertySystem {
    enum PropertyStatus { Available, Rented }

    struct Property {
        uint id;
        string name;
        address owner;
        uint price;
        PropertyStatus status;
        address tenant;
    }

    mapping(uint => Property) public properties;
    uint public propertyCount;

    event PropertyAdded(uint id, string name, address owner, uint price);
    event PropertyRented(uint id, address tenant);
    event PropertyReturned(uint id);

    function addProperty(string memory _name, uint _price) external {
        propertyCount++;
        properties[propertyCount] = Property(propertyCount, _name, msg.sender, _price, PropertyStatus.Available, address(0));
        emit PropertyAdded(propertyCount, _name, msg.sender, _price);
    }

    function rentProperty(uint _id) external payable {
        require(_id > 0 && _id <= propertyCount, "Invalid property ID");
        Property storage property = properties[_id];
        require(property.status == PropertyStatus.Available, "Property is not available");
        require(msg.value >= property.price, "Insufficient payment");

        property.status = PropertyStatus.Rented;
        property.tenant = msg.sender;

        emit PropertyRented(_id, msg.sender);
    }

    function returnProperty(uint _id) external {
        require(_id > 0 && _id <= propertyCount, "Invalid property ID");
        Property storage property = properties[_id];
        require(property.status == PropertyStatus.Rented, "Property is not rented");
        require(msg.sender == property.tenant, "Only the tenant can return the property");

        property.status = PropertyStatus.Available;
        property.tenant = address(0);

        emit PropertyReturned(_id);
    }
}