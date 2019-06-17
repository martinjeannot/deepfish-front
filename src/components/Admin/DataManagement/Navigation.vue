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
    name: 'DataManagementNavigation',
    data: () => ({
      masterDataItems: [
        { title: 'Talents', icon: 'people', route: { name: 'AdminDMTalents' } },
        { title: 'Employers', icon: 'people_outline', route: { name: 'AdminDMEmployers' } },
        { title: 'Companies', icon: 'business', route: { name: 'AdminDMCompanies' } },
        { title: 'Requirements', icon: 'work', route: { name: 'AdminDMRequirements' } },
        { title: 'Opportunities', icon: 'assignment', route: { name: 'AdminDMOpportunities' } },
        { title: 'Interviews', icon: 'event', route: { name: 'AdminDMInterviews' } },
        { title: 'Admins', icon: 'supervisor_account', route: { name: 'AdminDMUsers' } },
      ],
      referenceDataItems: [
        { title: 'Company maturity levels', icon: 'business', route: { name: 'AdminDMCompanyMaturityLevels' } },
        { title: 'UTMs', icon: 'device_hub', route: { name: 'AdminDMUtms' } },
      ],
    }),
  };
</script>

<style scoped>

</style>
