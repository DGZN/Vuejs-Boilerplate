<template>
  <div class="ui very padded text segment">
    <div class="ui one column grid">
      <div class="ui padded segment column">
        <h3 class="ui header">{{ asset.title }}</h3>
        <div class="desc">
          {{ asset.description }}
        </div>
      </div>
    </div>
    <div class="ui five column grid">
      <div class="row">
          <div class="ui column padded segment">
            <h4 class="ui  header">Cast</h4>
            <table class="ui compact small table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Character</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="person in asset.cast">
                  <td>
                    {{ person.name }}
                  </td>
                  <td>
                    {{ person.character }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="ui column padded segment">
            <h4 class="ui header">Crew</h4>
            <table class="ui compact small table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Roles</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="person in asset.crew">
                  <td>
                    {{ person.name }}
                  </td>
                  <td>
                    {{ roles(person.roles) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      guid: this.$route.params.guid,
      asset: {
        images: [{
          url: ''
        }]
      }
    }
  },

  created () {
    $.get('http://api.prysm.giantdev.com:3333/api/v1/feed', (assets) => {
      this.assets = assets;
      var matched = '';
      assets.map((asset) => {
        if (asset.guid == this.guid)
          this.asset = asset;
      })
    })

  },

  methods: {
    roles: (roles) => {
      return roles.join(' / ')
    }
  }

}

$(document).ready(function(){

})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.item {
  cursor: pointer;
}


</style>
