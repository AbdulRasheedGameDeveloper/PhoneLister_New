App = {
    load: async () => {
      await App.loadWeb3()
      await App.loadAccount()
      await App.loadContract()
      await App.render()
    },
  
    loadWeb3: async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        App.web3Provider = window.ethereum
        window.web3 = new Web3(window.ethereum)
        try {
          // Request account access
          await window.ethereum.enable()
        } catch (error) {
          // User denied account access...
          console.error("User denied account access")
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = window.web3.currentProvider
        window.web3 = new Web3(window.web3.currentProvider)
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    },
  
    loadAccount: async () => {
      const accounts = await window.web3.eth.getAccounts()
      App.account = accounts[0]
    },
  
    loadContract: async () => {
      const mobileAdder = await $.getJSON('MobileAdder.json')
      App.contracts = {}
      App.contracts.MobileAdder = TruffleContract(mobileAdder)
      App.contracts.MobileAdder.setProvider(App.web3Provider)
  
      App.mobileAdder = await App.contracts.MobileAdder.deployed()
    },

    
    render: async () => {
      if (App.loading) {
        return
      }

      App.setLoading(true)

      $('#account').html(App.account)

      await App.renderPhone()

      App.setLoading(false)
    },

    renderPhone: async () => {
      const phonecount = await App.mobileAdder.phonecount()
      const $mobileTemplate = $('.mobileTemplate')
  
      for (var i = 1; i <= phonecount; i++){
        const phone = await App.mobileAdder.phone(i)
        const phoneId = phone[0].toNumber()
        const phoneContent = phone[1]
        const phonePrice = phone[2].toNumber()

        console.log(phonePrice)
  
        const $newMobileTemplate = $mobileTemplate.clone()
        $newMobileTemplate.find('.phoneno').html("Phone no: " + phoneId)
        $newMobileTemplate.find('.content').html("Name of the Phone: " + phoneContent)
        $newMobileTemplate.find('.price').html("Price of the Phone: " + phonePrice)
//        $newMobileTemplate.find('input')
//                      .prop('name', phoneId)
  
          $('#mobilelist').append($newMobileTemplate)
  
        $newMobileTemplate.show()
      }
    },
  
    addMobile: async () => {
      event.preventDefault();
      App.setLoading(true)
      const content = $('#newmobile').val()
      const price = $('#mobileprice').val()
      if (App.mobileAdder) {
        await App.mobileAdder.addMobile(content, price, { from: App.account })
        window.location.reload()
      } else {
        console.error("MobileAdder contract not loaded.")
        App.setLoading(false)
      }
    },

    clearPhone: async () => {
      event.preventDefault();
      console.log("Called");
      if (App.mobileAdder) {
        const mobileId = $('#mobileId').val();
        console.log(mobileId);
        await App.mobileAdder.removeMobile(mobileId, { from: App.account });
        window.location.reload()
      } else {
        console.error("MobileAdder contract not loaded.");
        App.setLoading(false);
      }
    },

    showphonecount: async () => {
      event.preventDefault();
      const phoneCount = await App.mobileAdder.phonecount()
      const phonecounttonumber = phoneCount.toNumber()
      console.log(phonecounttonumber)
      const $showphonecount = $('.showphonecount')
      $showphonecount.find(".phonecount").html("Total Number of Phone: " + phonecounttonumber)
    },
  
  
    setLoading: (boolean) => {
      App.loading = boolean
      const loader = $('#loader')
      const content = $('#content')
      if (boolean) {
        loader.show()
        content.hide()
      } else {
        loader.hide()
        content.show()
      }
    }
  }
  
  $(() => {
    $(window).on('load', () => {
      App.load()
    })
  })
  