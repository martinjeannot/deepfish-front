<template>
  <v-layout>
    <v-flex xs3>
      <div class="pb-5">
        <search-criteria
          @search="search"
        ></search-criteria>
      </div>
      <client-executive
        :client-executive="user.clientExecutive"
      ></client-executive>
    </v-flex>
    <v-flex xs9>
      <v-flex xs12 class="pl-4">
        <h6 class="title">{{ totalItems }} profils</h6>
      </v-flex>
      <v-container fluid grid-list-md>
        <v-data-iterator
          :hide-actions="true"
          :items="talents"
          :total-items="totalItems"
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
      // pagination: {},
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
        // Current employer
        talentQueryString += `&employerId=${this.user.id}`;
        // Job function
        talentQueryString += `&jobFunction=${criteria.jobFunction}`;
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
        // Internship
        talentQueryString += `&conditions.internship=${criteria.internship}`;
        // Fixed locations
        if (criteria.fixedLocations.length) {
          talentQueryString += '&conditions.fixedLocations=';
          criteria.fixedLocations.forEach((fixedLocation, index) => {
            talentQueryString += `${index ? ',' : ''}${fixedLocation}`;
          });
        }
        // Pagination
        talentQueryString += '&size=99';
        // Sorting
        talentQueryString += '&sort=onlinedAt,desc';
        // API consumption
        return this
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
