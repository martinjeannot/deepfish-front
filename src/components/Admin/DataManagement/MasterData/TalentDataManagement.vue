<template>
  <v-layout>
    <v-flex xs2>
      <data-management-navigation></data-management-navigation>
    </v-flex>
    <v-flex xs10>
      <v-data-table :headers="headers" :items="items" :loading="loading" class="elevation-1">
        <template slot="items" slot-scope="props">
          <td>{{ props.item.lastName }}</td>
          <td>{{ props.item.firstName }}</td>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import DataManagementNavigation from '../Navigation';

  export default {
    components: { DataManagementNavigation },
    name: 'talent-data-management',
    data: () => ({
      headers: [
        { text: 'Last name', value: 'lastName' },
        { text: 'First name', value: 'firstName' },
      ],
      items: [],
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
      ]),
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
      ]),
    },
    created() {
      this.prepareForApiConsumption();
      this
        .api('/talents')
        .then((response) => {
          this.items = response.data._embedded.talents;
        })
        .catch()
        .finally(() => this.clearLoading());
    },
  };
</script>

<style scoped>

</style>
