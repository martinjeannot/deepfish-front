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
            <base-alert :type="alertComponent.type" :message="alertComponent.message" @dismissed="onAlertComponentDismissed"></base-alert>
          </v-flex>
          <v-layout v-if="requirement">
            <v-flex xs4 class="pr-3">
              <v-card>
                <v-card-text>
                  <v-flex xs12 class="text-xs-center mb-3">
                    <h2>{{ requirement.name }}</h2>
                  </v-flex>
                  <v-flex v-if="requirement.typeform" xs12>
                    <v-flex xs12 v-for="(answer, index) in typeformAnswers" :key="index" class="mt-2">
                      <div class="font-weight-bold">{{ answer.question }}</div>
                      <div>{{ answer.value }}</div>
                    </v-flex>
                  </v-flex>
                  <v-flex v-else xs12 class="mb-3">
                    Since the
                    <span style="font-weight: bold">{{ requirement.createdAt | formatDate('LLL') }}</span>
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
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs8>
              <v-card>
                <v-tabs grow>
                  <v-tab>Requirement name</v-tab>
                  <v-tab>Declination reason</v-tab>
                  <v-tab-item>
                    <v-container>
                      <v-layout row wrap>
                        <v-card-text>
                          <v-text-field v-model="requirement.name" label="Requirement name"></v-text-field>
                          <v-textarea label="Notes" v-model="requirement.notes" prepend-inner-icon="lock" rows="27"></v-textarea>
                          <div class="text-xs-right">
                            <v-btn icon fab small color="primary" @click="saveRequirement(requirement)">
                              <v-icon>done</v-icon>
                            </v-btn>
                          </div>
                        </v-card-text>
                      </v-layout>
                    </v-container>
                  </v-tab-item>
                  <v-tab-item>
                    <v-container>
                      <v-layout row wrap>
                        IN PROGRESS
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
import { mapGetters, mapActions } from 'vuex';
import DataManagementNavigation from '../Navigation';

export default {
  name: 'data-management-requirement',
  components: { DataManagementNavigation },
  props: ['id'],
  data: () => ({
    requirement: null,
    opportunitiesCounts: null,
    // currentRequirement: null,
  }),
  computed: {
    ...mapGetters(['api', 'initialLoading', 'loading', 'alertComponent']),
    typeformAnswers() {
      return this.requirement.typeform.form_response.answers.map((answer) => {
        const question = this.requirement.typeform.form_response.definition.fields.find(
          field => field.id === answer.field.id,
        ).title;
        let value = null;
        switch (answer.type) {
          case 'text':
            value = answer.text;
            break;
          default:
            value = 'N/A';
        }
        return { question, value };
      });
    },
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
    ]),
    saveRequirement(requirement) {
      const requirementData = Object.assign({}, requirement);
      delete requirementData.company;
      delete requirementData.jobType;
      delete requirementData.seniority;
      this.api
        .patch(requirement._links.self.href, requirementData)
        .then(() => this.showSnackbar('Success'))
        .catch(() => this.showSnackbar('Error'));
    },
  },
  created() {
    this.prepareForApiConsumption(true);
    Promise.all([
      this.api(`/requirements/${this.id}?projection=admin`),
      this.api(`/opportunities/counts?requirementId=${this.id}`),
      // this.api(`/opportunities/${this.id}/requirement`),
    ])
      .then(([requirementResponse, opportunitiesCountsResponse]) => {
        this.requirement = requirementResponse.data;
        this.opportunitiesCounts = opportunitiesCountsResponse.data;
        // this.currentRequirement = currentRequirementResponse;
      })
      .catch(() => this.setErrorAfterApiConsumption())
      .finally(() => this.clearLoading(true));
  },
};
</script>

<style scoped>
</style>
