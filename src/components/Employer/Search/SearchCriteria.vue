<template>
  <v-card>
    <v-tabs
      v-model="activeTab"
      :grow="true"
    >
      <v-tab
      >
        Commercial
      </v-tab>
      <v-tab
      >
        Chargé RH
      </v-tab>
    </v-tabs>
    <v-tabs-items
      v-model="activeTab"
    >
      <v-tab-item>
        <v-card-text>
          <v-flex xs12 class="text-xs-center">
            <div class="body-2">
              Expérience (entre {{ criteria.sales.experience[0] }}
              et {{ criteria.sales.experience[1] === 30 ? '30+' : criteria.sales.experience[1] }} ans)
            </div>
          </v-flex>
          <v-flex xs12 class="px-4">
            <v-range-slider
              v-model="criteria.sales.experience"
              :max="30"
            ></v-range-slider>
          </v-flex>
          <v-flex xs12 class="text-xs-center">
            <div class="body-2">
              Salaire fixe (entre {{ criteria.sales.baseSalary[0] }}
              et {{ criteria.sales.baseSalary[1] === 120 ? '120+' : criteria.sales.baseSalary[1] }} k€)
            </div>
          </v-flex>
          <v-flex xs12 class="px-4">
            <v-range-slider
              v-model="criteria.sales.baseSalary"
              :max="120"
              :step="2"
            ></v-range-slider>
          </v-flex>
          <v-flex xs12>
            <v-checkbox
              v-model="criteria.sales.internship"
              label="Stage/Alternance"
            ></v-checkbox>
          </v-flex>
          <v-flex xs12>
            <v-select
              v-model="criteria.sales.fixedLocations"
              item-text="l10nKey"
              item-value="id"
              :items="fixedLocations"
              label="Localisations"
              :multiple="true"
            ></v-select>
          </v-flex>
          <v-flex xs12 class="text-xs-center">
            <v-btn
              color="primary"
              :loading="loading"
              @click="launchSearch(criteria.sales)"
            >
              Rechercher
            </v-btn>
          </v-flex>
        </v-card-text>
      </v-tab-item>
      <v-tab-item>
        <v-card-text>
          <v-flex xs12 class="text-xs-center">
            <div class="body-2">
              Expérience (entre {{ criteria.hr.experience[0] }}
              et {{ criteria.hr.experience[1] === 30 ? '30+' : criteria.hr.experience[1] }} ans)
            </div>
          </v-flex>
          <v-flex xs12 class="px-4">
            <v-range-slider
              v-model="criteria.hr.experience"
              :max="30"
            ></v-range-slider>
          </v-flex>
          <v-flex xs12 class="text-xs-center">
            <div class="body-2">
              Salaire fixe (entre {{ criteria.hr.baseSalary[0] }}
              et {{ criteria.hr.baseSalary[1] === 120 ? '120+' : criteria.hr.baseSalary[1] }} k€)
            </div>
          </v-flex>
          <v-flex xs12 class="px-4">
            <v-range-slider
              v-model="criteria.hr.baseSalary"
              :max="120"
              :step="2"
            ></v-range-slider>
          </v-flex>
          <v-flex xs12>
            <v-checkbox
              v-model="criteria.hr.internship"
              label="Stage/Alternance"
            ></v-checkbox>
          </v-flex>
          <v-flex xs12>
            <v-select
              v-model="criteria.hr.fixedLocations"
              item-text="l10nKey"
              item-value="id"
              :items="fixedLocations"
              label="Localisations"
              :multiple="true"
            ></v-select>
          </v-flex>
          <v-flex xs12 class="text-xs-center">
            <v-btn
              color="primary"
              :loading="loading"
              @click="launchSearch(criteria.hr)"
            >
              Rechercher
            </v-btn>
          </v-flex>
        </v-card-text>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'EmployerSearchCriteria',
    data: () => ({
      activeTab: 0,
      fixedLocations: [],
      criteria: {
        sales: {
          jobFunction: 'SALES',
          experience: [0, 30],
          baseSalary: [0, 120],
          internship: false,
          fixedLocations: [],
        },
        hr: {
          jobFunction: 'HUMAN_RESOURCES',
          experience: [0, 30],
          baseSalary: [0, 120],
          internship: false,
          fixedLocations: [],
        },
      },
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
      ]),
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'showSnackbar',
      ]),
      launchSearch(criteria) {
        this.$emit('search', criteria);
      },
    },
    created() {
      this.prepareForApiConsumption(true);
      return Promise
        .all([
          this.api('/fixedLocations?enabled=true'),
        ])
        .then(([
                 fixedLocationsResponse,
               ]) => {
          this.fixedLocations = fixedLocationsResponse.data._embedded.fixedLocations;
        })
        .catch(() => this.showSnackbar(['Error', 'error']))
        .finally(() => this.clearLoading(true));
    },
  };
</script>

<style scoped>

</style>
