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
                  <v-flex v-if="requirement.typeform" xs12>
                    <typeform-answers :typeform="requirement.typeform"></typeform-answers>
                  </v-flex>
                  <v-flex v-else xs12 class="mb-3">
                    Since the <span style="font-weight: bold">{{ requirement.createdAt | formatDate('LLL') }}</span>
                    <router-link :to="{ name: 'AdminDMCompany', params: {id: requirement.company.id} }">
                      {{ requirement.company.name }}
                    </router-link>
                    &nbsp;is looking for a
                    <span style="font-weight: bold">{{ requirement.seniority.l10nKey }}</span>
                    <span style="font-weight: bold">{{ requirement.jobType.l10nKey }}</span>
                    based in
                    <span style="font-weight: bold">{{ requirement.location }}</span>
                    for a max fixed salary of
                    <span style="font-weight: bold">{{ requirement.fixedSalary }} €</span>
                  </v-flex>
                  <v-flex xs12>
                    <h3 class="text-xs-center">Sent opportunities : {{ opportunitiesCounts.total }}</h3>
                    <doughnut-chart :data="doughnutChartData"></doughnut-chart>
                  </v-flex>
                  <v-flex xs12 class="text-xs-center mt-3">
                    <v-btn v-if="requirement.status === 'OPEN'" color="error" @click="showDialogAlert">Archiver</v-btn>
                    <v-btn v-else color="success" @click="openRequirement">Désarchiver</v-btn>
                  </v-flex>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs8>
              <v-card>
                <v-tabs grow>
                  <v-tab>Requirement name</v-tab>
                  <v-tab>Declination reason</v-tab>
                  <v-tab-item>
                    <v-card-text>
                      <v-text-field v-model="requirement.name" label="Requirement name"></v-text-field>
                      <v-textarea label="Notes" v-model="requirement.notes" prepend-inner-icon="lock"
                                  rows="27"></v-textarea>
                      <div class="text-xs-right">
                        <v-btn icon fab small color="primary" @click="saveRequirement(requirement)">
                          <v-icon>done</v-icon>
                        </v-btn>
                      </div>
                    </v-card-text>
                  </v-tab-item>
                  <v-tab-item>
                    <v-list v-if="declinedOpportunities.length">
                      <template v-for="opportunity in declinedOpportunities">
                        <v-divider :key="opportunity.id + '-divider'"></v-divider>
                        <v-layout :key="opportunity.id + '-row'" class="pa-3">
                          <v-flex xs4>
                            <span class="font-weight-bold red--text">{{ opportunity.company.name }}</span>
                            declined
                            <span class="font-weight-bold blue--text">
                              {{ opportunity.talent.firstName }}
                              {{ opportunity.talent.lastName }}
                            </span>
                          </v-flex>
                          <v-flex xs8>
                            {{ opportunity.employerDeclinationReason }}
                          </v-flex>
                        </v-layout>
                      </template>
                    </v-list>
                    <v-flex xs12 v-else class="text-xs-center pa-3">
                      <h3>
                        Aucun talent refusé pour ce besoin
                      </h3>
                    </v-flex>
                  </v-tab-item>
                </v-tabs>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-dialog v-model="alertDialog" max-width="650px">
      <v-container style="background-color: white">
        <v-form @submit.prevent="closeRequirement">
          <v-layout row wrap>
            <v-flex xs1>
              <v-icon>warning</v-icon>
            </v-flex>
            <v-flex xs11>
              <h3>
                Attention, cette action entraînera la désactivation de ce requirement !
              </h3>
            </v-flex>
            <v-flex xs12>
            </v-flex>
            <v-flex xs12 class="text-xs-center">
              <v-btn type="submit" color="primary" class="mt-4">Valider</v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-container>
    </v-dialog>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import DataManagementNavigation from '../Navigation';
  import TypeformAnswers from '../../../Employer/Requirements/TypeformAnswers';

  export default {
    name: 'data-management-requirement',
    components: { DataManagementNavigation, TypeformAnswers },
    props: ['id'],
    data: () => ({
      requirement: null,
      opportunitiesCounts: null,
      declinedOpportunities: null,
      alertDialog: false,
    }),
    computed: {
      ...mapGetters([
        'api',
        'initialLoading',
        'loading',
        'alertComponent',
      ]),
      doughnutChartData() {
        return {
          labels: ['Accepted', 'Pending', 'Declined'],
          datasets: [
            {
              backgroundColor: ['#25CD73', '#FFC62E', '#FF5D2E'],
              data: [
                this.opportunitiesCounts.acceptedCount,
                this.opportunitiesCounts.pendingCount,
                this.opportunitiesCounts.declinedCount,
              ],
            },
          ],
        };
      },
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'showSnackbar',
        'showSuccessSnackbar',
        'setErrorAfterApiConsumption',
        'onAlertComponentDismissed',
        'saveRequirementData',
      ]),
      saveRequirement(requirement) {
        this.saveRequirementData(requirement)
          .then(() => this.showSnackbar('Success'))
          .catch(() => this.showSnackbar('Error'));
      },
      formattedDeclinationReason(opportunity) {
        return `<span style="display: contents; font-weight: bold">${opportunity.talent.firstName} ${opportunity.talent.lastName}</span> &mdash; ${opportunity.employerDeclinationReason}`;
      },
      closeRequirement() {
        this.requirement.status = 'CLOSED';
        this.saveRequirement(this.requirement);
        this.alertDialog = false;
      },
      openRequirement() {
        this.requirement.status = 'OPEN';
        this.saveRequirement(this.requirement);
      },
      showDialogAlert() {
        this.alertDialog = !this.alertDialog;
      },
    },
    created() {
      this.prepareForApiConsumption(true);
      Promise.all([
        this.api(`/requirements/${this.id}?projection=admin`),
        this.api(`/opportunities/counts?requirementId=${this.id}`),
        this.api(`/opportunities?projection=admin&requirement=${this.id}&employerStatus=DECLINED`),
      ])
        .then(([requirementResponse, opportunitiesCountsResponse, declinedOpportunitiesResponse]) => {
          this.requirement = requirementResponse.data;
          this.opportunitiesCounts = opportunitiesCountsResponse.data;
          this.declinedOpportunities = declinedOpportunitiesResponse.data._embedded.opportunities;
        })
        .catch(() => this.setErrorAfterApiConsumption())
        .finally(() => this.clearLoading(true));
    },
  };
</script>

<style scoped>
</style>
