<template>
  <v-app>
    <Menu />
    <v-content>
      <!-- <v-container class="fill-height" fluid> -->
      <v-container fluid class="pa-3">
        <router-view/>
      </v-container>
      
    </v-content>
    <Footer />
  </v-app>
</template>

<script>
import Menu from './components/Menu'
import Footer from './components/Footer'
  export default {
    components: {
        Menu,
        Footer
    },
    
    created(){
      this.$store.dispatch("autoLogin");
    }
  }
</script>
