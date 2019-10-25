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
          <v-layout v-if="employer">
            <v-flex xs4 class="pr-3">
              <v-card>
                <v-card-text>
                  <v-layout wrap>
                    <v-flex xs12 class="text-xs-center">
                      <h2>{{ employer.firstName }} {{ employer.lastName.toUpperCase() }}</h2>
                    </v-flex>
                    <v-flex xs12 class="text-xs-center mb-3">
                      <h4>
                        <router-link :to="{ name: 'AdminDMCompany', params: {id: employer.company.id} }">
                          {{ employer.company.name }}
                        </router-link>
                      </h4>
                    </v-flex>
                    <v-flex xs12 class="mb-3">
                      <span style="font-weight: bold">Registration</span> : {{
                      employer.createdAt | formatDate('LLL') }}
                    </v-flex>
                    <v-flex xs12 class="mb-3">
                      <span style="font-weight: bold">Last Sign-in</span> : {{
                      employer.lastSignedInAt | formatDate('LLL')
                      }}
                    </v-flex>
                    <v-flex xs10 class="pb-3">
                      <v-icon>email</v-icon>
                      <span ref="employerUsername">{{ employer.username }}</span>
                    </v-flex>
                    <v-flex xs2 class="pb-3 text-xs-left">
                      <v-icon
                        @click="copyElementToClipboard($refs.employerUsername)"
                      >
                        file_copy
                      </v-icon>
                    </v-flex>
                    <v-flex xs12>
                      <p>
                        <v-icon>phone</v-icon>
                        {{ employer.phoneNumber }}
                      </p>
                    </v-flex>
                    <v-flex xs12 class="text-xs-center">
                      <v-btn @click="signInAs(employer.username)" dark>Sign in as</v-btn>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs8>
              <v-card>
                <v-tabs grow>
                  <v-tab>Notes</v-tab>
                  <v-tab>Requirements</v-tab>
                  <v-tab-item lazy>
                    <v-card-text>
                      <v-textarea label="Notes" v-model="employer.notes" prepend-inner-icon="lock"
                                  rows="25"></v-textarea>
                      <div class="text-xs-right">
                        <v-btn icon fab small color="primary" @click="saveEmployer">
                          <v-icon>done</v-icon>
                        </v-btn>
                      </div>
                    </v-card-text>
                  </v-tab-item>
                  <v-tab-item>
                    <v-data-table :items="requirements" :headers="headers">
                      <template slot="items" slot-scope="props">
                        <td>{{ props.item.createdAt | formatDate('LLL') }}</td>
                        <td>{{props.item.name}}</td>
                        <td class="justify-center layout">
                          <v-btn icon color="primary" :to="{ name: 'AdminDMRequirement', params: {id: props.item.id} }">
                            <v-icon>visibility</v-icon>
                          </v-btn>
                        </td>
                      </template>
                    </v-data-table>
                  </v-tab-item>
                </v-tabs>
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
    name: 'DataManagementEmployer',
    components: { DataManagementNavigation },
    props: ['id'],
    data: () => ({
      employer: null,
      requirements: null,
      headers: [
        { text: 'Received at', value: 'createdAt' },
        { text: 'Name', value: 'name' },
        { text: 'Actions', value: 'id', sortable: false },
      ],
    }),
    computed: {
      ...mapGetters([
        'api',
        'initialLoading',
        'loading',
        'alertComponent',
        'copyElementToClipboard',
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
        'signInAs',
      ]),
      saveEmployer() {
        const employerData = Object.assign({}, this.employer);
        // linked refs deletion
        delete employerData.company;
        this.api
          .patch(this.employer._links.self.href, employerData)
          .then(() => this.showSnackbar(['Success', 'success']))
          .catch(() => this.showSnackbar(['Error', 'error']));
      },
    },
    created() {
      this.prepareForApiConsumption(true);
      return Promise.all([
        this.api(`/employers/${this.id}`),
        this.api(`/requirements?createdBy=${this.id}`),
      ])
        .then(([employerResponse, requirementsResponse]) => {
          this.employer = employerResponse.data;
          this.requirements = requirementsResponse.data._embedded.requirements;
          return this.api(this.employer._links.company.href);
        })
        .then((response) => {
          this.employer.company = response.data;
        })
        .catch(() => this.setErrorAfterApiConsumption())
        .finally(() => this.clearLoading(true));
    },
  };
</script>

<style scoped>
</style>
