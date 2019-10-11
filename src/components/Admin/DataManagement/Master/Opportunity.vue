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
                  <v-layout wrap>
                    <v-flex xs12 class="pb-3 text-xs-center">
                      <h5 class="headline">
                        {{ opportunity.requirement.name }}
                      </h5>
                    </v-flex>
                    <v-flex xs12 class="pb-3 text-xs-center">
                      for
                      <router-link :to="{ name: 'AdminDMCompany', params: {id: opportunity.company.id} }">
                        {{ opportunity.company.name }}
                      </router-link>
                    </v-flex>
                    <v-flex xs12 class="pb-3 text-xs-center">
                      <v-chip
                        outline
                        :color="getOpportunityStatusColor(opportunity.talentStatus)"
                        class="mr-3"
                      >
                        {{ opportunity.talentStatus }}
                      </v-chip>
                      <v-chip
                        v-if="opportunity.employerStatus"
                        outline
                        :color="getOpportunityStatusColor(opportunity.employerStatus)"
                        class="ml-3"
                      >
                        {{ opportunity.employerStatus }}
                      </v-chip>
                    </v-flex>
                    <v-flex xs12 class="pb-3">
                      <span style="font-weight: bold">Sent to</span> :
                      <router-link :to="{ name: 'AdminDMTalent', params: {id: opportunity.talent.id} }">
                        {{ opportunity.talent.firstName }} {{ opportunity.talent.lastName.toUpperCase() }}
                      </router-link>
                    </v-flex>
                    <v-flex xs12 class="pb-3">
                      <span style="font-weight: bold">Sent by</span> :
                      {{ opportunity.creator.firstName }} {{ opportunity.creator.lastName }}
                    </v-flex>
                    <v-flex xs12 class="py-3 text-xs-center">
                      <h6 class="title">
                        DEAL
                      </h6>
                    </v-flex>
                    <v-flex xs8 class="pb-3 pr-2">
                      <v-menu
                        ref="dealClosedOnMenu"
                        v-model="dealClosedOnMenu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="opportunity.dealClosedOn"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        min-width="290px"
                      >
                        <template #activator="{ on }">
                          <v-text-field
                            v-model="opportunity.dealClosedOn"
                            :clearable="!opportunity.talentStartedOn"
                            hint="Date de signature, oral agreement, etc"
                            label="Deal closed on"
                            persistent-hint
                            prepend-icon="event"
                            readonly
                            v-on="on"
                            @click:clear="clearDealClosedOn"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="opportunity.dealClosedOn"
                          :first-day-of-week="localeFirstDayOfWeek"
                          :locale="locale"
                          :max="opportunity.talentStartedOn"
                          no-title
                          @input="$refs.dealClosedOnMenu.save(opportunity.dealClosedOn); saveOpportunity(opportunity)"
                        ></v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex xs4 class="pb-3 pl-2">
                      <v-text-field
                        ref="baseSalaryInput"
                        v-model="opportunity.baseSalary"
                        label="Base salary"
                        prefix="K€"
                        :rules="[rules.positive, rules.maxValue]"
                        type="number"
                        @change="saveBaseSalary"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 class="pb-3">
                      <v-menu
                        ref="talentStartedOnMenu"
                        v-model="talentStartedOnMenu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="opportunity.talentStartedOn"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        min-width="290px"
                      >
                        <template #activator="{ on }">
                          <v-text-field
                            v-model="opportunity.talentStartedOn"
                            :clearable="!opportunity.trialPeriodTerminatedOn"
                            :disabled="!opportunity.dealClosedOn"
                            hint="Date de démarrage du talent chez le client"
                            label="Talent started on"
                            persistent-hint
                            prepend-icon="event"
                            readonly
                            v-on="on"
                            @click:clear="clearTalentStartedOn"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="opportunity.talentStartedOn"
                          :first-day-of-week="localeFirstDayOfWeek"
                          :locale="locale"
                          :max="opportunity.trialPeriodTerminatedOn"
                          :min="opportunity.dealClosedOn"
                          no-title
                          @input="$refs.talentStartedOnMenu.save(opportunity.talentStartedOn); saveOpportunity(opportunity)"
                        ></v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex xs12 class="pb-3">
                      <v-menu
                        ref="trialPeriodTerminatedOnMenu"
                        v-model="trialPeriodTerminatedOnMenu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="opportunity.trialPeriodTerminatedOn"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        min-width="290px"
                      >
                        <template #activator="{ on }">
                          <v-text-field
                            v-model="opportunity.trialPeriodTerminatedOn"
                            clearable
                            :disabled="!opportunity.talentStartedOn"
                            hint="Date de rupture de la période d'essai par le client/talent"
                            label="Trial period terminated on"
                            persistent-hint
                            prepend-icon="event"
                            readonly
                            v-on="on"
                            @click:clear="clearTrialPeriodTerminatedOn"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="opportunity.trialPeriodTerminatedOn"
                          :first-day-of-week="localeFirstDayOfWeek"
                          :locale="locale"
                          :min="opportunity.talentStartedOn"
                          no-title
                          @input="$refs.trialPeriodTerminatedOnMenu.save(opportunity.trialPeriodTerminatedOn); saveOpportunity(opportunity)"
                        ></v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex xs12 class="pb-3">
                      <v-textarea
                        v-model="opportunity.trialPeriodTerminationReason"
                        :disabled="!opportunity.trialPeriodTerminatedOn"
                        label="Trial period termination reason"
                        @change="saveOpportunity(opportunity)"
                      ></v-textarea>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs8>
              <v-card>
                <v-tabs grow>
                  <v-tab>Timeline</v-tab>
                  <v-tab>Talent</v-tab>
                  <v-tab>Employer</v-tab>
                  <v-tab-item>
                    <v-container>
                      <opportunity-timeline :opportunity="opportunity"></opportunity-timeline>
                    </v-container>
                  </v-tab-item>
                  <v-tab-item>
                    <v-container>
                      <v-layout row wrap>
                        <v-flex xs12 class="mb-3" style="font-weight: bold">Declination reason</v-flex>
                        <v-flex xs12 style="white-space: pre-wrap;">{{ opportunity.talentDeclinationReason }}</v-flex>
                        <v-flex xs12 class="mt-3 mb-3" style="font-weight: bold">Sent pitch</v-flex>
                        <v-flex xs12 style="white-space: pre-wrap;">{{ opportunity.pitch }}</v-flex>
                      </v-layout>
                    </v-container>
                  </v-tab-item>
                  <v-tab-item>
                    <v-container>
                      <v-layout row wrap>
                        <v-flex xs12 class="mb-3" style="font-weight: bold">Declination reason</v-flex>
                        <v-flex xs12 style="white-space: pre-wrap;">{{ opportunity.employerDeclinationReason }}</v-flex>
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
  import OpportunityTimeline from '../../../Opportunity/OpportunityTimeline';

  const rules = {
    positive: value => (!value || value > 0) || 'The value must be greater than 0',
    maxValue: value => (!value || value < 10000) || 'The value is in K€',
  };

  export default {
    name: 'DataManagementOpportunity',
    components: { DataManagementNavigation, OpportunityTimeline },
    props: ['id'],
    data: () => ({
      rules,
      opportunity: null,
      dealClosedOnMenu: false,
      talentStartedOnMenu: false,
      trialPeriodTerminatedOnMenu: false,
    }),
    computed: {
      ...mapGetters([
        'api',
        'initialLoading',
        'loading',
        'alertComponent',
        'locale',
        'localeFirstDayOfWeek',
      ]),
      ...mapState([
        'getOpportunityStatusColor',
      ]),
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'saveOpportunityData',
        'showSnackbar',
        'setErrorAfterApiConsumption',
        'onAlertComponentDismissed',
      ]),
      clearDealClosedOn() {
        this.opportunity.dealClosedOn = null;
        return this.saveOpportunity(this.opportunity);
      },
      clearTalentStartedOn() {
        this.opportunity.talentStartedOn = null;
        return this.saveOpportunity(this.opportunity);
      },
      clearTrialPeriodTerminatedOn() {
        this.opportunity.trialPeriodTerminatedOn = null;
        return this.saveOpportunity(this.opportunity);
      },
      saveBaseSalary() {
        if (this.$refs.baseSalaryInput.valid) {
          return this.saveOpportunity(this.opportunity);
        }
        return Promise.resolve();
      },
      saveOpportunity(opportunity) {
        this.prepareForApiConsumption();
        return this
          .saveOpportunityData({ opportunity })
          .then(() => this.showSnackbar(['Opportunity saved', 'success']))
          .catch(() => this.showSnackbar(['Error', 'error']))
          .finally(() => this.clearLoading());
      },
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
