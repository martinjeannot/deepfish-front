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
          <v-layout v-if="opportunity">
            <v-flex xs4 class="pr-3">
              <v-card>
                <v-card-text>
                  <v-flex xs12 class="text-xs-center mb-3">
                    <h2>{{ opportunity.requirement.name }}</h2>
                    <div>
                      for
                      <router-link :to="{ name: 'AdminDMCompany', params: {id: opportunity.company.id} }">
                        {{ opportunity.company.name }}
                      </router-link>
                    </div>
                    <v-chip outline :color="getOpportunityStatusColor(opportunity.status)">
                      {{ opportunity.status }}
                    </v-chip>
                  </v-flex>
                  <v-flex xs12 class="mb-3">
                    <span style="font-weight: bold">Sent to</span> :
                    <router-link :to="{ name: 'AdminDMTalent', params: {id: opportunity.talent.id} }">
                      {{ opportunity.talent.lastName.toUpperCase() }} {{ opportunity.talent.firstName }}
                    </router-link>
                  </v-flex>
                  <v-flex xs12 class="mb-3">
                    <span style="font-weight: bold">Sent at</span> : {{ opportunity.createdAt | formatDate('LLL') }}
                  </v-flex>
                  <v-flex xs12 class="mb-3">
                    <span style="font-weight: bold">Sent by</span> :
                    {{ opportunity.creator.firstName }} {{ opportunity.creator.lastName }}
                  </v-flex>
                  <v-flex xs12 class="mb-3 d-flex">
                    <span class="pt-1" style="font-weight: bold">Forwarded to employer</span>
                    <span>
                      <v-checkbox :input-value="opportunity.forwarded" disabled></v-checkbox>
                    </span>
                  </v-flex>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs8>
              <v-card>
                <v-tabs grow>
                  <v-tab>Talent</v-tab>
                  <v-tab>Employer</v-tab>
                  <v-tab-item>
                    <v-container>
                      <v-layout row wrap>
                        <v-flex xs12 class="mb-3" style="font-weight: bold">Sent pitch</v-flex>
                        <v-flex xs12 style="white-space: pre-wrap;">{{ opportunity.pitch }}</v-flex>
                      </v-layout>
                    </v-container>
                  </v-tab-item>
                  <v-tab-item>
                    <v-container>
                      <v-layout row wrap>
                        <v-flex xs12 class="mb-3" style="font-weight: bold">Declination reason</v-flex>
                        <v-flex xs12>{{ opportunity.employerDeclinationReason }}</v-flex>
                      </v-layout>
                    </v-container>
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
  import { mapGetters, mapActions, mapState } from 'vuex';
  import DataManagementNavigation from '../Navigation';

  export default {
    name: 'data-management-opportunity',
    components: { DataManagementNavigation },
    props: ['id'],
    data: () => ({
      opportunity: null,
    }),
    computed: {
      ...mapGetters([
        'api',
        'initialLoading',
        'loading',
        'alertComponent',
      ]),
      ...mapState([
        'getOpportunityStatusColor',
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
        .api(`/opportunities/${this.id}?projection=admin`)
        .then((response) => {
          this.opportunity = response.data;
        })
        .catch(() => this.setErrorAfterApiConsumption())
        .finally(() => this.clearLoading(true));
    },
  };
</script>

<style scoped>

</style>
