<template>
  <v-layout>
    <v-flex xs2 class="pr-3">
      <data-management-navigation></data-management-navigation>
    </v-flex>
    <v-flex xs10>
      <v-card>
        <v-card-title>
          <v-flex xs12 sm6 class="pr-2">
            <v-select v-if="!initialLoading" label="Requirement" :items="requirements" v-model="selectedRequirement"
                      hide-details clearable @input="search = ''; getOpportunities()">
              <template slot="selection" slot-scope="data">
                <div class="input-group__selections__comma">
                  {{ data.item.company.name }} - {{ data.item.name }}
                </div>
              </template>
              <template slot="item" slot-scope="data">
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title><span style="font-weight: bold">{{ data.item.company.name }}</span>
                      : {{ data.item.name }}
                    </v-list-tile-title>
                    <v-list-tile-sub-title>{{ data.item.jobType.l10nKey }} {{ data.item.seniority.l10nKey
                      }} {{ data.item.fixedSalary / 1000 }}K€ {{ data.item.location }}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-select>
          </v-flex>
          <v-flex xs12 sm6 class="pl-2">
            <v-text-field label="Search..." v-model="search" @blur="selectedRequirement = null; getOpportunities()"
                          append-icon="search" single-line hide-details></v-text-field>
          </v-flex>
        </v-card-title>
        <v-data-table :items="opportunities" :headers="headers" :pagination.sync="pagination" :total-items="totalItems"
                      :loading="loading">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.createdAt | formatDate('LLL') }}</td>
            <td>
              <router-link :to="{ name: 'AdminDMCompany', params: {id: props.item.company.id} }">
                {{ props.item.company.name }}
              </router-link>
            </td>
            <td>
              <router-link :to="{ name: 'AdminDMTalent', params: {id: props.item.talent.id} }">
                {{ props.item.talent.lastName.toUpperCase() }} {{ props.item.talent.firstName }}
              </router-link>
            </td>
            <td>
              <span :class="`${getOpportunityStatusColor(props.item.talentStatus)}--text`" style="font-weight: bold">
                {{ props.item.talentStatus }}
              </span>
            </td>
            <td>
              <span :class="`${getOpportunityStatusColor(props.item.employerStatus)}--text`" style="font-weight: bold">
                {{ props.item.employerStatus }}
              </span>
            </td>
            <td class="justify-center layout">
              <v-btn icon color="primary" :to="{ name: 'AdminDMOpportunity', params: {id: props.item.id} }">
                <v-icon>visibility</v-icon>
              </v-btn>
            </td>
          </template>
        </v-data-table>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions, mapState } from 'vuex';
  import DataManagementNavigation from '../Navigation';

  export default {
    name: 'data-management-opportunities',
    components: { DataManagementNavigation },
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
      pagination: {},
      search: '',
      requirements: [],
      selectedRequirement: null,
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
        if (this.search) {
          path += '/search/findByRequirementCompanyNameContainingOrTalentLastNameContainingOrTalentFirstNameContainingAllIgnoreCase';
          queryString += `&companyName=${this.search}&talentLastName=${this.search}&talentFirstName=${this.search}`;
        } else if (this.selectedRequirement) {
          path += '/search/findByRequirementId';
          queryString += `&requirementId=${this.selectedRequirement.id}`;
        }
        queryString += `&page=${this.pagination.page - 1}&size=${this.pagination.rowsPerPage}`;
        queryString += this.pagination.sortBy ? `&sort=${this.pagination.sortBy},${this.pagination.descending ? 'desc' : 'asc'}` : '';
        this
          .api(`${path}?${queryString}`)
          .then((response) => {
            this.opportunities = response.data._embedded.opportunities;
            this.totalItems = response.data.page.totalElements;
          })
          .catch(() => this.showSnackbar('Error'))
          .finally(() => this.clearLoading());
      },
    },
    created() {
      this.prepareForApiConsumption(true);
      this
        .api('/requirements?projection=default&size=1000')
        .then((response) => {
          this.requirements = response.data._embedded.requirements;
        })
        .catch(() => this.showSnackbar('Error loading requirements'))
        .finally(() => this.clearLoading(true));
    },
  };
</script>

<style scoped>

</style>
