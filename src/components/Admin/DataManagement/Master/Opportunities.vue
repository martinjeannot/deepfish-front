<template>
  <v-layout>
    <v-flex xs2 class="pr-3">
      <data-management-navigation></data-management-navigation>
    </v-flex>
    <v-flex xs10>
      <v-layout wrap>
        <v-flex xs6 class="pb-3 pr-3">
          <v-card>
            <requirement-select
              v-model="requirement"
              @input="searchInput = ''; getOpportunities()"
              class="pa-3"
            ></requirement-select>
          </v-card>
        </v-flex>
        <v-flex xs6 class="pb-3">
          <v-card>
            <search-box
              v-model="searchInput"
              @search="requirement = null; getOpportunities()"
              class="pa-3"
            ></search-box>
          </v-card>
        </v-flex>
        <v-flex xs12>
          <v-card>
            <v-data-table
              :headers="headers"
              :items="opportunities"
              :loading="loading"
              :pagination.sync="pagination"
              :total-items="totalItems"
            >
              <template slot="items" slot-scope="props">
                <td>{{ props.item.createdAt | formatDate('LLL') }}</td>
                <td>
                  <router-link :to="{ name: 'AdminDMCompany', params: {id: props.item.company.id} }">
                    {{ props.item.company.name }}
                  </router-link>
                </td>
                <td>
                  <router-link :to="{ name: 'AdminDMTalent', params: {id: props.item.talent.id} }">
                    {{ props.item.talent.firstName }} {{ props.item.talent.lastName.toUpperCase() }}
                  </router-link>
                </td>
                <td>
              <span :class="[`${getOpportunityStatusColor(props.item.talentStatus)}--text`, 'font-weight-bold']">
                {{ props.item.talentStatus }}
              </span>
                </td>
                <td>
              <span :class="[`${getOpportunityStatusColor(props.item.employerStatus)}--text`, 'font-weight-bold']">
                {{ props.item.employerStatus }}
              </span>
                </td>
                <td class="justify-center layout">
                  <v-btn icon color="primary" :to="{ name: 'AdminDMOpportunity', params: {id: props.item.id} }">
                    <v-icon>visibility</v-icon>
                  </v-btn>
                  <v-btn icon color="primary" :to="{ name: 'AdminDMOpportunityView', params: {id: props.item.id} }">
                    <v-icon>pageview</v-icon>
                  </v-btn>
                </td>
              </template>
            </v-data-table>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions, mapState } from 'vuex';
  import DataManagementNavigation from '../Navigation';
  import RequirementSelect from '../../Utilities/RequirementSelect';
  import SearchBox from '../../Utilities/SearchBox';

  export default {
    name: 'data-management-opportunities',
    components: {
      DataManagementNavigation,
      RequirementSelect,
      SearchBox,
    },
    data: () => ({
      opportunities: [],
      headers: [
        { text: 'Sent at', value: 'createdAt' },
        { text: 'Company', value: 'company.name', sortable: false },
        { text: 'Talent', value: 'talent.lastName', sortable: false },
        { text: 'Talent status', value: 'talentStatus' },
        { text: 'Employer status', value: 'employerStatus' },
        { text: 'Actions', value: 'id', sortable: false },
      ],
      totalItems: 0,
      pagination: {
        sortBy: 'createdAt',
        descending: true,
      },
      requirement: null,
      searchInput: '',
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
        'initialLoading',
      ]),
      ...mapState([
        'getOpportunityStatusColor',
      ]),
      encodedSearchInput() {
        return encodeURIComponent(this.searchInput);
      },
    },
    watch: {
      pagination: {
        handler() {
          this.getOpportunities();
        },
        deep: true,
      },
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'showSnackbar',
      ]),
      getOpportunities() {
        this.prepareForApiConsumption();
        let path = '/opportunities';
        let queryString = 'projection=admin-item';
        if (this.searchInput) {
          path += '/search/findByRequirementCompanyNameContainingOrTalentLastNameContainingOrTalentFirstNameContainingAllIgnoreCase';
          queryString += `&companyName=${this.encodedSearchInput}&talentLastName=${this.encodedSearchInput}&talentFirstName=${this.encodedSearchInput}`;
        } else if (this.requirement) {
          path += '/search/findByRequirementId';
          queryString += `&requirementId=${this.requirement.id}`;
        }
        queryString += `&page=${this.pagination.page - 1}&size=${this.pagination.rowsPerPage}`;
        queryString += this.pagination.sortBy ? `&sort=${this.pagination.sortBy},${this.pagination.descending ? 'desc' : 'asc'}` : '';
        this
          .api(`${path}?${queryString}`)
          .then((response) => {
            this.opportunities = response.data._embedded.opportunities;
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
