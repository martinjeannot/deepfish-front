<template>
  <v-layout>
    <v-flex xs2 class="pr-3">
      <data-management-navigation></data-management-navigation>
    </v-flex>
    <v-flex xs10>
      <v-card>
        <v-card-title>
          <v-flex xs12 sm6 class="pr-2">
            <!-- FIXME : vuetify autocomplete's item-text filter prevent us from searching through company name OR requirement name -->
            <!-- See https://github.com/vuetifyjs/vuetify/issues/4497 for potential fix -->
            <v-autocomplete
              v-model="selectedRequirementId"
              :items="requirements"
              item-text="company.name"
              item-value="id"
              label="Requirement"
              :search-input.sync="requirementsSearchInput"
              :loading="loading"
              clearable
              prepend-icon="assignment"
              hide-details
              @input="search = ''; getOpportunities()"
            >
              <template #selection="{ item }">
                <div class="input-group__selections__comma">
                  {{ item.company.name }} - {{ item.name }}
                </div>
              </template>
              <template #item="{ item }">
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>
                      <span style="font-weight: bold">{{ item.company.name }}</span> : {{ item.name }}
                    </v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-autocomplete>
          </v-flex>
          <v-flex xs12 sm6 class="pl-2">
            <v-text-field label="Search..." v-model="search" @blur="selectedRequirementId = null; getOpportunities()"
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
      pagination: {
        sortBy: 'createdAt',
        descending: true,
      },
      search: '',
      requirements: [],
      selectedRequirementId: null,
      requirementsSearchInput: null,
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
      requirementsSearchInput(search) {
        if (search) {
          this.searchRequirements(search);
        }
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
        } else if (this.selectedRequirementId) {
          path += '/search/findByRequirementId';
          queryString += `&requirementId=${this.selectedRequirementId}`;
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
      searchRequirements(search) {
        this.prepareForApiConsumption();
        this.api(`/requirements/search/findByStatusAndCompanyNameContainingIgnoreCaseOrderByCompanyNameAsc?projection=default&status=OPEN&companyName=${encodeURIComponent(search)}`)
          .then((response) => {
            this.requirements = response.data._embedded.requirements;
          })
          .catch(() => this.showSnackbar(['Error', 'error']))
          .finally(() => this.clearLoading());
      },
    },
  };
</script>

<style scoped>

</style>
