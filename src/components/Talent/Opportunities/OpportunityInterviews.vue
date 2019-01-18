<template>
  <v-flex v-if="initialLoading" xs12 class="text-xs-center">
    <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
  </v-flex>
  <v-flex v-else-if="interviews.length" xs12>
    <v-flex v-if="pendingInterviews.length" xs12 class="mb-3">
      <h3>Tu as des demandes d'entretien en attente de réponse ! Choisis une proposition parmi les suivantes :</h3>
    </v-flex>
    <v-card v-for="interview in pendingInterviews" :key="interview.id" class="mb-3">
      <v-card-text>
        <v-flex xs12>
          <v-icon color="warning">event</v-icon>
          <span class="font-weight-bold">{{ opportunity.company.name }}</span> te propose un
          <span class="font-weight-bold">entretien {{ getLabelFromInterviewFormat(interview.format) }}</span> le
          <span class="font-weight-bold">
              {{ interview.startAt | formatDate('dddd') }}
              {{ interview.startAt | formatDate('LL') }}
            </span> à
          <span class="font-weight-bold">{{ interview.startAt | formatDate('LT') }}</span>
        </v-flex>
      </v-card-text>
      <v-card-actions>
        <v-flex xs12 class="text-xs-center">
          <v-btn color="success" :loading="loading" :disabled="loading"
                 @click="acceptInterview(interview)">
            accepter ce créneau
          </v-btn>
        </v-flex>
      </v-card-actions>
    </v-card>
    <v-card v-for="interview in acceptedInterviews" :key="interview.id" class="mb-3">
      <v-card-text>
        <v-flex xs12>
          <v-icon color="success">event</v-icon>
          Ton <span class="font-weight-bold">entretien {{ getLabelFromInterviewFormat(interview.format) }}</span> avec
          <span class="font-weight-bold">{{ opportunity.company.name }}</span> le
          <span class="font-weight-bold">
              {{ interview.startAt | formatDate('dddd') }}
              {{ interview.startAt | formatDate('LL') }}
            </span> à
          <span class="font-weight-bold">{{ interview.startAt | formatDate('LT') }}</span> est confirmé !
        </v-flex>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
  import { mapGetters, mapState, mapActions } from 'vuex';

  export default {
    name: 'OpportunityInterviews',
    props: ['opportunity'],
    data: () => ({
      initialLoading: false,
      loading: false,
      interviews: [],
      pendingInterviews: [],
      acceptedInterviews: [],
    }),
    computed: {
      ...mapGetters([
        'api',
      ]),
      ...mapState([
        'getLabelFromInterviewFormat',
      ]),
    },
    methods: {
      ...mapActions([
        'showSnackbar',
        'saveInterviewData',
      ]),
      getInterviews() {
        return this
          .api(`/interviews?opportunity=${this.opportunity.id}&talentResponseStatus=NEEDS_ACTION&talentResponseStatus=ACCEPTED`)
          .then((response) => {
            this.interviews = response.data._embedded.interviews;
            this.pendingInterviews = this.interviews.filter(interview => interview.talentResponseStatus === 'NEEDS_ACTION');
            this.acceptedInterviews = this.interviews.filter(interview => interview.talentResponseStatus === 'ACCEPTED');
          })
          .catch(() => this.showSnackbar('Error : could not retrieve interviews'));
      },
      acceptInterview(interview) {
        this.prepareForApiConsumption();
        const previousState = Object.assign({}, interview);
        interview.talentResponseStatus = 'ACCEPTED';
        return this
          .saveInterview(interview, previousState)
          .then(() => this.getInterviews())
          .then(() => this.clearLoading());
      },
      saveInterview(interview, previousState) {
        return this
          .saveInterviewData({ interview, previousState })
          .then(() => this.showSnackbar('Opération terminée avec succès'))
          .catch(() => this.showSnackbar('Error : could not save interview'));
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

</style>
