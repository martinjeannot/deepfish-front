<template>
  <v-layout>
    <v-flex xs2 class="pr-3">
      <data-management-navigation></data-management-navigation>
    </v-flex>
    <v-flex xs10>
      <v-data-table :headers="headers" :items="items" :loading="loading" class="elevation-1">
        <template slot="items" slot-scope="props">
          <td>
            <v-avatar size="46">
              <img :src="props.item.pictureUrl" alt="avatar"/>
            </v-avatar>
          </td>
          <td>{{ props.item.lastName }}</td>
          <td>{{ props.item.firstName }}</td>
          <td class="justify-center layout">
            <v-btn icon :to="{name: 'AdminTalent', params: {id: props.item.id}}">
              <v-icon color="primary">edit</v-icon>
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
    name: 'talents',
    components: { DataManagementNavigation },
    data: () => ({
      headers: [
        { text: '', value: 'pictureUrl', sortable: false },
        { text: 'Last name', value: 'lastName' },
        { text: 'First name', value: 'firstName' },
        { text: 'Actions', value: 'name', sortable: false },
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
