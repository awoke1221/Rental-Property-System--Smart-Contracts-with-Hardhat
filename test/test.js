// Import Chai assertion library
const { expect } = require('chai');

// Describe the contract test suite
describe('RentalPropertySystem', function () {
  let rentalPropertySystem;
  let owner;
  let tenant;

  // Deploy the contract before each test
  beforeEach(async function () {
    const RentalPropertySystem = await ethers.getContractFactory('RentalPropertySystem');
    rentalPropertySystem = await RentalPropertySystem.deploy();
    await rentalPropertySystem.deployed();

    [owner, tenant] = await ethers.getSigners(); // Get different signers for owner and tenant
  });

  // Test case 1
  it('should add a new property', async function () {
    // Add a new property
    const propertyName = 'Property 1';
    const propertyPrice = ethers.utils.parseEther('1');
    await rentalPropertySystem.addProperty(propertyName, propertyPrice);

    // Get the added property
    const property = await rentalPropertySystem.properties(1);

    // Assert the property details
    expect(property.id).to.equal(1);
    expect(property.name).to.equal(propertyName);
    expect(property.owner).to.equal(owner.address);
    expect(property.price).to.equal(propertyPrice);
    expect(property.status).to.equal(0); // PropertyStatus.Available
    expect(property.tenant).to.equal('0x0000000000000000000000000000000000000000');
  });

  // Test case 2
  it('should rent a property', async function () {
    // Add a new property
    const propertyName = 'Property 1';
    const propertyPrice = ethers.utils.parseEther('1');
    await rentalPropertySystem.addProperty(propertyName, propertyPrice);

    // Rent the property
    await rentalPropertySystem.connect(tenant).rentProperty(1, { value: propertyPrice });

    // Get the rented property
    const property = await rentalPropertySystem.properties(1);

    // Assert the property status and tenant
    expect(property.status).to.equal(1); // PropertyStatus.Rented
    expect(property.tenant).to.equal(tenant.address);
  });

  // Test case 3
  it('should return a property', async function () {
    // Add a new property
    const propertyName = 'Property 1';
    const propertyPrice = ethers.utils.parseEther('1');
    await rentalPropertySystem.addProperty(propertyName, propertyPrice);

    // Rent the property
    await rentalPropertySystem.connect(tenant).rentProperty(1, { value: propertyPrice });

    // Return the property
    await rentalPropertySystem.connect(tenant).returnProperty(1);

    // Get the returned property
    const property = await rentalPropertySystem.properties(1);

    // Assert the property status and tenant
    expect(property.status).to.equal(0); // PropertyStatus.Available
    expect(property.tenant).to.equal('0x0000000000000000000000000000000000000000');
  });
});