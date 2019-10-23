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
          route: { name: 'AdminTalentAcquisitionStatistics' },
        },
        {
          title: 'Requirement',
          icon: 'work',
          color: 'orange',
          route: { name: 'AdminRequirementStatistics' },
        },
        {
          title: 'Opportunity sending',
          icon: 'assignment',
          color: 'amber lighten-1',
          route: { name: 'AdminOpportunitySendingStatistics' },
        },
        {
          title: 'Talent response',
          icon: 'assignment_turned_in',
          color: 'green',
          route: { name: 'AdminTalentResponseStatistics' },
        },
        {
          title: 'Employer response',
          icon: 'how_to_reg',
          color: 'blue',
          route: { name: 'AdminEmployerResponseStatistics' },
        },
        {
          title: 'Interview confirmation',
          icon: 'event',
          color: 'purple',
          route: { name: 'AdminInterviewConfirmationStatistics' },
        },
      ],
    }),
  };
</script>

<style scoped>

</style>
