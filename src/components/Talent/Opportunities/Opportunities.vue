<template>
  <v-layout v-if="initialLoading">
    <v-flex xs12 class="text-xs-center">
      <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
    </v-flex>
  </v-layout>
  <talent-opportunities-welcome
    v-else-if="!totalItems"
  ></talent-opportunities-welcome>
  <v-layout v-else row wrap>
    <v-layout v-if="alertComponent">
      <v-flex xs12 sm6 offset-sm3>
        <base-alert :type="alertComponent.type" :message="alertComponent.message"
                    @dismissed="onAlertComponentDismissed"></base-alert>
      </v-flex>
    </v-layout>
    <v-flex xs12>
      <h2>Mes opportunités en attente</h2>
      <v-container fluid grid-list-md>
        <v-data-iterator content-tag="v-layout" row wrap :items="pendingOpportunities" :hide-actions="true">
          <v-flex xs12 slot="item" slot-scope="props">
            <v-card>
              <v-card-title>
                <v-flex xs4 sm2 md1>
                  <v-img
                    :src="props.item.company.logoURL ? props.item.company.logoURL : 'static/img/placeholder_150.jpg'"
                    alt="logo" max-width="100px"></v-img>
                </v-flex>
                <v-flex xs8 sm4 md7>
                  Deepfish te propose un job de
                  <span class="font-weight-bold">{{ props.item.requirement.name }}</span>
                  chez
                  <span class="font-weight-bold">{{ props.item.company.name }}</span>
                </v-flex>
                <v-flex xs12 sm6 md4 class="text-xs-center" pt-3>
                  <v-chip color="red" outline class="pa-3"
                          v-html="'En attente d\'une réponse de ta part'"
                  ></v-chip>
                </v-flex>
              </v-card-title>
              <v-card-actions>
                <v-flex xs12 class="text-xs-center">
                  <v-badge overlap color="red">
                    <v-icon slot="badge" color="white">priority_high</v-icon>
                    <v-btn flat color="primary" :to="{name: 'TalentOpportunity', params: {id: props.item.id}}">
                      Voir l'opportunité
                    </v-btn>
                  </v-badge>
                </v-flex>
              </v-card-actions>
            </v-card>
          </v-flex>
          <v-flex xs12 slot="no-data">
            <v-alert v-if="totalItems" type="success" :value="true">
              Tout est OK, aucune opportunité en attente
            </v-alert>
            <v-alert v-else type="info" :value="true">
              Tu n'as pas encore reçu d'opportunité
            </v-alert>
          </v-flex>
        </v-data-iterator>
      </v-container>
    </v-flex>
    <v-flex xs12>
      <h2>Mes opportunités acceptées</h2>
      <v-container fluid grid-list-md>
        <v-data-iterator content-tag="v-layout" row wrap :items="acceptedOpportunities"
                         :hide-actions="true">
          <v-flex slot="item" slot-scope="props" xs12>
            <v-card>
              <v-card-title>
                <v-flex xs4 sm2 md1>
                  <v-img
                    :src="props.item.company.logoURL ? props.item.company.logoURL : 'static/img/placeholder_150.jpg'"
                    alt="logo" max-width="100px"></v-img>
                </v-flex>
                <v-flex xs8 sm4 md7>
                  Deepfish t'as proposé un job chez <span style="font-weight: bold">{{ props.item.company.name }}</span>
                </v-flex>
                <v-flex xs12 sm6 md4 class="text-xs-center" pt-3>
                  <v-chip :color="getOpportunityStatusColor(props.item.employerStatus)"
                          v-html="getLabelFromOpportunityStatus(props.item.employerStatus)" class="pa-2">
                  </v-chip>
                </v-flex>
              </v-card-title>
              <v-card-actions>
                <v-flex xs12 class="text-xs-center">
                  <v-badge overlap color="red">
                    <v-icon v-if="props.item.badged" slot="badge" color="white">priority_high</v-icon>
                    <v-btn flat color="primary" :to="{name: 'TalentOpportunity', params: {id: props.item.id}}">
                      Voir l'opportunité
                    </v-btn>
                  </v-badge>
                </v-flex>
              </v-card-actions>
            </v-card>
          </v-flex>
          <v-flex xs12 slot="no-data">
            <v-alert type="info" :value="true">
              Tu n'as pas encore accepté d'opportunité
            </v-alert>
          </v-flex>
        </v-data-iterator>
      </v-container>
    </v-flex>
    <v-flex xs12>
      <h2>Mes opportunités refusées</h2>
      <v-container fluid grid-list-md>
        <v-data-iterator content-tag="v-layout" row wrap :items="declinedOpportunities"
                         :hide-actions="true">
          <v-flex slot="item" slot-scope="props" xs12>
            <v-card>
              <v-card-title>
                <v-flex xs4 sm2 md1>
                  <v-img
                    :src="props.item.company.logoURL ? props.item.company.logoURL : 'static/img/placeholder_150.jpg'"
                    alt="logo" max-width="100px"></v-img>
                </v-flex>
                <v-flex xs8 sm10 md11>
                  Deepfish t'as proposé un job chez <span style="font-weight: bold">{{ props.item.company.name }}</span>
                </v-flex>
              </v-card-title>
              <v-card-actions>
                <v-flex xs12 class="text-xs-center">
                  <v-btn flat color="primary" :to="{name: 'TalentOpportunity', params: {id: props.item.id}}">
                    Voir l'opportunité
                  </v-btn>
                </v-flex>
              </v-card-actions>
            </v-card>
          </v-flex>
          <v-flex xs12 slot="no-data">
            <v-alert type="info" :value="true">
              Tu n'as pas encore refusé d'opportunité
            </v-alert>
          </v-flex>
        </v-data-iterator>
      </v-container>
    </v-flex>
    <v-flex xs12 v-if="voidOpportunities.length">
      <h2>Mes opportunités archivées</h2>
      <v-container fluid grid-list-md>
        <v-data-iterator content-tag="v-layout" row wrap :items="voidOpportunities"
                         :hide-actions="true">
          <v-flex slot="item" slot-scope="props" xs12>
            <v-card color="brown lighten-4">
              <v-card-title>
                <v-flex xs4 sm2 md1>
                  <v-img
                    :src="props.item.company.logoURL ? props.item.company.logoURL : 'static/img/placeholder_150.jpg'"
                    :class="{ 'blurred-image': props.item.talentStatus === 'EXPIRED' }"
                    alt="logo" max-width="100px"></v-img>
                </v-flex>
                <v-flex xs8 sm4 md7>
                  Deepfish t'as proposé un job chez
                  <span :class="{ 'blurred-text': props.item.talentStatus === 'EXPIRED' }" style="font-weight: bold">
                    {{ props.item.talentStatus === 'EXPIRED'
                    ? $options.filters.hideText(props.item.company.name)
                    : props.item.company.name }}
                  </span>
                </v-flex>
                <v-flex xs12 sm6 md4 class="text-xs-center" pt-3>
                  <v-chip v-if="closedOpportunities.includes(props.item)"
                          v-html="'L\'offre n\'est plus d\'actualité'"
                          color="grey lighten-2" class="pa-2"></v-chip>
                  <v-chip v-else-if="expiredOpportunities.includes(props.item)"
                          v-html="'Trop tard, l\'opportunité a expiré'"
                          color="grey lighten-2" class="pa-2"></v-chip>
                </v-flex>
              </v-card-title>
              <v-card-actions>
                <v-flex xs12 class="text-xs-center">
                  <v-btn
                    flat color="primary"
                    :to="{name: 'TalentOpportunity', params: {id: props.item.id}}"
                    :disabled="props.item.talentStatus === 'EXPIRED'"
                  >
                    Voir l'opportunité
                  </v-btn>
                </v-flex>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-data-iterator>
      </v-container>
    </v-flex>
    <v-dialog v-model="qualificationDialog" persistent max-width="650px">
      <v-container style="background-color: white">
        <v-layout row wrap>
          <v-flex xs12 class="text-xs-center">
            <h3>
              Félicitations, tu viens d'accepter ta première opportunité !
              <v-icon color="success">thumb_up</v-icon>
            </h3>
          </v-flex>
          <v-flex xs12 class="mt-3">
            Mais avant de permettre au recruteur de découvrir ton profil complet (non anonymisé), nous aimerions échanger avec toi par téléphone :
          </v-flex>
          <v-flex xs12 class="text-xs-center mt-3">
            <v-btn :href="calendlyUrl" target="_blank" flat color="info"
                   @click.native="qualificationDialog = false">
              Choisir un créneau
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-dialog>
  </v-layout>
