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
    </v-flex>
    <v-flex xs12>
      <v-container fluid grid-list-md>
        <v-data-iterator content-tag="v-layout" row wrap :items="pendingOpportunities" :hide-actions="true">
          <v-flex xs12 slot="item" slot-scope="props">
            <v-card>
              <v-card-title>
                <span style="font-weight: bold">
                  {{ props.item.company.name}}
                </span>&nbsp;te propose un job de {{ props.item.jobType.l10nKey }}
              </v-card-title>
              <v-card-actions>
                <v-btn flat color="primary" :to="{name: 'TalentOpportunity', params: {id: props.item.id}}">
                  Voir l'opportunité
                </v-btn>
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
    </v-flex>
    <v-flex xs12>
      <v-container fluid grid-list-md>
        <v-data-iterator content-tag="v-layout" row wrap :items="acceptedOpportunities" :hide-actions="true">
          <v-flex slot="item" slot-scope="props" xs12>
            <v-card>
              <v-card-title>{{ props.item.company.name }} t'as proposé un job de {{ props.item.jobType.l10nKey }}
              </v-card-title>
              <v-card-actions>
                <v-btn flat color="primary" :to="{name: 'TalentOpportunity', params: {id: props.item.id}}">
                  Voir l'opportunité
                </v-btn>
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
    </v-flex>
    <v-flex xs12>
      <v-container fluid grid-list-md>
        <v-data-iterator content-tag="v-layout" row wrap :items="declinedOpportunities" :hide-actions="true">
          <v-flex slot="item" slot-scope="props" xs12>
            <v-card>
              <v-card-title>{{ props.item.company.name }} t'as proposé un job de {{ props.item.jobType.l10nKey }}
              </v-card-title>
              <v-card-actions>
                <v-btn flat color="primary" :to="{name: 'TalentOpportunity', params: {id: props.item.id}}">
                  Voir l'opportunité
                </v-btn>
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
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'talent-opportunities',
    data: () => ({
      pendingOpportunities: [],
      acceptedOpportunities: [],
      declinedOpportunities: [],
      totalItems: 0,
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
        'alertComponent',
        'user',
        'menuBadges',
      ]),
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'onAlertComponentDismissed',
      ]),
    },
    created() {
      this.prepareForApiConsumption();
      this
        .api(`/opportunities?projection=talent&talent=${this.user.id}`)
        .then((response) => {
          this.totalItems = response.data.page.totalElements;
          this.pendingOpportunities = response.data._embedded.opportunities.filter(opportunity => opportunity.talentStatus === 'PENDING');
          this.menuBadges.opportunities = this.pendingOpportunities.length;
          this.acceptedOpportunities = response.data._embedded.opportunities.filter(opportunity => opportunity.talentStatus === 'ACCEPTED');
          this.declinedOpportunities = response.data._embedded.opportunities.filter(opportunity => opportunity.talentStatus === 'DECLINED');
        })
        .finally(() => this.clearLoading());
    },
  };
</script>

<style scoped>

</style>
