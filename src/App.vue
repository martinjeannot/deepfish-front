<template>
  <v-app v-if="appCreated">
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
        <v-list-tile v-if="userIsAuthenticated" @click="logout">
          <v-list-tile-action>
            <v-icon>power_settings_new</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Sign out</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app>
      <v-toolbar-side-icon @click="showSideNav = !showSideNav" class="hidden-sm-and-up"></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link :to="menuItems[0].route">
          <img src="static/header_logo.png" alt="Deepfish"/>
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="menuItem in menuItems" :key="menuItem.title" router :to="menuItem.route" exact>
          <v-icon left>{{ menuItem.icon }}</v-icon>
          {{ menuItem.title }}
        </v-btn>
        <v-btn flat v-if="userIsAuthenticated" @click="logout">
          <v-icon left>power_settings_new</v-icon>
          Sign out
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
    <v-footer app class="pa-3">
      <v-spacer></v-spacer>
      <div>Copyright &copy; {{ new Date().getFullYear() }} Deepfish</div>
    </v-footer>
  </v-app>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    data: () => ({
      showSideNav: false,
    }),
    computed: {
      ...mapGetters([
        'appCreated',
        'user',
      ]),
      userIsAuthenticated() {
        return this.user !== null && this.user !== undefined;
      },
      userIsTalent() {
        return this.user.authorities.some(authority => authority.authority === 'ROLE_TALENT');
      },
      menuItems() {
        let menuItems = [
          { icon: 'power_settings_new', title: 'Sign in', route: '/' },
          { icon: 'exit_to_app', title: 'Sign up', route: '/sign-up' },
        ];
        if (this.userIsAuthenticated) {
          if (this.userIsTalent) {
            menuItems = [
              { icon: 'speaker_notes', title: 'Conditions', route: '/talent/conditions' },
              { icon: 'account_circle', title: 'Profil', route: '/talent/profile' },
            ];
          } else {
            menuItems = [
              { icon: 'dashboard', title: 'Dashboard', route: '/employer' },
              { icon: 'dashboard', title: 'Mes besoins', route: '/employer/requirements' },
            ];
          }
        }
        return menuItems;
      },
    },
    methods: {
      logout() {
        this.$store.dispatch('logout');
        this.$router.push('/');
      },
    },
  };
</script>
