<template>
  <v-layout row wrap>
    <v-flex xs2 class="pr-3">
      <data-management-navigation></data-management-navigation>
    </v-flex>
    <v-flex xs10>
      <v-flex xs12 class="text-xs-right" v-if="isUserSuperAdmin">
        <v-btn color="primary" class="mr-0" :to="{ name: 'AdminDMNewUser' }">New admin</v-btn>
      </v-flex>
      <v-data-table :headers="headers" :items="users" :loading="loading" class="elevation-1">
        <template slot="items" slot-scope="props">
          <td>{{ props.item.lastName }}</td>
          <td>{{ props.item.firstName }}</td>
          <td>{{ props.item.username }}</td>
          <td class="justify-center layout">
            <v-btn icon color="error" disabled>
              <v-icon>delete</v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import DataManagementNavigation from '../Navigation';

  export default {
    name: 'data-management-users',
    components: { DataManagementNavigation },
    data: () => ({
      users: [],
      headers: [
        { text: 'Last name', value: 'lastName' },
        { text: 'First name', value: 'firstName' },
        { text: 'Email', value: 'username' },
        { text: 'Actions', value: 'name', sortable: false },
      ],
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
        'isUserSuperAdmin',
      ]),
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'showSnackbar',
      ]),
    },
    created() {
      this.prepareForApiConsumption();
      this
        .api('/users')
        .then((response) => {
          this.users = response.data._embedded.users;
        })
        .catch(() => this.showSnackbar(['Error', 'error']))
        .finally(() => this.clearLoading());
    },
  };
</script>

<style scoped>

</style>
