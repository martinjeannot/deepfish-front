<template>
  <v-layout v-if="initialLoading">
    <v-flex xs12 class="pt-5 text-xs-center">
      <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
    </v-flex>
  </v-layout>
  <v-layout v-else wrap>
    <v-flex xs8>
      <v-card>
        <v-card-text>
          <v-layout wrap>
            <v-flex
              xs12 sm5 md4 offset-md1 lg3 offset-lg2
            >
              <v-select
                v-model="requirement"
                label="Poste"
                item-text="name"
                :items="requirements"
                :return-object="true"
                @change="getTalents"
              ></v-select>
            </v-flex>
            <v-flex
              xs12 sm5 offset-sm2 md4 offset-md2 lg3 offset-lg2
            >
              <v-select
                v-model="status"
                label="Statut"
                :items="statuses"
                :return-object="true"
                @change="getTalents"
              ></v-select>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
      <v-data-iterator
        :items="opportunities"
        :hide-actions="true"
        content-tag="v-layout"
        row
        wrap
      >
        <template #item="{ item }">
          <v-flex xs12 class="pt-3">
            <talent
              :opportunity="item"
            ></talent>
          </v-flex>
        </template>
        <template #no-data>
          <v-alert :value="true" color="info" icon="info" class="mt-3">
            Aucun talent à afficher
          </v-alert>
        </template>
      </v-data-iterator>
    </v-flex>
    <v-flex
      xs4
      :class="['pt-5', 'pl-3', {'fixed': $vuetify.breakpoint.smAndUp}]"
    >
      <client-executive
        v-if="user.clientExecutive"
        :client-executive="user.clientExecutive"
      ></client-executive>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions, mapState } from 'vuex';
  import ClientExecutive from '@/components/Employer/ClientExecutive';
  import Talent from './Talent';

  export default {
    name: 'EmployerTalents',
    components: {
      Talent,
      ClientExecutive,
    },
    data: () => ({
      requirements: [],
      requirement: null,
      statuses: [
        {
          text: 'Tous les statuts',
          value: {
            talentStatus: null,
            employerStatus: null,
          },
        },
        {
          text: 'Contacté',
          value: {
            talentStatus: 'PENDING',
            employerStatus: null,
          },
        },
        {
          text: 'En attente',
          value: {
            talentStatus: 'ACCEPTED',
            employerStatus: 'PENDING',
          },
        },
        {
          text: 'En process',
          value: {
            talentStatus: 'ACCEPTED',
            employerStatus: 'ACCEPTED',
          },
        },
        {
          text: 'Offre refusée',
          value: {
            talentStatus: 'DECLINED',
            employerStatus: null,
          },
        },
      ],
      status: null,
      opportunities: [],
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
      getTalents() {
        this.prepareForApiConsumption();
        let request = `/opportunities?projection=employer&version=2&employer.company=${this.user.company.id}&requirement.status=OPEN`;
        if (this.requirement && this.requirement.id) {
          request += `&requirement=${this.requirement.id}`;
        }
        if (this.status && this.status.value.talentStatus) {
          request += `&talentStatus=${this.status.value.talentStatus}`;
        }
        if (this.status && this.status.value.employerStatus) {
          request += `&employerStatus=${this.status.value.employerStatus}`;
        }
        return this
          .api(request)
          .then((response) => {
            // we have to filter out declined talents client-side because we cannot retrieve
            // opportunities server-side with null employer status by query string
            this.opportunities = response.data._embedded.opportunities
              .filter(opportunity => opportunity.employerStatus !== 'DECLINED');
          })
          .catch(() => this.showSnackbar(['Erreur', 'error']))
          .finally(() => this.clearLoading());
      },
    },
    created() {
      this.prepareForApiConsumption(true);
      return this
        .api(`/requirements?version=2&company=${this.user.company.id}&status=OPEN&sort=createdAt,desc`)
        .then((response) => {
          this.requirements = response.data._embedded.requirements;
          this.requirements.unshift({ name: 'Tous les postes', id: null });
          return this.getTalents();
        })
        .catch(() => this.showSnackbar(['Erreur', 'error']))
        .finally(() => this.clearLoading(true));
    },
  };
</script>

<style scoped>
  .fixed {
    position: fixed;
    right: 12px;
  }
</style>
