<template>
  <v-app>
    <v-navigation-drawer app fixed temporary v-model="showSideNav">
      <v-list>
        <v-list-tile v-for="menuItem in menuItems" :key="menuItem.title" router :to="menuItem.route" exact>
          <v-list-tile-action>
            <v-icon>{{ menuItem.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ menuItem.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app>
      <v-toolbar-side-icon @click="showSideNav = !showSideNav" class="hidden-sm-and-up"></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/">
          <img src="static/header_logo.png" alt="Deepfish"/>
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="menuItem in menuItems" :key="menuItem.title" router :to="menuItem.route" exact>
          <v-icon left>{{ menuItem.icon }}</v-icon>
          {{ menuItem.title }}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      showSideNav: false,
      menuItems: [
        { icon: 'power_settings_new', title: 'Sign in', route: '/' },
        { icon: 'exit_to_app', title: 'Sign up', route: '/sign-up' },
      ],
    }),
  };
</script>
