<template>
  <v-card class="elevation-0">
    <h4 class="mb-4">{{ title }}</h4>
    <div v-for="domainObject in referenceDomainObjects" :key="domainObject.id">
      <v-checkbox
        :value="domainObject.id"
        :label="domainObject.l10nKey"
        v-model="domainObjectsModel"
        :disabled="loading || isDisabled(domainObject)"
        v-show="domainObject.enabled"
        :hide-details="true"
        :class="[{'font-italic': ['c4da34ee-abe5-48f7-833b-3cb24f93dd7a'].includes(domainObject.id)}]"
      ></v-checkbox>
      <div v-if="getDescriptionFromL10nKey(domainObject.l10nKey)" class="pl-4 font-italic">
        {{ getDescriptionFromL10nKey(domainObject.l10nKey) }}
      </div>
    </div>
  </v-card>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'synchronized-checkbox-list',
    props: [
      'conditions',
      'title',
      'referenceDomainObjects',
      'associationResourceName',
    ],
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
      isDisabled(domainObject) {
        const clientIndustryTypesWithoutAnyPreference =
          this.associationResourceName === 'clientIndustryTypes'
          && domainObject.id !== 'c4da34ee-abe5-48f7-833b-3cb24f93dd7a'
          && this.conditions.clientIndustryTypes.find(clientIndustryType => clientIndustryType.id === 'c4da34ee-abe5-48f7-833b-3cb24f93dd7a');
        if (clientIndustryTypesWithoutAnyPreference) {
          return true;
        }
        return false;
      },
      getDescriptionFromL10nKey(l10nKey) {
        switch (l10nKey) {
          // Company maturity levels
          case 'Petite entreprise':
            return 'Moins de 50 consultants avec environ 5 profils business';
          case 'PME':
            return 'Entre 50 et 250 consultants avec entre 5 et 15 profils business';
          case 'ETI':
            return 'Entre 250 et 2000 consultants avec entre 15 et 100 profils business';
          case 'Grand groupe':
            return 'Plus de 2000 consultants avec plus de 100 profils business';
          default:
            return null;
        }
      },
    },
  };
</script>

<style scoped>

</style>
