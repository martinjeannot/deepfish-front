<template>
  <v-card>
    <h4 class="mb-4">{{ title }}</h4>
    <v-tooltip top v-for="domainObject in referenceDomainObjects" :key="domainObject.id" :disabled="!getTooltipFromL10nKey(domainObject.l10nKey)">
      <v-checkbox 
                  :value="domainObject.id"
                  :label="getLabelFromL10nKey(domainObject.l10nKey)"
                  v-model="domainObjectsModel"
                  :disabled="loading"
                  slot="activator"
      ></v-checkbox>
      <span>{{getTooltipFromL10nKey(domainObject.l10nKey)}}</span>
    </v-tooltip>
  </v-card>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'synchronized-checkbox-list',
    props: ['conditions', 'title', 'referenceDomainObjects', 'associationResourceName'],
    data: () => ({
      loading: false,
    }),
    computed: {
      ...mapGetters([
        'api',
      ]),
      domainObjectsModel: {
        get() {
          return this.conditions[this.associationResourceName].map(domainObject => domainObject.id);
        },
        set(domainObjectsModel) {
          let request = null;
          if (domainObjectsModel.length > this.conditions[this.associationResourceName].length) {
            // bind new association
            const addedId = domainObjectsModel
              .filter(id => !this.conditions[this.associationResourceName]
                .some(domainObject => domainObject.id === id))[0];
            const addedDomainObject = this.referenceDomainObjects
              .find(domainObject => domainObject.id === addedId);
            request = {
              method: 'post',
              url: this.conditions._links[this.associationResourceName].href,
              data: addedDomainObject._links.self.href,
            };
          } else {
            // unbind existing association
            const remainingDomainObjects = domainObjectsModel
              .map(id => this.referenceDomainObjects
                .find(domainObject => domainObject.id === id)._links.self.href);
            request = {
              method: 'put',
              url: this.conditions._links[this.associationResourceName].href,
              data: remainingDomainObjects.join('\n'),
            };
          }
          request.headers = { 'Content-Type': 'text/uri-list' };
          this.prepareForApiConsumption();
          this
            .api(request)
            .then(() => {
              // update model
              this.conditions[this.associationResourceName] = domainObjectsModel
                .map(id => this.referenceDomainObjects
                  .find(domainObject => domainObject.id === id));
            })
            .finally(() => this.clearLoading());
        },
      },
    },
    methods: {
      prepareForApiConsumption() {
        this.loading = true;
      },
      clearLoading() {
        this.loading = false;
      },
      getLabelFromL10nKey(l10nKey) {
        switch (l10nKey) {
          case 'Amorçage':
            return 'Amorcage : tu seras le 1er sales';
          case 'Early stage':
            return 'Early stage : équipe entre 1 et 5 sales';
          case 'Accélération':
            return 'Accélération : équipe entre 6 et 20 sales';
          case 'Maturité':
            return 'Maturité : équipe de 20+ sales';
          default:
            return l10nKey;
        }
      },
      getTooltipFromL10nKey(l10nKey) {
        switch (l10nKey) {
          case 'Pre-Sales':
            return 'Ingénieur avant-vente';
          case 'Sales':
            return 'BizDev, Commercial, Account Executive, Account Manager, Ingé d\'affaires, etc.';
          case 'Customer Success':
            return 'Après-vente ou suivi/relation client';
          case 'Cold calling':
            return 'Prospection ou appel à froid';
          case 'New business':
            return 'Développement de nouveaux clients/New logo ou nouvelles ventes au sein de client existants';
          case 'Account management':
            return 'Gestion de comptes existants';
          case 'Gestion d\'équipe':
            return 'Management d\'une équipe commerciale';
          default:
            return null;
        }
      },
    },
  };
</script>

<style scoped>

</style>
