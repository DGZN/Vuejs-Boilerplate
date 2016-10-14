<template>
  <div class="app">
    <div class="ui fluid container">
      <div class="ui padded menu">
        <router-link to="/" class="item" active-class="active" exact>
            Dashboard
        </router-link>
        <router-link to="/content" class="item" active-class="active" exact>
          Content
        </router-link>
        <router-link to="/users" class="item" active-class="active" exact>
          Users
        </router-link>
      </div>
    </div>
    <div class="ui fluid container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

export default {
  components: {
    
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Slabo+27px&subset=latin-ext');
</style>

<style>

html {
  height: 100%;
}

body {
  height: 100%;
  background-color: #75A3D1 !important;
}

/* Navbar Menu CSS */

.ui.menu .item > i.icon {
  margin: 0em !important;
}

</style>
