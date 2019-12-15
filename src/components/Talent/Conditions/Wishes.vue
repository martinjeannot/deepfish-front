<template>
  <div>
    <v-layout row wrap v-if="loading">
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-else>
      <v-flex xs12 class="subheading font-weight-bold mb-2">
        Quel salaire fixe annuel minimum (sans variable) acceptes-tu ?
      </v-flex>
      <v-flex xs12 sm5 md3 lg2 xl2 class="mb-2">
        <v-text-field
          type="number"
          v-model="fixedSalary"
          ref="fixedSalaryInput"
          label="Montant annuel hors primes"
          prefix="€"
          :disabled="conditions.internship"
          :rules="conditions.internship ? [] : [rules.required, rules.positive, rules.minValue]"
          @input="$emit('update:fixedSalaryValid', $refs.fixedSalaryInput.valid)"
          @change="onFixedSalaryChange"
        ></v-text-field>
      </v-flex>
      <v-flex xs12>
        Es-tu en recherche de stage ou d'alternance ?
      </v-flex>
      <v-flex xs12>
        <v-checkbox
          v-model="conditions.internship"
          label="Stage / Alternance"
          @change="onInternshipChange"
        ></v-checkbox>
      </v-flex>
      <v-flex xs12 class="mb-2">
        <span
          class="subheading"
          style="font-weight: bold"
        >
          Quand souhaites-tu commencer un nouveau job ?
        </span>
      </v-flex>
      <v-flex xs12 class="mb-2">
        <v-date-picker
          v-model="conditions.availableFrom"
          locale="fr-fr"
          :min="minDate.format(datePickerDateFormat)"
          :readonly="subLoading"
          type="month"
          @input="saveConditions"
        ></v-date-picker>
      </v-flex>
      <v-flex xs12 class="mb-2">
        <span class="subheading" style="font-weight: bold">Où souhaites-tu travailler ?</span>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 v-for="citiesByCountry in fixedLocationsByCountry" :key="citiesByCountry.country.id"
                v-show="citiesByCountry.country.enabled">
          <v-checkbox :value="citiesByCountry.country.id" :label="citiesByCountry.country.l10nKey"
                      v-model="selectedLocationIds" :disabled="subLoading" style="font-weight: bold"></v-checkbox>
          <v-layout row wrap>
            <v-flex xs12 sm4 md3 lg2 v-for="cities in citiesByCountry.cities" :key="cities.id">
              <v-checkbox :value="cities.id" :label="cities.l10nKey" v-model="selectedLocationIds"
                          :disabled="subLoading" class="ml-3"></v-checkbox>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-layout>
  </div>
</template>

<script>
  import moment from 'moment';
  import { mapGetters, mapActions } from 'vuex';

  const rules = {
    required: value => !!value || 'Ce champ est obligatoire',
    positive: value => value > 0 || 'La valeur doit être supérieure à 0',
    minValue: value => value > 10000 || 'Le montant est annuel (ex: 45000€)',
  };

  export default {
    name: 'ConditionsWishes',
    data: () => ({
      loading: false,
      subLoading: false,
      conditions: null,
      rules,
      fixedLocations: [],
      fixedLocationsByCountry: [],
      datePickerDateFormat: 'YYYY-MM-DD',
    }),
    computed: {
      ...mapGetters([
        'api',
        'user',
      ]),
      fixedSalary: {
        get() {
          return this.conditions.fixedSalary ? this.conditions.fixedSalary : '';
        },
        set(value) {
          if (this.$refs.fixedSalaryInput.validate()) {
            this.conditions.fixedSalary = value;
          }
        },
      },
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
      minDate() {
        const canStartOn = moment(this.conditions.canStartOn);
        const now = moment();
        return canStartOn.isBefore(now) ? canStartOn : now;
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
      onFixedSalaryChange() {
        if (this.$refs.fixedSalaryInput.valid) {
          this.saveConditions();
        }
      },
      onInternshipChange() {
        // manual fixed salary input validation
        // we can't use vuetify validation because rules props has not yet been updated
        if (!this.conditions.internship
          && this.$refs.fixedSalaryInput.lazyValue < 10000
        ) {
          this.$emit('update:fixedSalaryValid', false);
        } else {
          this.$emit('update:fixedSalaryValid', true);
        }
        return this.saveConditions();
      },
      saveConditions() {
        const conditions = Object.assign({}, this.conditions);
        Object.entries(this.conditions).forEach(([key, value]) => {
          if (value instanceof Array) {
            delete conditions[key];
          }
        });
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
          if (!this.conditions.fixedSalary && !this.conditions.internship) {
            this.$emit('update:fixedSalaryValid', false);
          } else {
            this.$emit('update:fixedSalaryValid', true);
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
