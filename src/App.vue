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
        <v-list-tile v-if="isUserAuthenticated" @click="logout">
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
        <v-btn flat v-for="menuItem in menuItems" :key="menuItem.key" router :to="menuItem.route" exact>
          <v-badge color="red">
            <v-icon left>{{ menuItem.icon }}</v-icon>
            <span slot="badge" v-if="menuBadges[menuItem.key]">{{ menuBadges[menuItem.key] }}</span>
            {{ menuItem.title }}
          </v-badge>
        </v-btn>
        <v-btn flat v-if="isUserAuthenticated" @click="logout">
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
    <v-snackbar v-model="snackbar.show" :timeout="3500">
      {{ snackbar.text }}
    </v-snackbar>
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
        'menuBadges',
        'snackbar',
        'user',
        'isUserAuthenticated',
        'isUserAdmin',
        'isUserEmployer',
      ]),
      menuItems() {
        let menuItems = [
          { key: 'sign-in', icon: 'power_settings_new', title: 'Connexion', route: '/sign-in' },
          { key: 'sign-up', icon: 'exit_to_app', title: 'Inscription', route: '/sign-up' },
        ];
        if (this.isUserAuthenticated) {
          if (this.isUserAdmin) {
            menuItems = [
              { key: 'dashboard', icon: 'dashboard', title: 'Dashboard', route: '/admin' },
              { key: 'search', icon: 'search', title: 'Search', route: '/admin/search' },
              {
                key: 'data-management',
                icon: 'list',
                title: 'Data Management',
                route: '/admin/data-management/master/talents',
              },
              { key: 'profile', icon: 'account_circle', title: 'Profile', route: '/admin/profile' },
            ];
          } else if (this.isUserEmployer) {
            menuItems = [
              { key: 'dashboard', icon: 'dashboard', title: 'Dashboard', route: '/employer' },
              { key: 'requirements', icon: 'assignment', title: 'Mes besoins', route: '/employer/requirements' },
              { key: 'talents', icon: 'assignment_ind', title: 'Mes talents', route: '/employer/talents' },
              { key: 'profile', icon: 'account_circle', title: 'Profil', route: '/employer/profile' },
            ];
          } else {
            menuItems = [
              { key: 'conditions', icon: 'speaker_notes', title: 'Mes conditions', route: '/talent/conditions' },
              { key: 'opportunities', icon: 'assignment', title: 'Mes opportunités', route: '/talent/opportunities' },
              { key: 'profile', icon: 'account_circle', title: 'Profil', route: '/talent/profile' },
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
