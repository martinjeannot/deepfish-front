<template>
  <v-layout v-if="loading">
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
                <v-flex xs8 sm10 md11>
                  Deepfish te propose un job chez <span style="font-weight: bold">{{ props.item.company.name }}</span>
                </v-flex>
              </v-card-title>
              <v-card-actions>
                <v-flex xs12 class="text-xs-center">
                  <v-badge overlap color="red">
                    <v-btn flat color="primary" :to="{name: 'TalentOpportunity', params: {id: props.item.id}}">
                      Voir l'opportunité
                    </v-btn>
                    <v-icon slot="badge" color="white">priority_high</v-icon>
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
                  <v-btn flat color="primary" :to="{name: 'TalentOpportunity', params: {id: props.item.id}}">
                    Voir l'opportunité
                  </v-btn>
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
    <v-flex xs12 v-if="closedOpportunities.length">
      <h2>Mes opportunités archivées</h2>
      <v-container fluid grid-list-md>
        <v-data-iterator content-tag="v-layout" row wrap :items="closedOpportunities"
                         :hide-actions="true">
          <v-flex slot="item" slot-scope="props" xs12>
            <v-card color="brown lighten-4">
              <v-card-title>
                <v-flex xs4 sm2 md1>
                  <v-img
                    :src="props.item.company.logoURL ? props.item.company.logoURL : 'static/img/placeholder_150.jpg'"
                    alt="logo" max-width="100px"></v-img>
                </v-flex>
                <v-flex xs8 sm4 md7>
                  Deepfish t'as proposé un job chez
                  <span style="font-weight: bold">{{ props.item.company.name }}</span>
                </v-flex>
                <v-flex xs12 sm6 md4 class="text-xs-center" pt-3>
                  <v-chip color="grey lighten-2" v-html="'L\'offre n\'est plus d\'actualité'" class="pa-2"></v-chip>
                </v-flex>
              </v-card-title>
              <v-card-actions>
                <v-flex xs12 class="text-xs-center">
                  <v-tooltip top>
                    <v-btn slot="activator" flat color="primary"
                           :to="{name: 'TalentOpportunity', params: {id: props.item.id}}">
                      Voir l'opportunité
                    </v-btn>
                    <span>L'offre n'est plus d'actualité</span>
                  </v-tooltip>
                </v-flex>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-data-iterator>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters, mapState, mapActions } from 'vuex';

  export default {
    name: 'talent-opportunities',
    data: () => ({
      pendingOpportunities: [],
      acceptedOpportunities: [],
      declinedOpportunities: [],
      closedOpportunities: [],
      totalItems: 0,
    }),
    computed: {
      ...mapGetters(['api', 'loading', 'alertComponent', 'user', 'menuBadges']),
      ...mapState(['getOpportunityStatusColor', 'getLabelFromOpportunityStatus']),
    },
    methods: {
      ...mapActions(['prepareForApiConsumption', 'clearLoading', 'onAlertComponentDismissed']),
    },
    created() {
      this.prepareForApiConsumption();
      this.api(`/opportunities?projection=talent&talent=${this.user.id}&sort=createdAt,desc`)
        .then((response) => {
          this.totalItems = response.data.page.totalElements;
          this.pendingOpportunities = response.data._embedded.opportunities
            .filter(opportunity => opportunity.talentStatus === 'PENDING' && opportunity.requirement.status === 'OPEN');
          this.menuBadges.opportunities = this.pendingOpportunities.length;
          this.acceptedOpportunities = response.data._embedded.opportunities
            .filter(opportunity => opportunity.talentStatus === 'ACCEPTED' && opportunity.requirement.status === 'OPEN');
          this.declinedOpportunities = response.data._embedded.opportunities
            .filter(opportunity => opportunity.talentStatus === 'DECLINED' && opportunity.requirement.status === 'OPEN');
          this.closedOpportunities = response.data._embedded.opportunities
            .filter(opportunity => opportunity.requirement.status === 'CLOSED');
        })
        .finally(() => this.clearLoading());
    },
  };
</script>

<style scoped>
</style>
