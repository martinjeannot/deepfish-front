<template>
  <v-navigation-drawer permanent>
    <v-list>
      <v-list-tile v-for="item in items" :key="item.title" :to="item.route">
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
    name: 'statistics-navigation',
    data: () => ({
      items: [
        { title: 'Opportunities', icon: 'dashboard', route: { name: 'AdminStatisticsOpportunities' } },
        { title: 'Talent acquisition', icon: 'dashboard', route: { name: 'AdminStatisticsTalentAcquisition' } },
      ],
    }),
  };
</script>

<style scoped>

</style>
