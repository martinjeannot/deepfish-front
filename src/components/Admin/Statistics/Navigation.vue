<template>
  <v-navigation-drawer permanent>
    <v-list>
      <v-list-tile
        v-for="item in items"
        :key="item.title"
        :to="item.route"
      >
        <v-list-tile-action>
          <v-icon :color="item.color">{{ item.icon }}</v-icon>
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
    name: 'StatisticsNavigation',
    data: () => ({
      items: [
        {
          title: 'Talent acquisition',
          icon: 'group_add',
          color: 'red',
          route: { name: 'AdminStatisticsTalentAcquisition' },
        },
        { title: 'Opportunities', icon: 'dashboard', route: { name: 'AdminStatisticsOpportunities' } },
      ],
    }),
  };
</script>

<style scoped>

</style>
