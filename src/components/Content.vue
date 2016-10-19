<template>
  <div class="ui very padded text segment">
    <table class="ui table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Meta</th>
          <th>Category</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="asset in assets" class="top aligned" @click="routeTo(asset.guid)">
          <td>
            <img :src="thumb(asset.images)" alt="" />
          </td>
          <td>
            <h1 class="ui header">
              {{asset.title}}
            </h1>
            <div class="description">
              <h2>
                {{asset.description}}
              </h2>
            </div>
            <h3 class="ui header">
              {{runtime(asset.runtime)}}
              <a class="ui right label">
                {{ asset.genres[0].name }}
              </a
            </h3>
          </td>
          <td>
            {{ asset.genres[0].name }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th></th>
          <th colspan="2"></th>
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
    $.get('http://api.prysm.giantdev.com:3333/api/v1/assets', (assets) => {
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
      return Math.floor(seconds / 60) + ' Mins';
    },
    routeTo: function (guid) {
      this.$router.push({ path: '/content/' + guid })
    }
  }
}
</script>

<style scoped>
tr {
  position: relative;
  vertical-align: top;
}
tr > td {
  cursor: pointer;
}

h1 {
  margin: 0.5rem 0 0.4rem 0 !important;
  font-size: 1.6rem !important;
  font-weight: 300 !important;
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
