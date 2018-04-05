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
          <v-layout v-if="requirement">
            <v-flex xs4 class="pr-3">
              <v-card>
                <v-card-text>
                  <v-flex xs12 class="text-xs-center mb-3">
                    <h2>{{ requirement.name }}</h2>
                  </v-flex>
                  <v-flex xs12 class="mb-3">
                    Since the
                    <span style="font-weight: bold">{{ requirement.createdAt | formatDate('LLL') }}</span>
                    <router-link :to="{ name: 'AdminDMCompany', params: {id: requirement.company.id} }">
                      {{ requirement.company.name }}
                    </router-link>
                    &nbsp;is looking for a
                    <span style="font-weight: bold">{{ requirement.seniority.l10nKey }}</span>
                    <span style="font-weight: bold">{{ requirement.job.l10nKey }}</span>
                    based in
                    <span style="font-weight: bold">{{ requirement.location }}</span>
                    for a max fixed salary of
                    <span style="font-weight: bold">{{ requirement.fixedSalary }} €</span>
                  </v-flex>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs8>
              <v-card>
                COMING SOON
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
    name: 'data-management-requirement',
    components: { DataManagementNavigation },
    props: ['id'],
    data: () => ({
      requirement: null,
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
    },
    created() {
      this.prepareForApiConsumption(true);
      this
        .api(`/requirements/${this.id}?projection=default`)
        .then((response) => {
          this.requirement = response.data;
        })
        .catch(() => this.setErrorAfterApiConsumption())
        .finally(() => this.clearLoading(true));
    },
  };
</script>

<style scoped>

</style>