</template>

<script>
  import moment from 'moment';
  import { mapGetters, mapState, mapActions } from 'vuex';
  import TalentOpportunitiesWelcome from './Welcome';

  export default {
    name: 'TalentOpportunities',
    components: { TalentOpportunitiesWelcome },
    data: () => ({
      pendingOpportunities: [],
      acceptedOpportunities: [],
      declinedOpportunities: [],
      expiredOpportunities: [],
      closedOpportunities: [],
      totalItems: 0,
      qualificationDialog: false,
    }),
    computed: {
      ...mapGetters([
        'api',
        'initialLoading',
        'alertComponent',
        'user',
        'menuBadges',
      ]),
      ...mapState([
        'getOpportunityStatusColor',
        'getLabelFromOpportunityStatus',
      ]),
      calendlyUrl() {
        return `${process.env.TALENT_CALENDLY_URL}?name=${this.user.firstName}%20${this.user.lastName}&email=${this.user.email}&a1=${this.user.phoneNumber}`;
      },
      voidOpportunities() {
        return this.expiredOpportunities.concat(this.closedOpportunities);
      },
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'setAlertComponent',
        'onAlertComponentDismissed',
      ]),
    },
    filters: {
      hideText(value) {
        if (!value) return '';
        return value.replace(/./gi, '?');
      },
    },
    created() {
      this.prepareForApiConsumption(true);
      this.api(`/opportunities?projection=talent-interviews&talent=${this.user.id}&sort=createdAt,desc`)
        .then((response) => {
          this.totalItems = response.data.page.totalElements;
          this.pendingOpportunities = response.data._embedded.opportunities
            .filter(opportunity => opportunity.talentStatus === 'PENDING' && opportunity.requirement.status === 'OPEN');
          this.menuBadges.opportunities = this.pendingOpportunities.length;
          // FIXME opportunities are considered accepted only if the associated requirement is OPEN
          // This implies that talent accepting an opport after another one which requirement has
          // been closed will be asked for qualification again !
          this.acceptedOpportunities = response.data._embedded.opportunities
            .filter(opportunity => opportunity.talentStatus === 'ACCEPTED' && opportunity.requirement.status === 'OPEN')
            .sort((opport1, opport2) => {
              if (opport1.employerStatus === opport2.employerStatus) {
                return 0;
              } else if (opport1.employerStatus === 'DECLINED') {
                return 1;
              } else if (opport1.employerStatus === null && ['PENDING', 'ACCEPTED'].includes(opport2.employerStatus)) {
                return 1;
              } else if (opport1.employerStatus === 'PENDING' && opport2.employerStatus === 'ACCEPTED') {
                return 1;
              }
              return -1;
            });
          this.acceptedOpportunities.forEach((opportunity) => {
            if (opportunity.interviews.some(
                interview => moment().utcOffset(interview.startTimeZone).isBefore(interview.startAt)
                && interview.talentResponseStatus === 'NEEDS_ACTION')) {
              opportunity.badged = true;
              this.menuBadges.opportunities += 1;
            }
          });
          this.declinedOpportunities = response.data._embedded.opportunities
            .filter(opportunity => opportunity.talentStatus === 'DECLINED' && opportunity.requirement.status === 'OPEN');
          this.expiredOpportunities = response.data._embedded.opportunities
            .filter(opportunity => opportunity.talentStatus === 'EXPIRED' && opportunity.requirement.status === 'OPEN');
          this.closedOpportunities = response.data._embedded.opportunities
            .filter(opportunity => opportunity.requirement.status === 'CLOSED');
          // opportunity accepted
          if (Object.prototype.hasOwnProperty.call(this.$route.query, 'opportunity-accepted')) {
            if (this.acceptedOpportunities.length === 1) {
              this.qualificationDialog = true;
            } else {
              this.setAlertComponent({
                type: 'success',
                message: 'Le recruteur va bientôt découvrir ton profil complet (non anonymisé) et revenir vers toi si son intérêt est confirmé',
              });
            }
          }
        })
        .finally(() => this.clearLoading(true));
    },
  };
</script>

<style scoped>
  .blurred-image {
    -webkit-filter: blur(18px);
    filter: blur(18px);
  }

  .blurred-text {
    -webkit-filter: blur(4px);
    filter: blur(4px);
  }
</style>
