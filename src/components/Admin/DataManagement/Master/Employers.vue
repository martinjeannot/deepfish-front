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
              @search="getEmployers"
              class="pa-3"
            ></search-box>
          </v-card>
        </v-flex>
        <v-flex xs12>
          <v-card>
            <v-data-table
              :headers="headers"
              :items="employers"
              :loading="loading"
              :pagination.sync="pagination"
              :total-items="totalItems"
            >
              <template slot="items" slot-scope="props">
                <td>{{ props.item.lastName }}</td>
                <td>{{ props.item.firstName }}</td>
                <td>{{ props.item.username }}</td>
                <td>{{ props.item.createdAt | formatDate('LLL') }}</td>
                <td>{{ props.item.lastSignedInAt | formatDate('LLL') }}</td>
                <td>
                  <router-link :to="{ name: 'AdminDMCompany', params: {id: props.item.company.id} }">
                    {{ props.item.company.name }}
                  </router-link>
                </td>
                <td class="justify-center layout">
                  <v-btn icon color="primary" :to="{ name: 'AdminDMEmployer', params: {id: props.item.id} }">
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
    name: 'data-management-employers',
    components: {
      DataManagementNavigation,
      SearchBox,
    },
    data: () => ({
      employers: [],
      headers: [
        { text: 'Last name', value: 'lastName' },
        { text: 'First name', value: 'firstName' },
        { text: 'Email', value: 'username' },
        { text: 'Registered at', value: 'createdAt' },
        { text: 'Last signed in at', value: 'lastSignedInAt' },
        { text: 'Company', value: 'company.name', sortable: false },
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
          this.getEmployers();
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
      getEmployers() {
        this.prepareForApiConsumption();
        let path = '/employers';
        path += this.searchInput ? '/search/findByUsernameContainingOrFirstNameContainingOrLastNameContainingOrCompanyNameContainingOrPhoneNumberContainingAllIgnoreCase' : '';
        let queryString = 'projection=default';
        queryString += `&page=${this.pagination.page - 1}&size=${this.pagination.rowsPerPage}`;
        queryString += this.pagination.sortBy ? `&sort=${this.pagination.sortBy},${this.pagination.descending ? 'desc' : 'asc'}` : '';
        queryString += this.searchInput ? `&username=${this.encodedSearchInput}&firstName=${this.encodedSearchInput}&lastName=${this.encodedSearchInput}&companyName=${this.encodedSearchInput}&phoneNumber=${this.encodedSearchInput}` : '';
        this
          .api(`${path}?${queryString}`)
          .then((response) => {
            this.employers = response.data._embedded.employers;
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
