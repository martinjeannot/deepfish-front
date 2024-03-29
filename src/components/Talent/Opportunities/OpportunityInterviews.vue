<template>
  <v-flex v-if="initialLoading" xs12 class="text-xs-center">
    <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
  </v-flex>
  <v-layout v-else-if="interviews.length" row wrap>
    <v-flex v-if="pendingInterviews.length" xs12 class="pb-3">
      <h3>Choisis <span class="red--text">une</span> proposition d'entretien parmi les suivantes :</h3>
    </v-flex>

    <v-flex xs12 md4
            v-for="(interview, index) in pendingInterviews"
            :key="interview.id"
            :class="['pb-3', {'pl-2': $vuetify.breakpoint.mdAndUp && index !== 0}, {'pr-2': $vuetify.breakpoint.mdAndUp && index !== pendingInterviews.length - 1}]">
      <v-flex xs12 v-if="$vuetify.breakpoint.smAndDown && index !== 0" class="text-xs-center pb-3">
        <h3>ou</h3>
      </v-flex>
      <v-card>
        <v-card-text>
          <v-flex xs12 class="pb-3">
            <span class="font-weight-bold">{{ opportunity.company.name }}</span> te propose un
            <span class="font-weight-bold">entretien {{ interviewFormat(interview.format).text }}</span>
          </v-flex>
          <v-flex xs12>
            <v-icon>event</v-icon>
            <span class="font-weight-bold">
                {{ interview.startAt | formatDate('dddd') }}
                {{ interview.startAt | formatDate('LL') }}
              </span> à
            <span class="font-weight-bold">{{ interview.startAt | formatDate('LT') }}</span>
          </v-flex>
          <v-flex xs12>
            <v-icon>timer</v-icon>
            {{ getLabelFromInterviewDuration(getInterviewDuration(interview).asMinutes()) }}
          </v-flex>
          <v-flex xs12 :class="{'white-space-pre-line': interview.format !== 'PHONE'}">
            <v-icon v-if="interview.format === 'PHONE'">phone</v-icon>
            <v-icon v-else-if="interview.format === 'VIDEO'">videocam</v-icon>
            <v-icon v-else-if="interview.format === 'IN_PERSON'">place</v-icon>
            {{ interview.location }}
          </v-flex>
        </v-card-text>
        <v-card-actions>
          <v-flex xs12 class="text-xs-center">
            <v-btn color="success" :loading="loading" :disabled="loading"
                   @click="selectedInterview = interview; confirmationDialog = true">
              accepter
            </v-btn>
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-flex>

    <v-flex xs12 v-for="interview in confirmedInterviews" :key="interview.id" class="pb-3">
      <v-card>
        <v-card-text>
          <v-flex xs12 class="pb-3">
            Ton <span class="font-weight-bold">entretien {{ interviewFormat(interview.format).text }}</span>
            avec <span class="font-weight-bold">{{ opportunity.company.name }}</span> est
            <span class="font-weight-bold success--text">confirmé</span>.
          </v-flex>
          <v-flex xs12>
            <v-icon>event</v-icon>
            <span class="font-weight-bold">
                {{ interview.startAt | formatDate('dddd') }}
                {{ interview.startAt | formatDate('LL') }}
              </span> à
            <span class="font-weight-bold">{{ interview.startAt | formatDate('LT') }}</span>
          </v-flex>
          <v-flex xs12>
            <v-icon>timer</v-icon>
            {{ getLabelFromInterviewDuration(getInterviewDuration(interview).asMinutes()) }}
          </v-flex>
          <v-flex xs12 :class="{'white-space-pre-line': interview.format !== 'PHONE'}">
            <v-icon v-if="interview.format === 'PHONE'">phone</v-icon>
            <v-icon v-else-if="interview.format === 'VIDEO'">videocam</v-icon>
            <v-icon v-else-if="interview.format === 'IN_PERSON'">place</v-icon>
            {{ interview.location }}
          </v-flex>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-dialog v-model="confirmationDialog" v-if="selectedInterview" max-width="650px">
      <v-card>
        <v-card-title primary-title>
          <v-flex xs12 class="title">
            En route vers ton nouveau job !
          </v-flex>
        </v-card-title>
        <v-card-text>
          <v-flex xs12 class="subheading grey--text text--darken-2">
            Confirmes-tu cet entretien {{ interviewFormat(selectedInterview.format).text }}
            avec {{ opportunity.company.name }}
            le {{ selectedInterview.startAt | formatDate('dddd') }} {{ selectedInterview.startAt | formatDate('LL') }}
            à {{ selectedInterview.startAt | formatDate('LT') }} ?
          </v-flex>
        </v-card-text>
        <v-card-actions>
          <v-flex xs12 class="text-xs-right">
            <v-btn flat color="primary" @click="confirmationDialog = false" :disabled="loading">annuler</v-btn>
            <v-btn color="primary"
                   :disabled="!isUserTalent"
                   :loading="loading"
                   @click="acceptInterview(selectedInterview)"
            >
              Confirmer
            </v-btn>
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import moment from 'moment';
  import { mapGetters, mapState, mapActions } from 'vuex';

  export default {
    name: 'OpportunityInterviews',
    props: ['opportunity'],
    data: () => ({
      initialLoading: false,
      loading: false,
      interviews: [],
      pendingInterviews: [],
      confirmedInterviews: [],
      confirmationDialog: false,
      selectedInterview: null,
    }),
    computed: {
      ...mapGetters([
        'api',
        'isUserTalent',
        'menuBadges',
        'interviewFormat',
      ]),
      ...mapState([
        'getLabelFromInterviewDuration',
      ]),
    },
    methods: {
      ...mapActions([
        'showSnackbar',
        'saveInterviewData',
      ]),
      getInterviews() {
        return this
          .api(`/interviews/search/findByOpportunityIdAndCurrentlyTalentPendingOrConfirmed?opportunityId=${this.opportunity.id}&startAfter=${moment.utc().format()}`)
          .then((response) => {
            this.interviews = response.data._embedded.interviews;
            // pending itw order is reversed because results are ordered by startDateTime DESC
            this.pendingInterviews = this.interviews.filter(interview => interview.talentResponseStatus === 'NEEDS_ACTION').reverse();
            this.confirmedInterviews = this.interviews.filter(interview => interview.status === 'CONFIRMED');
          })
          .catch(() => this.showSnackbar(['Error : could not retrieve interviews', 'error']));
      },
      acceptInterview(interview) {
        this.prepareForApiConsumption();
        const previousState = Object.assign({}, interview);
        interview.talentResponseStatus = 'ACCEPTED';
        return this
          .saveInterview(interview, previousState)
          .then(() => {
            this.menuBadges.opportunities -= 1;
            return this.getInterviews();
          })
          .then(() => {
            this.clearLoading();
            this.confirmationDialog = false;
          });
      },
      saveInterview(interview, previousState) {
        return this
          .saveInterviewData({ interview, previousState })
          .then(() => this.showSnackbar(['Opération terminée avec succès', 'success']))
          .catch(() => this.showSnackbar(['Error : could not save interview', 'error']));
      },
      getInterviewDuration(interview) {
        return moment.duration(moment(interview.endAt).diff(interview.startAt));
      },
      prepareForApiConsumption(initial = false) {
        if (initial) {
          this.initialLoading = true;
        } else {
          this.loading = true;
        }
      },
      clearLoading(initial = false) {
        if (initial) {
          this.initialLoading = false;
        } else {
          this.loading = false;
        }
      },
    },
    created() {
      this.prepareForApiConsumption(true);
      this
        .getInterviews()
        .finally(() => this.clearLoading(true));
    },
  };
</script>

<style scoped>
  .white-space-pre-line {
    white-space: pre-line;
  }
</style>
