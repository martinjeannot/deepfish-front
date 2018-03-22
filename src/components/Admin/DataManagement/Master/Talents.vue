<template>
  <v-layout>
    <v-flex xs2 class="pr-3">
      <data-management-navigation></data-management-navigation>
    </v-flex>
    <v-flex xs10>
      <v-data-table :headers="headers" :items="talents" :loading="loading" class="elevation-1">
        <template slot="items" slot-scope="props">
          <td>
            <v-avatar size="46">
              <img :src="props.item.profile.pictureUrl" alt="picture"/>
            </v-avatar>
          </td>
          <td>{{ props.item.lastName }}</td>
          <td>{{ props.item.firstName }}</td>
          <td>{{ props.item.email }}</td>
          <td class="justify-center layout">
            <v-btn icon color="primary" :to="{ name: 'AdminDMTalent', params: {id: props.item.id} }">
              <v-icon>visibility</v-icon>
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
    name: 'data-management-talents',
    components: { DataManagementNavigation },
    data: () => ({
      talents: [],
      headers: [
        { text: '', value: 'pictureUrl', sortable: false },
        { text: 'Last name', value: 'lastName' },
        { text: 'First name', value: 'firstName' },
        { text: 'Email', value: 'email' },
        { text: 'Actions', value: 'name', sortable: false },
      ],
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
        'showSnackbar',
      ]),
    },
    created() {
      this.prepareForApiConsumption();
      this
        .api('/talents')
        .then((response) => {
          this.talents = response.data._embedded.talents;
        })
        .catch(() => this.showSnackbar('Error'))
        .finally(() => this.clearLoading());
    },
  };
</script>

<style scoped>

</style>
