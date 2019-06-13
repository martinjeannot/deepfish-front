<template>
  <v-layout>
    <v-flex xs2 class="pr-3">
      <data-management-navigation></data-management-navigation>
    </v-flex>
    <v-flex xs10>
      <v-flex xs12 class="pb-3">
        <v-card>
          <requirement-select
            v-model="requirement"
            @input="getInterviews"
            class="pa-3"
          ></requirement-select>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <v-card>
          <v-data-table
            :headers="headers"
            :items="interviews"
            :loading="loading"
            :pagination.sync="pagination"
            :total-items="totalItems"
          >
            <template slot="items" slot-scope="props">
              <td>{{ props.item.createdAt | formatDate('LLL') }}</td>
              <td>
                <router-link :to="{ name: 'AdminDMCompany', params: {id: props.item.company.id} }">
                  {{ props.item.company.name }}
                </router-link>
              </td>
              <td>
                <router-link :to="{ name: 'AdminDMTalent', params: {id: props.item.talent.id} }">
                  {{ props.item.talent.firstName }} {{ props.item.talent.lastName.toUpperCase() }}
                </router-link>
              </td>
              <td>
              <span :class="[`${getInterviewStatusColor(props.item.status)}--text`, 'font-weight-bold']">
                {{ props.item.status }}
              </span>
              </td>
              <td>{{ props.item.startAt | formatDate('LLL') }}</td>
              <td class="justify-center layout">
                <v-btn icon color="primary" :to="{ name: 'AdminDMInterview', params: {id: props.item.id} }">
                  <v-icon>visibility</v-icon>
                </v-btn>
              </td>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions, mapState } from 'vuex';
  import DataManagementNavigation from '../Navigation';
  import RequirementSelect from '../../Utilities/RequirementSelect';

  export default {
    name: 'data-management-interviews',
    components: {
      DataManagementNavigation,
      RequirementSelect,
    },
    data: () => ({
      interviews: [],
      headers: [
        { text: 'Created at', value: 'createdAt' },
        { text: 'Company', value: 'company.name', sortable: false },
        { text: 'Talent', value: 'talent.lastName', sortable: false },
        { text: 'Status', value: 'status' },
        { text: 'Start at', value: 'startAt' },
        { text: 'Actions', value: 'id', sortable: false },
      ],
      totalItems: 0,
      pagination: {
        sortBy: 'createdAt',
        descending: true,
      },
      requirement: null,
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
      ]),
      ...mapState([
        'getInterviewStatusColor',
      ]),
    },
    watch: {
      pagination: {
        handler() {
          this.getInterviews();
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
      getInterviews() {
        this.prepareForApiConsumption();
        const path = '/interviews';
        let queryString = 'projection=admin-item';
        if (this.requirement) {
          queryString += `&opportunity.requirement=${this.requirement.id}`;
        }
        queryString += `&page=${this.pagination.page - 1}&size=${this.pagination.rowsPerPage}`;
        queryString += this.pagination.sortBy ? `&sort=${this.pagination.sortBy},${this.pagination.descending ? 'desc' : 'asc'}` : '';
        this
          .api(`${path}?${queryString}`)
          .then((response) => {
            this.interviews = response.data._embedded.interviews;
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
