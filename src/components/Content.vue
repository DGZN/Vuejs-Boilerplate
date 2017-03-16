<template>
  <div class="">
    <div id="filter-panel" class="ui segment">
      <div class="ui transparent icon search small input">
        <input id="search" type="text" placeholder="Search...">
      </div>
      <div class="ui text right aligned filter ">
        <select name="genreDropdown" multiple="" class="ui genres multiple selection tiny dropdown">
          <option v-for="genre in genres" :value="genre.name">{{ genre.name }}</option>
        </select>
        <div class="view icons">
          <i v-show="view == 'table'" @click="panelView()" class="ui browser icon"></i>
          <i v-show="view == 'panel'" @click="tableView()" class="ui tasks icon"></i>
        </div>
      </div>
    </div>
    <div v-show="view == 'table'" class="ui padded text segment">
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
                </a>
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
    <div v-show="view == 'panel'" class="ui padded text segment">
      <div class="ui doubling cards">
        <router-link :to="'/content/' + asset.guid" class="ui centered raised card" v-for="asset in orderedAssets" v-show="match(asset.title)">
          <div class="image">
            <img :src="thumb(asset.images)">
          </div>
          <div class="content">
            <a class="header">{{ asset.title }}</a>
            <div class="meta">
              <span class="date">{{ runtime(asset.runtime) }}</span>
            </div>
            <div class="description">
            </div>
          </div>
          <div class="extra content">
            <a>
              {{ listGenres(asset.genres) }}
            </a>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {

    props: ['settings'],

    data () {
      return {
        view: 'panel',
        keyword: '',
        filter: {
          genres: []
        },
        assets: []
      }
    },
    computed: {
      orderedAssets: function () {
        var assets = this.assets.sort((a, b) => {
          return a.orderPriority - b.orderPriority;
        })
        if (this.filter.genres.length==0) {
          return assets;
        } else {
          var assets = [];
          var filters = this.filter.genres;
          this.assets.filter((asset) => {
            asset.genres.map((genre) => {
              if (filters.indexOf(genre.name)>=0) {
                assets.push(asset)
              }
            })
          })
          return assets.sort((a, b) => {
            return a.orderPriority - b.orderPriority;
          })
        }
      },
      genres: function () {
        var sorted = [];
        var genres = [];
        this.assets.map((asset) => {
          asset.genres.map((genre) => {
            if (sorted.indexOf(genre.name)==-1) {
              sorted.push(genre.name)
              genres.push(genre)
            }
          })
        })
        return genres.sort(function(a, b){
          if(a.name < b.name) return -1;
          if(a.name > b.name) return 1;
          return 0;
        });
      },
    },
    created: function () {
      $.get(this.settings.baseURI + '/api/v1/assets', (assets) => {
        this.assets = assets;
      })
    },
    mounted: function () {
      var self = this;
      $('.ui.dropdown')
        .dropdown('set text', 'Genres')
        .dropdown({
          onAdd: (added) => {
            if (this.filter.genres.indexOf(added)==-1)
              this.filter.genres.push(added)
          },
          onRemove: (removed) => {
            var genres = this.filter.genres;
            this.filter.genres.splice(genres.indexOf(removed), 1)
          },
          onLabelCreate: function (value, text) {
            $(this).addClass('tiny')
            return $(this)
          }
        })
      ;
      $('#search')
        .bind('input', function() {
          var keyword = $(this).val()
          if ( keyword.length > 3 ) {
            self.keyword = keyword
          } else {
            self.keyword = ''
          }
        })
      ;
      function scroll(e) {
        var currentTop = $(window).scrollTop()
        if (currentTop > 47) {
          $('#filter-panel')
            .addClass('fixed menu')
            .css('opacity', '0.85')
        } else {
          $('#filter-panel')
            .removeClass('fixed menu')
            .css('opacity', '1')
        }
      }
      window.onscroll = scroll;
    },
    methods: {
      match: function (title) {
        if (this.keyword.length) {
          var match = title.toLowerCase().search(this.keyword.toLowerCase())
          if ( match == -1 )
            return false;
        }
        return true;
      },
      thumb: function (images) {
        var url = images[0].url;
        images.map((image) => {
          if (image.size
              && image.size == 'large')
          url = image.url;
        })
        return url;
      },
      runtime: function (seconds) {
        return Math.floor(seconds / 60) + ' Mins';
      },
      listGenres: function (obj) {
        var genres = [];
        obj.map((genre) => {
          genres.push(genre.name)
        })
        return genres.join(', ');
      },
      route: function (guid) {
        return '/content/' + guid
      },
      routeTo: function (guid) {
        this.$router.push({ path: '/content/' + guid })
      },
      tableView: function () {
        this.view = 'table'
      },
      panelView: function () {
        this.view = 'panel'
      }
    }
  }
</script>

<style>
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

  .icon {
    cursor: pointer;
  }

  .filter {
    position: absolute;;
    top: 0.55rem;
    right: 0rem;
    float: right;
    display: block;
  }

  .label.tiny{
    font-size: 52px !important;
  }

  .ui.label.tiny {
    font-size: 0.8em !important;
  }

  .ui.selection.dropdown {
    border: 0px !important;
    min-height: 0em !important;
  }

  .view.icons {
    position: relative;
    float: right;
    margin-top: 0.65rem;
    margin-right: 2.7rem;
    margin-left: 2rem;
  }
</style>
