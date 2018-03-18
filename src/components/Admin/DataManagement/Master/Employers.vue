<template>
  <v-layout row wrap>
    <v-flex xs2 class="pr-3">
      <data-management-navigation></data-management-navigation>
    </v-flex>
    <v-flex xs10>
      <v-card>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-text-field label="Search..." v-model="search" @blur="getEmployers" append-icon="search" single-line
                        hide-details></v-text-field>
        </v-card-title>
        <v-data-table :headers="headers" :items="employers" :pagination.sync="pagination" :total-items="totalItems"
                      :loading="loading">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.lastName }}</td>
            <td>{{ props.item.firstName }}</td>
            <td>{{ props.item.username }}</td>
            <td>{{ props.item.createdAt | formatDate('LLL') }}</td>
            <td class="justify-center layout">
              <v-btn icon color="error" disabled>
                <v-icon>delete</v-icon>
              </v-btn>
            </td>
          </template>
        </v-data-table>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import DataManagementNavigation from '../Navigation';

  export default {
    name: 'data-management-employers',
    components: { DataManagementNavigation },
    data: () => ({
      employers: [],
      headers: [
        { text: 'Last name', value: 'lastName' },
        { text: 'First name', value: 'firstName' },
        { text: 'Email', value: 'username' },
        { text: 'Registered at', value: 'createdAt' },
        { text: 'Actions', value: 'name', sortable: false },
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
        const path = this.search ? '/employers/search/findByUsernameContainingOrFirstNameContainingOrLastNameContaining' : '/employers';
        let queryString = `page=${this.pagination.page - 1}&size=${this.pagination.rowsPerPage}`;
        queryString += this.pagination.sortBy ? `&sort=${this.pagination.sortBy},${this.pagination.descending ? 'desc' : 'asc'}` : '';
        queryString += this.search ? `&username=${this.search}&firstName=${this.search}&lastName=${this.search}` : '';
        this
          .api(`${path}?${queryString}`)
          .then((response) => {
            this.employers = response.data._embedded.employers;
            this.totalItems = response.data.page.totalElements;
          })
          .catch(() => this.showSnackbar('Error'))
          .finally(() => this.clearLoading());
      },
    },
  };
</script>

<style scopde>

</style>
