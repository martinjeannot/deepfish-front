<template>
  <v-layout>
    <v-flex xs2 class="pr-3">
      <data-management-navigation></data-management-navigation>
    </v-flex>
    <v-flex xs10>
      <v-layout wrap>
        <v-flex xs6 offset-xs3 class="pb-3">
          <v-card>
            <search-box
              v-model="searchInput"
              @search="getRequirements"
              class="pa-3"
            ></search-box>
          </v-card>
        </v-flex>
        <v-flex xs12>
          <v-card>
            <v-data-table
              :headers="headers"
              :items="requirements"
              :loading="loading"
              :pagination.sync="pagination"
              :total-items="totalItems"
            >
              <template slot="items" slot-scope="props">
                <td>{{ props.item.createdAt | formatDate('LLL') }}</td>
                <td>{{ props.item.name }}</td>
                <td>
                  <router-link :to="{ name: 'AdminDMCompany', params: {id: props.item.company.id} }">
                    {{ props.item.company.name }}
                  </router-link>
                </td>
                <td>
                  <v-icon :color="props.item.status === 'OPEN' ? 'green' : 'red'">
                    {{ props.item.status === 'OPEN' ? 'done' : 'clear' }}
                  </v-icon>
                </td>
                <td class="justify-center layout">
                  <v-btn icon color="primary" :to="{ name: 'AdminDMRequirement', params: {id: props.item.id} }">
                    <v-icon>visibility</v-icon>
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
  import { mapGetters, mapActions } from 'vuex';
  import DataManagementNavigation from '../Navigation';
  import SearchBox from '../../Utilities/SearchBox';

  export default {
    name: 'data-management-requirements',
    components: {
      DataManagementNavigation,
      SearchBox,
    },
    data: () => ({
      requirements: [],
      headers: [
        { text: 'Received at', value: 'createdAt' },
        { text: 'Name', value: 'name' },
        { text: 'Company', value: 'company.name' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'id', sortable: false },
      ],
      totalItems: 0,
      pagination: {
        sortBy: 'createdAt',
        descending: true,
      },
      searchInput: '',
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
      ]),
      encodedSearchInput() {
        return encodeURIComponent(this.searchInput);
      },
    },
    watch: {
      pagination: {
        handler() {
          this.getRequirements();
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
      getRequirements() {
        this.prepareForApiConsumption();
        let path = '/requirements';
        path += this.searchInput ? '/search/findByNameContainingOrCompanyNameContainingAllIgnoreCase' : '';
        let queryString = 'projection=default';
        queryString += `&page=${this.pagination.page - 1}&size=${this.pagination.rowsPerPage}`;
        queryString += this.pagination.sortBy ? `&sort=${this.pagination.sortBy},${this.pagination.descending ? 'desc' : 'asc'}` : '';
        queryString += this.searchInput ? `&name=${this.encodedSearchInput}&companyName=${this.encodedSearchInput}` : '';
        this
          .api(`${path}?${queryString}`)
          .then((response) => {
            this.requirements = response.data._embedded.requirements;
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
