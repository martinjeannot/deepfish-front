<template>
  <div>
    <v-layout row wrap v-if="loading">
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout wrap v-else>
      <v-flex xs12 class="mb-2">
        <span class="subheading" style="font-weight: bold">Quel salaire fixe annuel minimum (sans variable) acceptes-tu ?</span>
      </v-flex>
      <v-flex xs12>
        <v-form v-model="fixedSalaryValid" ref="fixedSalaryForm" @submit.prevent="submitConditions">
          <v-flex xs12 sm6 class="d-inline-flex">
            <v-text-field type="number" v-model="conditions.fixedSalary" label="Montant annuel hors primes" prefix="€"
                          :rules="[rules.required, rules.positive, rules.minValue]" required></v-text-field>
            <v-btn type="submit" small color="primary" :disabled="!fixedSalaryValid || subLoading"
                   :loading="subLoading">
              Valider
            </v-btn>
          </v-flex>
        </v-form>
      </v-flex>
      <v-flex xs12 class="mb-2">
        <span class="subheading" style="font-weight: bold">À quelle date peux-tu démarrer ?</span>
      </v-flex>
      <v-flex xs12 class="mb-2">
        <v-date-picker v-model="conditions.canStartOn" locale="fr-fr" :first-day-of-week="1"
                       @input="saveConditions" :readonly="subLoading"></v-date-picker>
      </v-flex>
      <v-flex xs12 class="mb-2">
        <span class="subheading" style="font-weight: bold">Où souhaites-tu travailler ?</span>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 sm3 md2 lg1 v-for="citiesByCountry in fixedLocationsByCountry" :key="citiesByCountry.country.id"
                v-show="citiesByCountry.country.enabled">
          <v-checkbox :value="citiesByCountry.country.id" :label="citiesByCountry.country.l10nKey"
                      v-model="selectedLocationIds" :disabled="subLoading" style="font-weight: bold"></v-checkbox>
          <v-checkbox v-for="cities in citiesByCountry.cities" :key="cities.id" :value="cities.id"
                      :label="cities.l10nKey" v-model="selectedLocationIds" :disabled="subLoading"
                      class="ml-3"></v-checkbox>
        </v-flex>
      </v-layout>
    </v-layout>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  const rules = {
    required: value => !!value || 'Ce champ est obligatoire',
    positive: value => value > 0 || 'La valeur doit être supérieure à 0',
    minValue: value => value > 10000 || 'Le montant est annuel (ex: 45 000€)',
  };

  export default {
    name: 'conditions-wishes',
    data: () => ({
      loading: false,
      subLoading: false,
      conditions: null,
      fixedSalaryValid: false,
      rules,
      fixedLocations: [],
      fixedLocationsByCountry: [],
    }),
    computed: {
      ...mapGetters([
        'api',
        'user',
      ]),
      selectedLocationIds: {
        get() {
          return this.conditions.fixedLocations.map(fixedLocation => fixedLocation.id);
        },
        set(selectedLocationIds) {
          if (selectedLocationIds.length > this.conditions.fixedLocations.length) {
            // bind new association
            const addedId = selectedLocationIds
              .filter(id => !this.conditions.fixedLocations
                .some(fixedLocation => fixedLocation.id === id))[0];
            const addedLocation = this.fixedLocations
              .find(fixedLocation => fixedLocation.id === addedId);
            if (addedLocation.parentLocation === null) {
              // location is country => add all cities
              const citiesForSelectedCountry = this.fixedLocationsByCountry
                .find(citiesByCountry => citiesByCountry.country.id === addedId).cities;
              // eslint-disable-next-line no-param-reassign
              selectedLocationIds = [...new Set([...selectedLocationIds,
                ...citiesForSelectedCountry.map(city => city.id)])];
            } else {
              // location is city => add related country if needed
              const citiesForRelatedCountry = this.fixedLocationsByCountry
                .find(citiesByCountry => citiesByCountry.country.id ===
                addedLocation.parentLocation.id).cities;
              const shouldCountryBeAdded = citiesForRelatedCountry
                .every(city => selectedLocationIds.includes(city.id));
              if (shouldCountryBeAdded) {
                selectedLocationIds.push(addedLocation.parentLocation.id);
              }
            }
          } else {
            // unbind existing association
            const removedLocation = this.conditions.fixedLocations
              .filter(fixedLocation => !selectedLocationIds.some(id => id === fixedLocation.id))[0];
            if (removedLocation.parentLocation === null) {
              // location is country => remove all cities
              const cityForSelectedCountryIds = this.fixedLocationsByCountry
                .find(citiesByCountry => citiesByCountry.country.id === removedLocation.id).cities
                .map(city => city.id);
              // eslint-disable-next-line no-param-reassign
              selectedLocationIds = selectedLocationIds
                .filter(id => !cityForSelectedCountryIds.includes(id));
            } else {
              // location is city => remove related country if selected
              // eslint-disable-next-line no-param-reassign
              selectedLocationIds = selectedLocationIds
                .filter(id => id !== removedLocation.parentLocation.id);
            }
          }
          const selectedLocations = selectedLocationIds
            .map(id => this.fixedLocations.find(fixedLocation => fixedLocation.id === id));
          this.prepareForApiConsumption();
          this
            .api({
              method: 'put',
              url: this.conditions._links.fixedLocations.href,
              data: selectedLocations.map(selectedLocation => selectedLocation._links.self.href).join('\n'),
              headers: { 'Content-Type': 'text/uri-list' },
            })
            .then(() => {
              // update model
              this.conditions.fixedLocations = selectedLocations;
            })
            .finally(() => this.clearLoading());
        },
      },
    },
    methods: {
      ...mapActions([
        'showSnackbar',
      ]),
      prepareForApiConsumption(onCreated = false) {
        this.loading = onCreated;
        this.subLoading = true;
      },
      clearLoading() {
        this.loading = false;
        this.subLoading = false;
      },
      submitConditions() {
        this
          .saveConditions()
          .then(() => this.showSnackbar('OK'));
      },
      saveConditions() {
        const conditions = Object.assign({}, this.conditions);
        Object.entries(this.conditions).forEach(([key, value]) => {
          if (value instanceof Array) {
            delete conditions[key];
          }
        });
        if (!this.conditions.fixedSalary) {
          delete conditions.fixedSalary;
        }
        this.prepareForApiConsumption();
        return this.api
          .patch(this.conditions._links.self.href, conditions)
          .finally(() => this.clearLoading());
      },
    },
    created() {
      this.prepareForApiConsumption(true);
      Promise
        .all([
          this.api(`${this.user._links.conditions.href}?projection=default`),
          this.api('/fixedLocations?projection=default&size=999'),
        ])
        .then(([
                 conditionsResponse,
                 fixedLocationResponse,
               ]) => {
          this.conditions = conditionsResponse.data;
          if (!this.conditions.fixedSalary) {
            this.conditions.fixedSalary = '';
          }
          this.fixedLocations = fixedLocationResponse.data._embedded.fixedLocations;
          this.fixedLocationsByCountry = this.fixedLocations
            .filter(fixedLocation => fixedLocation.parentLocation === null)
            .map(country => ({
              country,
              cities: this.fixedLocations
                .filter(fixedLocation => fixedLocation.parentLocation !== null &&
                fixedLocation.parentLocation.id === country.id),
            }));
          this.clearLoading();
        })
        .catch((/* error */) => {
          this.$store.dispatch('setErrorAfterApiConsumption');
        });
    },
  };
</script>

<style scoped>

</style>
