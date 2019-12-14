<template>
  <v-card>
    <v-card-text>
      <v-layout wrap>
        <v-flex xs4 class="text-xs-center">
          <v-avatar size="80" class="mr-2">
            <v-img
              :src="profilePictureUrl"
              lazy-src="/static/img/avatar.png"
              alt="picture"
            ></v-img>
          </v-avatar>
        </v-flex>
        <v-flex xs8>
          <h4>
            {{ talent.firstName }}
            <span v-if="isPrivacyEnabled">
              {{ talent.lastName[0] }}.
            </span>
            <span v-else>
              {{ talent.lastName }}
            </span>
          </h4>
          <div v-if="talent.fullProfile && talent.fullProfile.jobs.length">
            {{ talent.fullProfile.jobs[0].jobTitle }}
            chez
            {{ talent.fullProfile.jobs[0].companyName }}
          </div>
          <v-chip
            :color="statusChipColor"
            text-color="white"
          >
            {{ statusChipText }}
          </v-chip>
          <h4 v-if="!isPrivacyEnabled">
            <v-icon>phone</v-icon>
            {{ talent.phoneNumber }}
            <v-icon>email</v-icon>
            {{ talent.email }}
          </h4>
          <div v-if="!isPrivacyEnabled && linkedInProfileUrl">
            <a
              :href="linkedInProfileUrl"
              target="_blank"
            >
              Voir le profil complet
            </a>
          </div>
        </v-flex>
        <v-flex
          v-if="isTalentPending || isTalentInProcess"
          xs12 sm6
          class="pt-3 text-xs-center"
        >
          <v-btn
            color="success"
            :disabled="isInterviewSchedulingDisabled"
            :flat="isTalentInProcess"
            :loading="loading"
            @click.native.stop="scheduleInterview(opportunity)"
          >
            planifier un entretien
          </v-btn>
          <div class="font-italic">{{ interviewProcessStatusLabel }}</div>
        </v-flex>
        <v-flex
          v-if="isTalentPending || isTalentInProcess"
          xs12 sm6
          class="pt-3 text-xs-center"
        >
          <v-btn
            color="error"
            :flat="true"
            :loading="loading"
            @click.native.stop="declinationDialog = true"
          >
            disqualifier ce talent
          </v-btn>
        </v-flex>
      </v-layout>
    </v-card-text>

    <v-dialog v-model="declinationDialog" max-width="650px">
      <v-card>
        <v-card-title>
          <v-flex xs12 class="title">
            Disqualification du talent
          </v-flex>
        </v-card-title>


        <v-form v-model="declinationFormValid" @submit.prevent="declineTalent(opportunity)">
          <v-card-text>
            <v-flex xs12 class="subheading grey--text text--darken-2">
              Écrivez-ici un message pour le talent qui a pris le temps d'étudier votre offre :
              <v-textarea
                v-model="opportunity.employerDeclinationReason"
                rows="7"
                :rules="[rules.required]"
              ></v-textarea>
            </v-flex>
          </v-card-text>
          <v-card-actions>
            <v-flex xs12 class="text-xs-right">
              <v-btn color="primary" :flat="true" @click="declinationDialog = false">Annuler</v-btn>
              <v-btn type="submit" color="error" :flat="true"
                     :disabled="!declinationFormValid" :loading="loading"
              >
                disqualifier
              </v-btn>
            </v-flex>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  import moment from 'moment';
  import { mapGetters, mapActions, mapState } from 'vuex';

  const rules = {
    required: value => !!value || 'This field is required',
  };

  export default {
    name: 'EmployerTalent',
    props: {
      opportunity: Object,
    },
    data: () => ({
      rules,
      declinationDialog: false,
      declinationFormValid: false,
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
        'initialLoading',
        'user',
        'alertComponent',
        'menuBadges',
        'interviewFormat',
      ]),
      ...mapState([
        'getTalentLinkedInProfileUrl',
      ]),
      talent() {
        return this.opportunity.talent;
      },
      profilePictureUrl() {
        if (this.talent.profilePictureUrl && !this.talent.profilePictureUrl.includes('media.licdn.com')) {
          return this.talent.profilePictureUrl;
        }
        return '/static/img/avatar.png';
      },
      linkedInProfileUrl() {
        return this.getTalentLinkedInProfileUrl(this.talent);
      },
      statusChipText() {
        if (this.isTalentContacted) {
          return 'Offre envoyée';
        }
        if (this.isTalentPending) {
          return 'Profil en attente';
        }
        if (this.isTalentInProcess) {
          return 'Profil en process';
        }
        if (this.hasTalentDeclined) {
          return 'Offre refusée';
        }
        return 'N/A';
      },
      statusChipColor() {
        if (this.isTalentContacted) {
          return 'warning';
        }
        if (this.isTalentPending) {
          return 'red';
        }
        if (this.isTalentInProcess) {
          return 'success';
        }
        return 'grey';
      },
      isTalentContacted() {
        return this.opportunity.talentStatus === 'PENDING';
      },
      isTalentPending() {
        return this.opportunity.talentStatus === 'ACCEPTED' && this.opportunity.employerStatus === 'PENDING';
      },
      isTalentInProcess() {
        return this.opportunity.talentStatus === 'ACCEPTED' && this.opportunity.employerStatus === 'ACCEPTED';
      },
      hasTalentDeclined() {
        return this.opportunity.talentStatus === 'DECLINED';
      },
      isPrivacyEnabled() {
        return this.isTalentContacted || this.hasTalentDeclined;
      },
      isInterviewSchedulingDisabled() {
        const now = moment();
        return this.opportunity.interviews.some(interview => now.isBefore(interview.startAt)
        && (interview.status === 'CONFIRMED'
          || (interview.status === 'TENTATIVE'
            && interview.talentResponseStatus === 'NEEDS_ACTION'
          )
        ));
      },
      interviewProcessStatusLabel() {
        const now = moment();
        if (!this.opportunity.interviews.length) {
          return 'Continuez le processus de recrutement en programmant un entretien';
        }
        const pendingOrConfirmedInterview = this.opportunity.interviews
          .find(interview => now.isBefore(interview.startAt)
          && (interview.status === 'CONFIRMED'
          || (interview.status === 'TENTATIVE' && interview.talentResponseStatus === 'NEEDS_ACTION')));
        if (pendingOrConfirmedInterview) {
          if (pendingOrConfirmedInterview.talentResponseStatus === 'NEEDS_ACTION') {
            return 'Demandes d\'entretien en attente de réponse';
          }
          if (pendingOrConfirmedInterview.status === 'CONFIRMED') {
            return `Entretien ${this.interviewFormat(pendingOrConfirmedInterview.format).text} prévu le ${this.$options.filters.formatDate(pendingOrConfirmedInterview.startAt, 'LLL')}`;
          }
        }
        return 'Continuez le processus de recrutement en programmant un nouvel entretien';
      },
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'setAlertComponent',
        'showSnackbar',
        'saveOpportunityData',
      ]),
      scheduleInterview(opportunity) {
        if (opportunity.employerStatus === 'ACCEPTED') {
          return this.$router.push({
            name: 'EmployerInterviewScheduling',
            query: { 'talent-id': opportunity.talent.id, 'opportunity-id': opportunity.id },
          });
        }
        this.prepareForApiConsumption();
        const previousState = Object.assign({}, opportunity);
        opportunity.employerStatus = 'ACCEPTED';
        return this
          .saveOpportunityData({ opportunity, previousState })
          .then(() => {
            this.menuBadges.talents = this.menuBadges.talents - 1;
            return this.$router.push({
              name: 'EmployerInterviewScheduling',
              query: { 'talent-id': opportunity.talent.id, 'opportunity-id': opportunity.id },
            });
          })
          .catch(() => this.$router.go())
          .finally(() => this.clearLoading());
      },
      declineTalent(opportunity) {
        this.prepareForApiConsumption();
        const previousState = Object.assign({}, opportunity);
        opportunity.employerStatus = 'DECLINED';
        this
          .saveOpportunityData({ opportunity, previousState })
          .then(() => {
            this.showSnackbar(['OK', 'success']);
            // user does not have one less pending talent if the talent was previously accepted
            if (previousState.employerStatus === 'PENDING') {
              this.menuBadges.talents = this.menuBadges.talents - 1;
            }
            this.declinationDialog = false;
          })
          .catch(() => this.$router.go())
          .finally(() => this.clearLoading());
      },
    },
  };
</script>

<style scoped>

</style>
