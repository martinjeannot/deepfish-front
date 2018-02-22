<template>
  <v-layout v-if="loading">
    <v-flex xs12 class="text-xs-center">
      <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
    </v-flex>
  </v-layout>
  <v-layout row wrap v-else>
    <v-flex xs12>
      <h2>Mes opportunités en attente</h2>
    </v-flex>
    <v-flex xs12>
      <v-container fluid grid-list-md>
        <v-data-iterator content-tag="v-layout" row wrap :items="pendingOpportunities" :hide-actions="true">
          <v-flex slot="item" slot-scope="props" xs12>
            <v-card>
              <v-card-title>{{ props.item.companyName }} vous propose un job de {{ props.item.job.l10nKey }}
              </v-card-title>
              <v-card-actions>
                <v-btn flat color="primary" :to="{name: 'TalentOpportunity', params: {id: props.item.id}}">
                  Voir l'opportunité
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-data-iterator>
      </v-container>
    </v-flex>
    <v-flex xs12>
      <h2>Mes opportunités acceptées</h2>
    </v-flex>
    <v-flex xs12>
      <v-container fluid grid-list-md>
        <v-data-iterator content-tag="v-layout" row wrap :items="acceptedOpportunities">
          <v-flex slot="item" slot-scope="props" xs12>
            <v-card>
              <v-card-title>{{ props.item.companyName }} vous a proposé un job de {{ props.item.job.l10nKey }}
              </v-card-title>
              <v-card-actions>
                <v-btn flat color="primary" :to="{name: 'TalentOpportunity', params: {id: props.item.id}}">
                  Voir l'opportunité
                </v-btn>
              </v-card-actions>
            </v-card>
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
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
        'user',
      ]),
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
      ]),
    },
    created() {
      this.prepareForApiConsumption();
      this
        .api(`/opportunities?projection=partial&talent=${this.user.id}&status=PENDING&status=ACCEPTED`)
        .then((response) => {
          this.pendingOpportunities = response.data._embedded.opportunities.filter(opportunity => opportunity.status === 'PENDING');
          this.acceptedOpportunities = response.data._embedded.opportunities.filter(opportunity => opportunity.status === 'ACCEPTED');
        })
        .finally(() => this.clearLoading());
    },
  };
</script>

<style scoped>

</style>
