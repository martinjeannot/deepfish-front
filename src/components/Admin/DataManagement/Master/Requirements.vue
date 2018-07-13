<template>
  <v-layout>
    <v-flex xs2 class="pr-3">
      <data-management-navigation></data-management-navigation>
    </v-flex>
    <v-flex xs10>
      <v-card>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-text-field label="Search..." v-model="search" @blur="getRequirements" append-icon="search" single-line
                        hide-details></v-text-field>
        </v-card-title>
        <v-data-table :items="requirements" :headers="headers" :pagination.sync="pagination" :total-items="totalItems"
                      :loading="loading">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.createdAt | formatDate('LLL') }}</td>
            <td>{{ props.item.name }}</td>
            <td>
              <router-link :to="{ name: 'AdminDMCompany', params: {id: props.item.company.id} }">
                {{ props.item.company.name }}
              </router-link>
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
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import DataManagementNavigation from '../Navigation';

  export default {
    name: 'data-management-requirements',
    components: { DataManagementNavigation },
    data: () => ({
      requirements: [],
      headers: [
        { text: 'Received at', value: 'createdAt' },
        { text: 'Name', value: 'name' },
        { text: 'Company', value: 'company.name' },
        { text: 'Actions', value: 'id', sortable: false },
      ],
      totalItems: 0,
      pagination: {
        sortBy: 'createdAt',
        descending: true,
      },
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
        path += this.search ? '/search/findByNameContainingOrCompanyNameContainingAllIgnoreCase' : '';
        let queryString = 'projection=default';
        queryString += `&page=${this.pagination.page - 1}&size=${this.pagination.rowsPerPage}`;
        queryString += this.pagination.sortBy ? `&sort=${this.pagination.sortBy},${this.pagination.descending ? 'desc' : 'asc'}` : '';
        queryString += this.search ? `&name=${this.search}&companyName=${this.search}` : '';
        this
          .api(`${path}?${queryString}`)
          .then((response) => {
            this.requirements = response.data._embedded.requirements;
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
