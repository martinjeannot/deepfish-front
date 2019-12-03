<template>
  <v-layout>
    <v-flex xs3>
      <search-criteria
        @search="search"
      ></search-criteria>
      <client-executive></client-executive>
    </v-flex>
    <v-flex xs9>
      <v-container fluid grid-list-md>
        <v-data-iterator
          :items="talents"
          :pagination.sync="pagination"
          :rows-per-page-items="rowsPerPageItems"
          content-tag="v-layout"
          row
          wrap
        >
          <template #item="{ item }">
            <v-flex xs12 sm6 md4 lg3>
              <talent-overview
                :talent="item"
              ></talent-overview>
            </v-flex>
          </template>
        </v-data-iterator>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import ClientExecutive from '@/components/Employer/ClientExecutive';
  import SearchCriteria from './SearchCriteria';
  import TalentOverview from './TalentOverview';

  export default {
    name: 'EmployerSearch',
    components: {
      ClientExecutive,
      SearchCriteria,
      TalentOverview,
    },
    data: () => ({
      talents: [],
      totalItems: 0,
      pagination: {},
      rowsPerPageItems: [4, 8, 12],
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
        'initialLoading',
        'user',
        'talentRankingReferenceData',
      ]),
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'showSnackbar',
      ]),
      search(criteria) {
        this.prepareForApiConsumption();
        let talentQueryString = 'projection=default';
        // Experience
        if (criteria.experience[0]) {
          talentQueryString += `&minExperience=${criteria.experience[0]}`;
        }
        if (criteria.experience[1] && criteria.experience[1] < 30) {
          talentQueryString += `&maxExperience=${criteria.experience[1]}`;
        }
        // Base salary
        if (criteria.baseSalary[0]) {
          talentQueryString += `&minBaseSalary=${criteria.baseSalary[0] * 1000}`;
        }
        if (criteria.baseSalary[1] && criteria.baseSalary[1] < 120) {
          talentQueryString += `&maxBaseSalary=${criteria.baseSalary[1] * 1000}`;
        }
        // API consumption
        this
          .api(`/employerQueryableTalents?${talentQueryString}`)
          .then((response) => {
            this.talents = response.data._embedded.employerQueryableTalents;
            this.totalItems = response.data.page.totalElements;
          })
          .catch(() => this.showSnackbar(['Error', 'error']))
          .finally(() => this.clearLoading());
      },
    },
  };
</script>

<style scoped>

</style>
