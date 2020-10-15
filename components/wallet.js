Vue.component('card-wallet', {
  props: ['wallet'],
  template: `
    <div class="card">
      <div class="card-image">
        <figure class="image is-4by3">
          <img src="https://bitcoinaddict.org/wp-content/uploads/2020/08/Ethereum-News-about-staking-in-ETH-2.0.jpg" alt="Placeholder image">
        </figure>
      </div>
      <div class="card-content">
        <div class="media">
          <div class="media-left">
            <figure class="image is-48x48">
              <img src="https://bitcoinaddict.org/wp-content/uploads/2020/08/Ethereum-News-about-staking-in-ETH-2.0.jpg" alt="Placeholder image">
            </figure>
          </div>
          <div class="media-content">
            <p class="title is-4">Ethereum</p>
            <p class="subtitle is-6">@ethereum</p>
          </div>
        </div>

        <div class="content">
          <div>Address: <a style="font-size:10px;">{{wallet.address}} </a>   </div>
          <div>Balance: <a >{{(wallet.balance.eth)}} ETH</a></div>
        </div>
      </div>
  </div>
  `
})