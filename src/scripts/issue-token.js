const Staking_Dapp = artifacts.require('Staking_Dapp')

module.exports =  async function(callback){

    let stakingdapp = await Staking_Dapp.deployed()
    await stakingdapp.issuedummy()

    console.log("dummy tokens issued")
    callback()

}