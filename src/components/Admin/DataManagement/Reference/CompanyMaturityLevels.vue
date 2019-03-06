<template>
  <v-layout>
    <v-flex xs2 class="pr-3">
      <data-management-navigation></data-management-navigation>
    </v-flex>
    <v-flex xs10>
      <v-data-table :headers="headers" :items="items" :loading="loading" class="elevation-1">
        <template slot="items" slot-scope="props">
          <td>{{ props.item.l10nKey }}</td>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import DataManagementNavigation from '../Navigation';

  export default {
    components: { DataManagementNavigation },
    name: 'company-maturity-level-data-management',
    data: () => ({
      headers: [
        { text: 'Company maturity level', value: 'l10nKey' },
      ],
      items: [],
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
      ]),
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
      ]),
    },
    created() {
      this.prepareForApiConsumption();
      this
        .api('/companyMaturityLevels')
        .then((response) => {
          this.items = response.data._embedded.companyMaturityLevels;
        })
        .catch()
        .finally(() => this.clearLoading());
    },
  };
</script>

<style scoped>

</style>
