<template>
  <div class="ui very padded text segment">
    <table class="ui compact selectable table">
      <thead v-show="false">
        <tr>
          <th>Name</th>
          <th>Status</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="asset in assets">
          <td>
            <img :src="thumb(asset.images)" alt="" />
          </td>
          <td>
            <router-link :to="{ path: '/content/' + asset.guid }" class="item" active-class="active" >
                <h1 class="ui header">
                  {{asset.title}}
                </h1>
            </router-link>
            <div class="description">
              <h2>
                {{asset.description}}
              </h2>
            </div>
          </td>
          <td>
            <h3 class="ui header">
              {{runtime(asset.runtime)}}
            </h3>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th>3 Live</th>
          <th colspan="2">2 Pending</th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      assets: []
    }
  },
  created: function () {
    $.get('http://api.prysm.giantdev.com:3333/api/v1/feed', (assets) => {
      this.assets = assets;
    })
  },
  methods: {
    thumb: function (images) {
      var url = images[0].url;
      images.map((image) => {
        if (image.size
            && image.size == 'small')
        url = image.url;
      })
      return url;
    },
    runtime: function (seconds) {
      return Math.floor(seconds / 60) + ' mins';
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
tr > td {
  cursor: pointer;
}

h1 {
  font-size: 1.3rem !important;
  font-weight: 200 !important;
}

h2 {
  font-size: 1.2rem !important;
  font-weight: 200 !important;
}

h3 {
  font-size: 1.2rem !important;
  font-weight: 200 !important;
}

.description {
  max-width: 55%;
}
</style>
