<template>
  <v-layout>
    <v-flex xs2 class="pr-3">
      <data-management-navigation></data-management-navigation>
    </v-flex>
    <v-flex xs10>
      <v-card>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-text-field label="Search..." v-model="search" @blur="getTalents" append-icon="search" single-line
                        hide-details></v-text-field>
        </v-card-title>
        <v-data-table :items="talents" :headers="headers" :pagination.sync="pagination" :total-items="totalItems"
                      :loading="loading">
          <template slot="items" slot-scope="props">
            <td>
              <v-avatar size="46">
                <v-img
                  :src="props.item.profilePictureUrl"
                  lazy-src="static/img/avatar.png"
                  alt="picture"
                ></v-img>
              </v-avatar>
            </td>
            <td>{{ props.item.lastName }}</td>
            <td>{{ props.item.firstName }}</td>
            <td>{{ props.item.email }}</td>
            <td>{{ props.item.createdAt | formatDate('LLL') }}</td>
            <td>
              <v-icon :color="props.item.active ? 'green' : 'red'">
                {{ props.item.active ? 'done' : 'clear' }}
              </v-icon>
            </td>
            <td class="justify-center layout">
              <v-btn icon color="primary" :to="{ name: 'AdminDMTalent', params: {id: props.item.id} }">
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
    name: 'data-management-talents',
    components: { DataManagementNavigation },
    data: () => ({
      talents: [],
      headers: [
        { text: '', value: 'profilePictureUrl', sortable: false },
        { text: 'Last name', value: 'lastName' },
        { text: 'First name', value: 'firstName' },
        { text: 'Email', value: 'email' },
        { text: 'Registered at', value: 'createdAt' },
        { text: 'Active', value: 'active' },
        { text: 'Actions', value: 'name', sortable: false },
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
          this.getTalents();
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
      getTalents() {
        this.prepareForApiConsumption();
        let path = '/talents';
        path += this.search ? '/search/findByEmailContainingOrLastNameContainingOrFirstNameContainingOrPhoneNumberContainingAllIgnoreCase' : '';
        let queryString = '';
        queryString += `&page=${this.pagination.page - 1}&size=${this.pagination.rowsPerPage}`;
        queryString += this.pagination.sortBy ? `&sort=${this.pagination.sortBy},${this.pagination.descending ? 'desc' : 'asc'}` : '';
        queryString += this.search ? `&email=${this.search}&lastName=${this.search}&firstName=${this.search}&phoneNumber=${this.search}` : '';
        this
          .api(`${path}?${queryString}`)
          .then((response) => {
            this.talents = response.data._embedded.talents;
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
