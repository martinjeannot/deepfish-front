<template>
  <v-layout v-if="initialLoading">
    <v-flex xs12 class="text-xs-center">
      <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
    </v-flex>
  </v-layout>
  <v-layout row wrap v-else>
    <v-layout v-if="alertComponent">
      <v-flex xs12 sm6 offset-sm3>
        <base-alert :type="alertComponent.type" :message="alertComponent.message"
                    @dismissed="onAlertComponentDismissed"></base-alert>
      </v-flex>
    </v-layout>
    <v-flex xs12 v-for="requirement in requirements" :key="requirement.id + reRenderingVersion">
      <v-card>
        <v-card-text>
          <v-layout wrap>
            <v-flex xs12 sm6 class="text-xs-center" style="padding-top: 5%">
              <h3 class="pb-2 headline font-weight-bold">
                <span style="text-decoration: underline;">Votre besoin</span>
                :
                <router-link :to="{name: 'EmployerRequirement', params: {id: requirement.id}}">
                  {{ requirement.name }}
                </router-link>
              </h3>
              <div class="pb-2">
                Nombre de talents Deepfish contactés pour ce besoin :
                <span style="font-weight: bold">{{ requirement.opportunitiesCounts.total }}</span>
              </div>
              <div class="font-italic">
                Les profils ayant acceptés votre opportunité mais non encore visibles sur votre espace sont soit en cours de qualification, soit non retenus après qualification
              </div>
            </v-flex>
            <v-flex xs12 sm6 class="text-xs-center">
              <v-flex xs12 sm6 offset-sm3 lg4 offset-lg4>
                <doughnut-chart :data="getDoughnutChartData(requirement.opportunitiesCounts)"
                                :options="{responsive: true, maintainAspectRatio: true, title: {display: true, text: 'Répartition des réponses talents'}}"></doughnut-chart>
              </v-flex>
            </v-flex>
            <v-icon style="margin: 0 auto; width: 100%;" size="5rem">keyboard_arrow_down</v-icon>
          </v-layout>
        </v-card-text>
      </v-card>
      <v-container fluid grid-list-xs>
        <v-data-iterator content-tag="v-layout" row wrap :items="requirement.opportunities" :hide-actions="true">
          <v-flex slot="item" slot-scope="props" xs12>
            <v-card :style="isTalentDeclined(props.item) ? 'display: none' : ''">
              <v-card-title>
                <v-flex xs4 sm2 class="text-xs-center">
                  <v-avatar size="80" class="mr-2">
                    <v-img
                      :src="props.item.talent.profilePictureUrl"
                      lazy-src="static/img/avatar.png"
                      alt="picture"
                    ></v-img>
                  </v-avatar>
                </v-flex>
                <v-flex xs8 sm4>
                  <h4>{{ props.item.talent.firstName }} {{ props.item.talent.lastName[0] }}.</h4>
                  <v-tooltip top>
                    <template #activator="{ on }">
                      <v-chip v-if="isTalentPending(props.item)" color="red" text-color="white" v-on="on">
                        Nouveau profil à traiter
                      </v-chip>
                    </template>
                    <span>Il faut nous donner une réponse pour ce profil (accepté ou refusé ?)</span>
                  </v-tooltip>
                  <h4 v-if="isTalentAccepted(props.item)" class="red--text">
                    <v-icon>phone</v-icon>
                    {{ props.item.talent.phoneNumber }}
                    <v-icon>email</v-icon>
                    {{ props.item.talent.email }}
                  </h4>
                  <div v-if="props.item.talent.basicProfile && props.item.talent.basicProfile.positions._total">
                    {{ props.item.talent.basicProfile.positions.values[0].title
                    }} chez {{ props.item.talent.basicProfile.positions.values[0].company.name }}
                  </div>
                  <div v-if="getTalentLinkedInProfileUrl(props.item.talent)">
                    <a :href="getTalentLinkedInProfileUrl(props.item.talent)"
                       target="_blank">Voir le profil complet</a>
                  </div>
                </v-flex>
                <v-flex xs12 class="mt-2">
                  Ce talent a accepté votre opportunité le {{ props.item.forwardedAt | formatDate('LL') }}.
                </v-flex>
                <v-flex xs12>
                  Ce profil a <span style="font-weight: bold">{{ props.item.talent.yearsOfExperience
                  }} années d'expérience</span>
                  et se place à <span
                  style="font-weight: bold">{{ props.item.talent.conditions.fixedSalary | formatMonetaryAmount
                  }} €</span> de salaire fixe.
                </v-flex>
                <v-flex xs12 v-if="props.item.talent.conditions.taskTypes.length">
                  Missions acceptées :
                  <v-chip v-for="taskType in props.item.talent.conditions.taskTypes" :key="taskType.id">
                    {{ taskType.l10nKey }}
                  </v-chip>
                </v-flex>
                <v-flex xs12 sm6 v-if="props.item.talent.selfPitch" class="mt-2" style="align-self: flex-start">
                  <div class="pb-2" style="font-weight: bold">La présentation du talent</div>
                  <div style="white-space: pre-wrap">{{ props.item.talent.selfPitch }}</div>
                </v-flex>
                <v-flex xs12 sm6 v-if="props.item.talent.qualification.recommendation" class="mt-2"
                        style="align-self: flex-start">
                  <div class="pb-2" style="font-weight: bold">L'avis de Deepfish</div>
                  <div style="white-space: pre-wrap">{{ props.item.talent.qualification.recommendation }}</div>
                </v-flex>
              </v-card-title>
              <v-card-title v-if="isTalentPending(props.item)">
                <v-layout row wrap>
                  <v-flex xs12 sm4 class="text-xs-center">
                    <v-btn color="success" :loading="loading" :disabled="loading"
                           @click.native.stop="scheduleInterview(props.item)">
                      planifier un entretien
                    </v-btn>
                  </v-flex>
                  <v-flex xs12 sm4 class="text-xs-center">
                    <v-btn color="info" :loading="loading" :disabled="loading"
                           @click.native.stop="selectedOpportunity = props.item; contactDialog = true">
                      J'ai une question sur ce talent
                    </v-btn>
                  </v-flex>
                  <v-flex xs12 sm4 class="text-xs-center">
                    <v-btn color="error" :loading="loading" :disabled="loading"
                           @click.native.stop="selectedOpportunity = props.item; declinationDialog = true">
                      refuser ce talent
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card-title>
              <v-card-actions v-if="isTalentAccepted(props.item)">
                <v-layout row wrap>
                  <v-flex xs12 sm4 class="text-xs-center">
                    <v-btn flat color="success" :loading="loading"
                           :disabled="loading || isInterviewSchedulingDisabled(props.item.interviews)"
                           @click.native.stop="scheduleInterview(props.item)">
                      planifier un entretien
                    </v-btn>
                    <div class="font-italic">{{ getInterviewProcessStatusLabel(props.item.interviews) }}</div>
                  </v-flex>
                  <v-flex xs12 sm4 class="text-xs-center">
                    <v-btn v-if="isAskingAboutTalentButtonShown(props.item)"
                           flat color="info" :loading="loading" :disabled="loading"
                           @click.native.stop="selectedOpportunity = props.item; contactDialog = true">
                      J'ai une question sur ce talent
                    </v-btn>
                    <v-btn v-else flat color="info" :loading="loading" :disabled="loading"
                           @click.native.stop="selectedOpportunity = props.item; followUpDialog = true">
                      Faire mon retour sur ce talent
                    </v-btn>
                  </v-flex>
                  <v-flex xs12 sm4 class="text-xs-center">
                    <v-btn flat color="error" :loading="loading" :disabled="loading"
                           @click.native.stop="selectedOpportunity = props.item; declinationDialog = true">
                      ne plus retenir ce talent
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-data-iterator>
      </v-container>
    </v-flex>

    <v-dialog v-model="contactDialog" v-if="selectedOpportunity" max-width="650px">
      <v-card>
        <v-card-text>
          <v-form v-model="contactFormValid" @submit.prevent="contactAdmins(selectedOpportunity)">
            <v-layout wrap>
              <v-flex xs12>
                <h3>Posez vos questions et Deepfish reviendra rapidement vers vous :</h3>
              </v-flex>
              <v-flex xs12>
                <v-textarea v-model="contactMessage" rows="7" :rules="[rules.required]"></v-textarea>
              </v-flex>
              <v-flex xs12 class="text-xs-right">
                <v-btn type="submit" fab small color="primary" :disabled="!contactFormValid || loading"
                       :loading="loading">
                  <v-icon>done</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="followUpDialog" v-if="selectedOpportunity" max-width="650px">
      <v-card>
        <v-card-title>
          <v-flex xs12 class="title">
            Mon retour sur {{ selectedOpportunity.talent.firstName }}
          </v-flex>
        </v-card-title>
        <v-form v-model="followUpFormValid" @submit.prevent="sendFollowUpMessage(selectedOpportunity)">
          <v-card-text>
            <v-flex xs12 class="subheading grey--text text--darken-2">
              Facilitez nos échanges en nous communiquant directement votre avis sur ce talent (visible uniquement par Deepfish) :
              <v-textarea
                v-model="followUpMessage"
                rows="9"
                :rules="[rules.required]"
              ></v-textarea>
            </v-flex>
          </v-card-text>
          <v-card-actions>
            <v-flex xs12 class="text-xs-right">
              <v-btn flat color="primary" @click="followUpDialog = false">Annuler</v-btn>
              <v-btn type="submit" flat color="primary" :disabled="!followUpFormValid" :loading="loading">
                Envoyer
              </v-btn>
            </v-flex>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog v-model="declinationDialog" v-if="selectedOpportunity" max-width="650px">
      <v-card>
        <v-card-text>
          <v-form v-model="employerDeclinationValid" @submit.prevent="declineTalent(selectedOpportunity)">
            <v-layout wrap>
              <v-flex xs12>
                <h3>Expliquez-nous la raison de votre refus pour améliorer nos recherches</h3>
                <div class="font-italic">(Nous ne communiquons pas cette information au talent)</div>
              </v-flex>
              <v-flex xs12>
                <v-textarea v-model="selectedOpportunity.employerDeclinationReason" rows="7"
                            :rules="[rules.required]"></v-textarea>
              </v-flex>
              <v-flex xs12 class="text-xs-right">
                <v-btn type="submit" fab small color="primary" :disabled="!employerDeclinationValid || loading"
                       :loading="loading">
                  <v-icon>done</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import moment from 'moment';
  import { mapGetters, mapActions, mapState } from 'vuex';

  const rules = {
    required: value => !!value || 'This field is required',
  };

  export default {
    name: 'EmployerTalents',
    data: () => ({
      rules,
      requirements: [],
      selectedOpportunity: null,
      contactDialog: false,
      contactFormValid: false,
      contactMessage: '',
      followUpDialog: false,
      followUpFormValid: false,
      followUpMessage: '',
      declinationDialog: false,
      employerDeclinationValid: false,
      reRenderingVersion: 0,
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
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'setAlertComponent',
        'onAlertComponentDismissed',
        'showSnackbar',
        'saveOpportunityData',
      ]),
      isTalentPending(opportunity) {
        return !opportunity.employerStatus || opportunity.employerStatus === 'PENDING';
      },
      isTalentAccepted(opportunity) {
        return opportunity.employerStatus === 'ACCEPTED';
      },
      isTalentDeclined(opportunity) {
        return opportunity.employerStatus === 'DECLINED';
      },
      getDoughnutChartData(opportunitiesCounts) {
        return {
          labels: ['Opportunités acceptées', 'Opportunités en attente', 'Opportunités refusées'],
          datasets: [
            {
              backgroundColor: ['#25CD73', '#FFC62E', '#FF5D2E'],
              data: [opportunitiesCounts.acceptedCount, opportunitiesCounts.pendingCount,
                opportunitiesCounts.declinedCount],
            },
          ],
        };
      },
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
          .saveOpportunity(opportunity, previousState)
          .then(() => {
            this.menuBadges.talents = this.menuBadges.talents - 1;
            return this.$router.push({
              name: 'EmployerInterviewScheduling',
              query: { 'talent-id': opportunity.talent.id, 'opportunity-id': opportunity.id },
            });
          })
          .catch(error => this.handleOpportunitySavingError(opportunity, previousState, error))
          .finally(() => this.clearLoading());
      },
      declineTalent(opportunity) {
        this.prepareForApiConsumption();
        const previousState = Object.assign({}, opportunity);
        opportunity.employerStatus = 'DECLINED';
        this
          .saveOpportunity(opportunity, previousState)
          .then(() => {
            // user does not have one less pending talent if the talent was previously accepted
            if (previousState.employerStatus === 'PENDING') {
              this.menuBadges.talents = this.menuBadges.talents - 1;
            }
            this.declinationDialog = false;
          })
          .catch(error => this.handleOpportunitySavingError(opportunity, previousState, error))
          .finally(() => this.clearLoading());
      },
      handleOpportunitySavingError(opportunity, previousState, error) {
        // https://vuejs.org/v2/guide/list.html#Caveats
        const requirementIndex = this.requirements
          .findIndex(req => req.id === opportunity.requirement.id);
        const opportunityIndex = this.requirements[requirementIndex].opportunities
          .findIndex(opport => opport.id === opportunity.id);
        this.$set(
          this.requirements[requirementIndex].opportunities,
          opportunityIndex,
          { ...opportunity, ...previousState });
        return Promise.reject(error);
      },
      saveOpportunity(opportunity, previousState) {
        return this
          .saveOpportunityData({ opportunity, previousState })
          .then(() => this.showSnackbar(['Opération terminée avec succès', 'success']))
          .catch((error) => {
            this.showSnackbar(['Erreur', 'error']);
            return Promise.reject(error);
          });
      },
      contactAdmins(opportunity) {
        this.prepareForApiConsumption();
        this.api
          .post('/employers/contact', {
            employerId: this.user.id,
            talentId: opportunity.talent.id,
            message: this.contactMessage,
          })
          .then(() => {
            this.contactDialog = false;
            this.showSnackbar(['Merci, nous revenons vers vous sous peu', 'success']);
          })
          .catch(() => this.showSnackbar(['Erreur', 'error']))
          .finally(() => this.clearLoading());
      },
      sendFollowUpMessage(opportunity) {
        this.prepareForApiConsumption();
        this.api
          .post('/employers/follow-up', {
            employerId: this.user.id,
            talentId: opportunity.talent.id,
            message: this.followUpMessage,
          })
          .then(() => {
            this.followUpDialog = false;
            this.followUpMessage = '';
            this.showSnackbar(['Merci, nous revenons vers vous sous peu', 'success']);
          })
          .catch(() => this.showSnackbar(['Erreur', 'error']))
          .finally(() => this.clearLoading());
      },
      isAskingAboutTalentButtonShown(opportunity) {
        const now = moment();
        return !opportunity.interviews.some(interview => interview.status === 'CONFIRMED' && now.isAfter(interview.startAt));
      },
      isInterviewSchedulingDisabled(interviews) {
        const now = moment();
        return interviews.some(interview => now.isBefore(interview.startAt)
        && (interview.status === 'CONFIRMED'
        || (interview.status === 'TENTATIVE' && interview.talentResponseStatus === 'NEEDS_ACTION')));
      },
      getInterviewProcessStatusLabel(interviews) {
        const now = moment();
        if (!interviews.length) {
          return 'Continuez le processus de recrutement en programmant un entretien';
        }
        const pendingOrConfirmedInterview = interviews
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
    created() {
      this.prepareForApiConsumption(true);
      this
        .api(`/opportunities?projection=employer&forwarded=true&requirement.company=${this.user.company.id}&employerStatus=PENDING&employerStatus=ACCEPTED&requirement.status=OPEN&sort=employerStatus,desc&sort=forwardedAt,desc`)
        .then((response) => {
          // sort talents by requirements
          response.data._embedded.opportunities.forEach((opportunity) => {
            const foundRequirement = this.requirements
              .find(requirement => requirement.id === opportunity.requirement.id);
            if (foundRequirement) {
              foundRequirement.opportunities.push(opportunity);
            } else {
              const requirementToAdd = opportunity.requirement;
              requirementToAdd.opportunities = [];
              requirementToAdd.opportunities.push(opportunity);
              this.requirements.push(requirementToAdd);
            }
          });
          // display alert if no results
          if (!this.requirements.length) {
            this.setAlertComponent({
              type: 'info',
              message: 'Nous n\'avons pas encore de talents à vous présenter, vous recevrez un email lorsque vous aurez un nouveau talent',
            });
          }
          return Promise.all(this.requirements.map(requirement => this.api(`/opportunities/counts?requirementId=${requirement.id}`)));
        })
        .then((opportunitiesCountsResponses) => {
          opportunitiesCountsResponses.forEach((opportunitiesCountsResponse, index) => {
            this.requirements[index].opportunitiesCounts = opportunitiesCountsResponse.data;
          });
        })
        .finally(() => this.clearLoading(true));
    },
  };
</script>

<style scoped>

</style>
