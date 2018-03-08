<template>
  <v-navigation-drawer permanent class="elevation-1">
    <v-toolbar flat>
      <v-list>
        <v-list-tile>
          <v-list-tile-title class="title">
            Master data
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-toolbar>
    <v-divider></v-divider>
    <v-list dense class="pt-0">
      <v-list-tile v-for="item in masterDataItems" :key="item.title" :to="item.route">
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    <v-toolbar flat>
      <v-list>
        <v-list-tile>
          <v-list-tile-title class="title">
            Reference data
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-toolbar>
    <v-divider></v-divider>
    <v-list dense class="pt-0">
      <v-list-tile v-for="item in referenceDataItems" :key="item.title" :to="item.route">
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
  export default {
    name: 'data-management-navigation',
    data: () => ({
      masterDataItems: [
        { title: 'Talents', icon: 'dashboard', route: '/admin/data-management/master/talents' },
        { title: 'Admins', icon: 'dashboard', route: '/admin/data-management/master/users' },
      ],
      referenceDataItems: [
        {
          title: 'Company maturity levels',
          icon: 'dashboard',
          route: '/admin/data-management/reference/company-maturity-levels',
        },
      ],
    }),
  };
</script>

<style scoped>

</style>
