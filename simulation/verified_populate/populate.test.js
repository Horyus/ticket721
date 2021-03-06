//describe("SimpleStorage", function() {
//  this.timeout(0);
//  before(function(done) {
//    this.timeout(0);
//    var contractsConfig = {
//      "SimpleStorage": {
//        args: [100]
//      }
//    };
//    EmbarkSpec.deployAll(contractsConfig, () => { done() });
//  });
//
//  it("should set constructor value", async function() {
//    let result = await SimpleStorage.methods.storedData().call();
//    assert.equal(result, 100);
//  });
//
//  it("set storage value", async function() {
//    await SimpleStorage.methods.set(150).send();
//    let result = await SimpleStorage.methods.get().call();
//    assert.equal(result, 150);
//  });
//
//});

const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'});

const Ticket721HUBInfos = require(process.env.DIST_PATH + "/contracts/Ticket721Hub.json");
const Ticket721VerifiedAccountsInfos = require(process.env.DIST_PATH + "/contracts/Ticket721VerifiedAccounts");
const Ticket721Event = require(process.env.DIST_PATH + "/contracts/Ticket721Event");
const Ticket721 = require(process.env.DIST_PATH + "/contracts/Ticket721");
const _Web3 = require("web3");
const Web3 = new _Web3(new _Web3.providers.HttpProvider(process.env.BC_URL || "http://localhost:8545"));

const Fs = require("fs");

let Ticket721HUB;
let Ticket721VerifiedAccounts;
let Ticket721Verified;
let Ticket721VerifiedAddress;
let accounts;

let manifest = [];

describe("Register Accounts as verified users", () => {

    it("Loads Ticket721HUB", async (done) => {
        try {
            Ticket721HUB = new Web3.eth.Contract(Ticket721HUBInfos.abiDefinition, Ticket721HUBInfos.deployedAddress);
            Ticket721HUB.setProvider(Web3.currentProvider);

            const AccountManagerAddress = await Ticket721HUB.methods.account_manager().call();
            Ticket721VerifiedAccounts = new Web3.eth.Contract(Ticket721VerifiedAccountsInfos.abiDefinition, AccountManagerAddress);

            accounts = await Web3.eth.getAccounts();

            Ticket721VerifiedAddress = await Ticket721HUB.methods.verified_ticket_registries(0).call({from: accounts[0]});
            console.log('Ticket721VerifiedAddress', Ticket721VerifiedAddress);
            Ticket721Verified = new Web3.eth.Contract(Ticket721.abiDefinition, Ticket721VerifiedAddress);

            done();
        } catch (e) {
            console.log(e);
            done(e);
        }
    }, 50000);

    it("Add account #2 as verified identity", async (done) => {
        try {
            await Ticket721VerifiedAccounts.methods.registerProfile("NumberOne").send({from: accounts[1]});
            await Ticket721VerifiedAccounts.methods.validateProfile(accounts[1]).send({from: accounts[0]});
            done();
        } catch (e) {
            done(e);
        }
    }, 60000);

    it("Add account #3 as verified identity", async (done) => {

        try {
            await Ticket721VerifiedAccounts.methods.registerProfile("NumberTwo").send({from: accounts[2]});
            await Ticket721VerifiedAccounts.methods.validateProfile(accounts[2]).send({from: accounts[0]});
            done();
        } catch (e) {
            done(e);
        }
    }, 60000);

    const runSale = (id, account, idx, done) => {
        try {
            const config = require("./" + id + "/infos.json");
            const image = Fs.readFileSync("./verified_populate/" + id + "/" + config.image);
            ipfs.files.add(image).then(res => {
                const ipfs_image = res[0].hash;
                console.log(":: " + ipfs_image);
                const deploy = new Buffer(JSON.stringify({
                    name: config.name,
                    description: config.description,
                    image: "https://ipfs.infura.io/ipfs/" + ipfs_image,
                    longitude: config.longitude,
                    latitude: config.latitude
                }, null, 4));
                ipfs.files.add(deploy).then(_res => {
                    const infos = "https://ipfs.infura.io/ipfs/" + _res[0].hash;
                    console.log(":: " + infos);

                    const Ticket721EventWeb3 = new Web3.eth.Contract(Ticket721Event.abiDefinition);

                    const sale_end = new Date();
                    sale_end.setDate(sale_end.getDate() + 5);
                    const event_begin = new Date();
                    event_begin.setDate(event_begin.getDate() + 6);
                    const event_end = new Date();
                    event_end.setDate(event_end.getDate() + 7);

                    Ticket721EventWeb3
                        .deploy({
                            data: Ticket721Event.code,
                            arguments: [
                                Ticket721VerifiedAddress,
                                config.cap,
                                config.price,
                                infos,
                                config.name,
                                Math.floor(sale_end.getTime() / 1000),
                                Math.floor(event_begin.getTime() / 1000),
                                Math.floor(event_end.getTime() / 1000)
                            ]
                        })
                        .send({
                            from: accounts[account],
                            gas: 6000000
                        })
                        .on('error', console.error)
                        .then(instance => {
                            Ticket721HUB.methods.registerController(instance.options.address).send({from: accounts[account], gas: 2000000}).then(_ => {
                                instance.methods.register().send({from: accounts[account], gas: 2000000}).then(_ => {
                                    done();
                                }).catch(done);
                            });
                        })
                        .catch(done);
                }).catch(done);
            }).catch(done);
        } catch (e) {
            done(e);
        }
    };

    it("Should run an Event as #2", runSale.bind(null, "T721UTR2018", 1, 0), 500000);
    it("Should run an Event as #2", runSale.bind(null, "T721ETR2018", 1, 1), 500000);
    it("Should run an Event as #2", runSale.bind(null, "T721ETR2019", 1, 2), 500000);
    it("Should run an Event as #2", runSale.bind(null, "T721UTT", 1, 3), 500000);

});
