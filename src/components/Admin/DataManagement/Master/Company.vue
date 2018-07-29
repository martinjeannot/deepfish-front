<template>
  <v-layout>
    <v-flex xs2 class="pr-3">
      <data-management-navigation></data-management-navigation>
    </v-flex>
    <v-flex xs10>
      <v-layout v-if="initialLoading">
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
        </v-flex>
      </v-layout>
      <v-layout v-else>
        <v-flex xs12>
          <v-flex xs12 v-if="alertComponent">
            <base-alert :type="alertComponent.type" :message="alertComponent.message"
                        @dismissed="onAlertComponentDismissed"></base-alert>
          </v-flex>
          <v-layout v-if="company">
            <v-flex xs4 class="pr-3">
              <v-card>
                <v-card-text>
                  <v-flex xs12 class="text-xs-center mb-3">
                    <h2>{{ company.name }}</h2>
                  </v-flex>
                  <v-flex xs12 class="mb-3">
                    <span style="font-weight: bold">Registration</span> : {{ company.createdAt | formatDate('LLL') }}
                  </v-flex>
                  <v-flex xs12 class="mb-3">
                    <span style="font-weight: bold">Employers :</span>
                    <v-list>
                      <v-list-tile v-for="employer in company.employers" :key="employer.id">
                        <v-list-tile-content>
                          <router-link :to="{ name: 'AdminDMEmployer', params: {id: employer.id} }">
                            {{ employer.lastName.toUpperCase() + ' ' + employer.firstName }}
                          </router-link>
                        </v-list-tile-content>
                      </v-list-tile>
                    </v-list>
                  </v-flex>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs8>
              <v-card>
                <v-card-text>
                  <v-textarea label="Description" v-model="company.description" rows="9"></v-textarea>
                  <div class="text-xs-right">
                    <v-btn icon fab small color="primary" @click="saveCompany">
                      <v-icon>done</v-icon>
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import DataManagementNavigation from '../Navigation';

  export default {
    name: 'data-management-company',
    components: { DataManagementNavigation },
    props: ['id'],
    data: () => ({
      company: null,
    }),
    computed: {
      ...mapGetters([
        'api',
        'initialLoading',
        'loading',
        'alertComponent',
      ]),
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'showSnackbar',
        'showSuccessSnackbar',
        'setErrorAfterApiConsumption',
        'onAlertComponentDismissed',
      ]),
      saveCompany() {
        const company = Object.assign({}, this.company);
        // linked refs deletion
        delete company.employers;
        this.api
          .patch(this.company._links.self.href, company)
          .then(() => this.showSnackbar('Success'))
          .catch(() => {
            this.showSnackbar('Error');
            this.fetchInitialData();
          });
      },
    },
    created() {
      this.prepareForApiConsumption(true);
      this
        .api(`/companies/${this.id}`)
        .then((response) => {
          this.company = response.data;
          return this.api(this.company._links.employers.href);
        })
        .then((response) => {
          this.company.employers = response.data._embedded.employers;
        })
        .catch(() => this.setErrorAfterApiConsumption())
        .finally(() => this.clearLoading(true));
    },
  };
</script>

<style scoped>

</style>
