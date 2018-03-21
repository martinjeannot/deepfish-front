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
                  <v-flex xs12 class="text-xs-center">
                    <h2>{{ employer.lastName.toUpperCase() }} {{ employer.firstName }}</h2>
                  </v-flex>
                  <v-flex xs12 class="text-xs-center mb-3">
                    <h4>{{ employer.company.name }}</h4>
                  </v-flex>
                  <v-flex xs12 class="mb-3">
                    <span style="font-weight: bold">Registration</span> : {{ employer.createdAt | formatDate('LLL') }}
                  </v-flex>
                  <v-flex xs12 class="mb-3">
                    <span style="font-weight: bold">Last Sign-in</span> : {{ employer.lastSignedInAt | formatDate('LLL')
                    }}
                  </v-flex>
                  <v-flex xs12 class="mb-3">
                    <v-icon>email</v-icon>
                    {{ employer.username }}
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
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs8 class="elevation-1">
              <v-flex xs12>???</v-flex>
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
    name: 'data-management-employer',
    components: { DataManagementNavigation },
    props: ['id'],
    data: () => ({
      employer: null,
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
        'signInAs',
      ]),
    },
    created() {
      this.prepareForApiConsumption(true);
      this.api(`/employers/${this.id}`)
        .then((response) => {
          this.employer = response.data;
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