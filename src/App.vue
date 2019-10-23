<template>
  <v-app v-if="appCreated">
    <img class="whale1" src="static/img/whale1.png" alt="<° ) ) ) ><"/>
    <img class="whale2" src="static/img/whale2.png" alt=">< ( ( ( °>"/>
    <img class="whale3" src="static/img/whale3.png" alt="<° ) ) ) ><"/>
    <v-navigation-drawer app fixed temporary v-model="showSideNav">
      <v-list>
        <v-list-tile v-for="menuItem in menuItems" :key="menuItem.title" router :to="menuItem.route" exact>
          <v-list-tile-action>
            <v-badge color="red">
              <v-icon>{{ menuItem.icon }}</v-icon>
              <span slot="badge" v-if="menuBadges[menuItem.key]">{{ menuBadges[menuItem.key] }}</span>
            </v-badge>
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
        <router-link :to="menuItems[1].route">
          <img src="static/img/header_logo.png" alt="Deepfish"/>
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
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3500"
    >
      {{ snackbar.text }}
      <v-btn
        v-if="snackbar.button"
        :color="snackbar.button.color"
        flat
        :target="snackbar.button.target"
        :to="snackbar.button.to"
      >
        {{ snackbar.button.text }}
      </v-btn>
    </v-snackbar>
    <v-footer app dark height="auto">
      <v-card flat tile width="inherit" class="text-xs-center" color="#3A3A3A">
        <v-card-text class="py-0">
          <v-btn v-for="link in footerLinks" :key="link.href" icon class="mx-2" :href="link.href" target="_blank">
            <v-icon size="24px">{{ link.icon }}</v-icon>
          </v-btn>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text class="py-2">
          <a href="https://www.deepfish.co/tos" target="_blank" style="color: white">CGU</a> &mdash;
          Copyright &copy; {{ new Date().getFullYear() }} &mdash; <strong>Deepfish</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    data: () => ({
      showSideNav: false,
      footerLinks: [
        { icon: 'fab fa-facebook', href: 'https://www.facebook.com/Deepfish-183214365456134' },
        { icon: 'fab fa-twitter', href: 'https://twitter.com/deepfish_co' },
        { icon: 'fab fa-linkedin', href: 'https://www.linkedin.com/company/deepfish' },
        { icon: 'fab fa-instagram', href: 'https://www.instagram.com/deepfish.co/' },
        { icon: 'fab fa-wordpress', href: 'https://blog.deepfish.co' },
      ],
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
          {
            key: 'sign-up',
            icon: 'exit_to_app',
            title: 'Inscription',
            route: { name: 'SignUp' },
          },
          {
            key: 'sign-in',
            icon: 'power_settings_new',
            title: 'Connexion',
            route: { name: 'SignIn' },
          },
        ];
        if (this.isUserAuthenticated) {
          if (this.isUserAdmin) {
            menuItems = [
              {
                key: 'dashboard',
                icon: 'dashboard',
                title: 'Dashboard',
                route: { name: 'AdminDashboard' },
              },
              {
                key: 'search',
                icon: 'search',
                title: 'Search',
                route: { name: 'AdminSearch' },
              },
              {
                key: 'data-management',
                icon: 'list',
                title: 'Data Management',
                route: { name: 'AdminDMTalents' },
              },
              {
                key: 'statistics',
                icon: 'timeline',
                title: 'Statistics',
                route: { name: 'AdminOpportunitySendingStatistics' },
              },
              {
                key: 'profile',
                icon: 'account_circle',
                title: 'Profile',
                route: { name: 'AdminProfile' },
              },
            ];
          } else if (this.isUserEmployer) {
            menuItems = [
              {
                key: 'requirements',
                icon: 'work',
                title: 'Besoins',
                route: { name: 'EmployerRequirements' },
              },
              {
                key: 'talents',
                icon: 'people',
                title: 'Talents',
                route: { name: 'EmployerTalents' },
              },
              {
                key: 'profile',
                icon: 'account_circle',
                title: 'Profil',
                route: { name: 'EmployerProfile' },
              },
              {
                key: 'pricing',
                icon: 'monetization_on',
                title: 'Tarifs',
                route: { name: 'EmployerPricing' },
              },
            ];
          } else {
            menuItems = [
              {
                key: 'conditions',
                icon: 'speaker_notes',
                title: 'Conditions',
                route: { name: 'TalentConditions' },
              },
              {
                key: 'opportunities',
                icon: 'assignment',
                title: 'Opportunités',
                route: { name: 'TalentOpportunities' },
              },
              {
                key: 'referral',
                icon: 'how_to_reg',
                title: 'Parrainage',
                route: { name: 'TalentReferral' },
              },
              {
                key: 'profile',
                icon: 'account_circle',
                title: 'Profil',
                route: { name: 'TalentProfile' },
              },
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

<style scoped>
  .whale1 {
    position: absolute;
    top: 20%;
    left: 14%;
  }

  .whale2 {
    position: absolute;
    top: 25%;
    right: 14%;
  }

  .whale3 {
    position: absolute;
    top: 59%;
    right: 11%;
  }
</style>
