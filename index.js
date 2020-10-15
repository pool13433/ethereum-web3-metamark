new Vue({
  el: '#ethereumApp',
  data () {
    return {
      metamarkStatus: 'CONNECTION_REFUSED',
      personal: {},
      wallet: { publicAddress: '', balance: { wei: 0, eth: 0 } },
      metaTabActive: 'address',
      metaTabAction: {
        address: {
          colorClass: 'is-primary',
          text: 'Address In Blockchain Network'
        }, transaction: {
          colorClass: 'is-info',
          text: 'Sending Transaction'
        }, create: {
          colorClass: 'is-success',
          text: 'Account Created'
        }
      },
      addressReceive: [],
      transaction: {
        receive: null,
        value: 0,
        gasPrice: 100000,  //1000000000
        gas: 100000,
      },
      web3: null,
    }
  },
  watch: {
    metamarkStatus (newVal, oldVal) {
      if ('METAMARK_INSTALLED' == newVal) {
        this.getAccountInfo()
      }
    }
  },
  created () {
    const hostProvider = 'http://localhost:6545'
    console.log('Web3 Version ::==' + Web3.version)
    fetch(hostProvider).then(() => {
      if (typeof window.ethereum === 'undefined') {
        this.metamarkStatus = 'METAMARK_NOT_INSTALL'  // Matemark Not install
        //console.log('MetaMask is not install !!!')
      } else {
        this.metamarkStatus = 'METAMARK_INSTALLED'
        //console.log('MetaMask is installed!')

        try {
          const web3Provider = new Web3(
            new Web3.providers.HttpProvider(hostProvider)
            //new Web3.providers.WebsocketProvider(hostProviderSocket)
          )
          this.web3 = web3Provider
          console.log('this.web3 ::==', this.web3)
        } catch (error) {
          console.log('error ', error)
        }
      }
    }).catch((error) => {
      this.metamarkStatus = 'CONNECTION_REFUSED'
      alert('Node Network Not Avaliable !!')
    })

  },
  methods: {
    mappingBalance (receives) {
      const { utils } = this.web3
      const mapper = (receives || []).map(async (address, index) => {
        const balance = await this.web3.eth.getBalance(address)
        return {
          address,
          balance: {
            wei: balance,
            eth: utils.fromWei(balance, 'ether'),
          },
        }
      })
      console.log('mapper ::==', mapper)
      return Promise.all(mapper)
    },
    async getAccountInfo () {
      console.log('getAccountInfo ::==')
      const { utils } = this.web3
      const [
        publicAddress,
        ...receives
      ] = await this.web3.eth.getAccounts()
      console.log('publicAddress ::==', publicAddress)
      this.addressReceive = await this.mappingBalance(receives)
      if (publicAddress) {
        console.log('this.addressReceive ::==', this.addressReceive)
        //console.log('publicAddress ::==' + publicAddress);
        const balance = await this.web3.eth.getBalance(publicAddress)
        this.wallet = {
          publicAddress,
          balance: {
            wei: balance,
            eth: utils.fromWei(balance, 'ether'),
          },
        }
        console.log('this.wallet ::==' + JSON.stringify(this.wallet))
      }

    },
    resetMetamarkTransaction () {
      this.transaction = {
        receive: null,
        value: 0,
        gasPrice: 100000,
        gas: 100000,
      }
    },
    async sendingMetamarkTransaction () {
      const weiUtil = 'femtoether'
      const { utils, eth } = this.web3
      const { publicAddress } = this.wallet
      const { value, gasPrice, gas, receive } = this.transaction
      const transactionParameters = {
        value: utils.toHex(utils.toWei(value, 'ether')),
        gasPrice: utils.toHex(gasPrice), //100000
        gas: utils.toHex(gas), //100000
        nonce: '0x00', // ignored by MetaMask
        //from: publicAddress, // must match user's active address.
        from: ethereum.selectedAddress,
        to: receive, // Required except during contract publications.        
      }
      //0x0Fa5190FF566b506D299557Bf2D028BdbE4a9ac4
      console.log('transactionParameters ::==' + JSON.stringify(transactionParameters))
      //return
      try {
        //const txHash = await eth.sendTransaction(transactionParameters)
        const txHash = await ethereum.request({
          method: 'eth_sendTransaction',
          params: [transactionParameters],
        })
        if (txHash) {
          await this.getAccountInfo()
        }
      } catch (error) {
        console.log('error ::==', error)
      }
    },
    async createMetamarkAccound () {
      const { utils, eth } = this.web3
      try {
        const { password } = this.personal
        const address = await eth.personal.newAccount(password)
        console.log('privateKey ::==' + address)
        if (address) {
          alert(address + ' ถูกสร้างเรียบร้อย')
          this.getAccountInfo()
        }
      } catch (error) {
        alert('error: ' + JSON.stringify(error))
      }
    }
  },
});