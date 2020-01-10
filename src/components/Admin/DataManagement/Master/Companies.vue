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
              @search="getCompanies"
              class="pa-3"
            ></search-box>
          </v-card>
        </v-flex>
        <v-flex xs12>
          <v-card>
            <v-data-table
              :headers="headers"
              :items="companies"
              :loading="loading"
              :pagination.sync="pagination"
              :total-items="totalItems"
            >
              <template slot="items" slot-scope="props">
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.createdAt | formatDate('LLL') }}</td>
                <td>{{ props.item.status }}</td>
                <td class="justify-center layout">
                  <v-btn icon color="primary" :to="{ name: 'AdminDMCompany', params: {id: props.item.id} }">
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
    name: 'DataManagementCompanies',
    components: {
      DataManagementNavigation,
      SearchBox,
    },
    data: () => ({
      companies: [],
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Registered at', value: 'createdAt' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'name', sortable: false },
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
          this.getCompanies();
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
      getCompanies() {
        this.prepareForApiConsumption();
        let path = '/companies';
        path += this.searchInput ? '/search/findByNameContainingAllIgnoreCase' : '';
        let queryString = '';
        queryString += `&page=${this.pagination.page - 1}&size=${this.pagination.rowsPerPage}`;
        queryString += this.pagination.sortBy ? `&sort=${this.pagination.sortBy},${this.pagination.descending ? 'desc' : 'asc'}` : '';
        queryString += this.searchInput ? `&name=${this.encodedSearchInput}` : '';
        this
          .api(`${path}?${queryString}`)
          .then((response) => {
            this.companies = response.data._embedded.companies;
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
