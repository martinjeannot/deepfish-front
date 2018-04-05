<template>
  <v-layout>
    <v-flex xs2 class="pr-3">
      <data-management-navigation></data-management-navigation>
    </v-flex>
    <v-flex xs10>
      <v-card>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-text-field label="Search..." v-model="search" @blur="getOpportunities" append-icon="search" single-line
                        hide-details></v-text-field>
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
        { text: 'Company', value: 'company.name' },
        { text: 'Talent', value: 'talent.lastName' },
        { text: 'Talent status', value: 'talentStatus' },
        { text: 'Employer status', value: 'employerStatus' },
        { text: 'Actions', value: 'id', sortable: false },
      ],
      totalItems: 0,
      pagination: {},
      search: '',
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
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
        const path = '/opportunities';
        let queryString = 'projection=admin-item';
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
  };
</script>

<style scoped>

</style>
