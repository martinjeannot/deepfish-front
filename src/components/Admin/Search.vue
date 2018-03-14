<template>
  <v-layout row wrap v-if="initialLoading">
    <v-flex xs12 class="text-xs-center">
      <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
    </v-flex>
  </v-layout>
  <v-layout row wrap v-else>
    <v-flex xs2>
      <v-flex xs12 class="text-xs-center">
        <v-btn block color="primary" @click="search" :disabled="loading" :loading="loading">
          <v-icon>search</v-icon>
        </v-btn>
      </v-flex>
      <v-expansion-panel>
        <v-expansion-panel-content>
          <div slot="header">Company maturity level</div>
          <v-card>
            <v-card-text>
              <ternary-checkbox v-for="companyMaturityLevel in companyMaturityLevels"
                                :key="companyMaturityLevel.id"
                                :value="companyMaturityLevel.id"
                                :label="companyMaturityLevel.l10nKey"
                                :checked-state-model.sync="criteria.companyMaturityLevelsIn"
                                :indeterminate-state-model.sync="criteria.companyMaturityLevelsNotIn"
              ></ternary-checkbox>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
          <div slot="header">Jobs</div>
          <v-card>
            <v-card-text>
              <v-checkbox v-for="job in jobs"
                          :key="job.id"
                          :value="job.id"
                          :label="job.l10nKey"
                          v-model="criteria.jobs"
              ></v-checkbox>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
          <div slot="header">Commodity types</div>
          <v-card>
            <v-card-text>
              <v-checkbox v-for="commodityType in commodityTypes"
                          :key="commodityType.id"
                          :value="commodityType.id"
                          :label="commodityType.l10nKey"
                          v-model="criteria.commodityTypes"
              ></v-checkbox>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
          <div slot="header">Task types</div>
          <v-card>
            <v-card-text>
              <v-checkbox v-for="taskType in taskTypes"
                          :key="taskType.id"
                          :value="taskType.id"
                          :label="taskType.l10nKey"
                          v-model="criteria.taskTypes"
              ></v-checkbox>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
          <div slot="header">Locations</div>
          <v-card>
            <v-card-text>
              <v-checkbox v-for="fixedLocation in fixedLocations"
                          :key="fixedLocation.id"
                          :value="fixedLocation.id"
                          :label="fixedLocation.l10nKey"
                          v-model="criteria.fixedLocations"
              ></v-checkbox>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
          <div slot="header">Fixed salary</div>
          <v-card>
            <v-card-text>
              <v-text-field type="number" label="Minimum" suffix="K€" v-model="criteria.minFixedSalary"></v-text-field>
              <v-text-field type="number" label="Maximum" suffix="K€" v-model="criteria.maxFixedSalary"></v-text-field>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
          <div slot="header">Talent maturity level</div>
          <v-card>
            <v-card-text>
              <v-checkbox v-for="talentMaturityLevel in talentMaturityLevels"
                          :key="talentMaturityLevel.key"
                          :value="talentMaturityLevel.key"
                          :label="talentMaturityLevel.label"
                          v-model="criteria.talentMaturityLevels"
              ></v-checkbox>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-flex xs12 class="text-xs-center">
        <v-btn block color="primary" @click="search" :disabled="loading" :loading="loading">
          <v-icon>search</v-icon>
        </v-btn>
      </v-flex>
    </v-flex>
    <v-flex xs10>
      <v-container fluid grid-list-md>
        <v-data-iterator content-tag="v-layout" row wrap :items="talents" :rows-per-page-items="rowsPerPageItems"
                         :pagination.sync="pagination">
          <v-flex slot="item" slot-scope="props" xs12 sm6 md4 lg3>
            <v-card>
              <v-card-title>
                <v-layout>
                  <v-flex xs2>
                    <v-avatar size="50">
                      <img :src="props.item.profile.pictureUrl" alt="picture"/>
                    </v-avatar>
                  </v-flex>
                  <v-flex xs8 style="margin: auto">
                    <h4>{{ props.item.lastName.toUpperCase() }} {{ props.item.firstName }}</h4>
                  </v-flex>
                  <v-flex xs2 class="text-xs-right">
                    <v-btn fab small color="primary"
                           @click.native.stop="selectedTalent = props.item; opportunityDialog = true">
                      <v-icon>send</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card-title>
              <v-divider></v-divider>
              <v-list dense>
                <v-list-tile>
                  <v-list-tile-content>Lorem:</v-list-tile-content>
                  <v-list-tile-content class="align-end">4/5</v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Ipsum:</v-list-tile-content>
                  <v-list-tile-content class="align-end">3/5</v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Dolor:</v-list-tile-content>
                  <v-list-tile-content class="align-end">4/5</v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-flex>
        </v-data-iterator>
      </v-container>
    </v-flex>
    <v-dialog v-model="opportunityDialog" v-if="selectedTalent" max-width="40%">
      <v-container style="background-color: white">
        <v-form v-model="opportunityValid" @submit.prevent="sendOpportunity">
          <v-layout>
            <v-flex xs12>
              <v-layout>
                <v-flex xs10 style="margin: auto">
                  <h2>Send an opportunity to {{ selectedTalent.firstName }}</h2>
                </v-flex>
                <v-flex xs2 class="text-xs-right">
                  <v-btn type="submit" fab small color="success" :disabled="!opportunityValid">
                    <v-icon>send</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-select label="Requirement" :items="requirements" v-model="selectedRequirement" item-text="company.name"
                        :rules="[rules.required]">
                <template slot="item" slot-scope="data">
                  <v-list-tile>
                    <v-list-tile-content>
                      <v-list-tile-title><span style="font-weight: bold">{{ data.item.company.name }}</span>
                        : {{ data.item.name }}
                      </v-list-tile-title>
                      <v-list-tile-sub-title>{{ data.item.job.l10nKey }} {{ data.item.seniority.l10nKey
                        }} {{ data.item.fixedSalary / 1000 }}K€ {{ data.item.location }}
                      </v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </template>
              </v-select>
              <v-text-field label="Opportunity pitch" v-model="opportunityPitch" multi-line rows="7"
                            :rules="[rules.required]"></v-text-field>
            </v-flex>
          </v-layout>
        </v-form>
      </v-container>
    </v-dialog>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  const rules = {
    required: value => !!value || 'This field is required',
  };

  const talentMaturityLevels = [
    { key: 'CLEAR_WATER', label: 'Clear water' },
    { key: 'OPEN_WATER', label: 'Open water' },
    { key: 'DEEP_WATER', label: 'Deep water' },
  ];

  export default {
    name: 'admin-search',
    data: () => ({
      rules,
      talents: [],
      selectedTalent: null,
      requirements: [],
      selectedRequirement: null,
      opportunityDialog: false,
      opportunityPitch: '',
      opportunityValid: false,
      // REFERENCE DATA
      companyMaturityLevels: [],
      jobs: [],
      commodityTypes: [],
      taskTypes: [],
      fixedLocations: [],
      talentMaturityLevels,
      // CRITERIA
      criteria: {
        companyMaturityLevelsIn: [],
        companyMaturityLevelsNotIn: [],
        jobs: [],
        commodityTypes: [],
        taskTypes: [],
        fixedLocations: [],
        minFixedSalary: null,
        maxFixedSalary: null,
        talentMaturityLevels: [],
      },
      rowsPerPageItems: [4, 8, 12],
      pagination: {
        rowsPerPage: 4,
      },
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
        'initialLoading',
        'user',
      ]),
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'showSnackbar',
      ]),
      search() {
        this.prepareForApiConsumption();
        let talentQueryString = '';
        // Company maturity levels criterion
        if (this.criteria.companyMaturityLevelsIn.length) {
          talentQueryString += talentQueryString ? '&' : '';
          talentQueryString += 'companyMaturityLevelsIn=';
          this.criteria.companyMaturityLevelsIn.forEach((companyMaturityLevel, index) => {
            talentQueryString += index ? ',' : '';
            talentQueryString += `${companyMaturityLevel}`;
          });
        }
        if (this.criteria.companyMaturityLevelsNotIn.length) {
          talentQueryString += talentQueryString ? '&' : '';
          talentQueryString += 'companyMaturityLevelsNotIn=';
          this.criteria.companyMaturityLevelsNotIn.forEach((companyMaturityLevel, index) => {
            talentQueryString += index ? ',' : '';
            talentQueryString += `${companyMaturityLevel}`;
          });
        }
        // Fixed salary criterion
        if (this.criteria.minFixedSalary) {
          talentQueryString += talentQueryString ? '&' : '';
          talentQueryString += `minFixedSalary=${this.criteria.minFixedSalary * 1000}`;
        }
        if (this.criteria.maxFixedSalary) {
          talentQueryString += talentQueryString ? '&' : '';
          talentQueryString += `maxFixedSalary=${this.criteria.maxFixedSalary * 1000}`;
        }
        // Talent maturity levels criterion
        if (this.criteria.talentMaturityLevels.length) {
          talentQueryString += talentQueryString ? '&' : '';
          this.criteria.talentMaturityLevels.forEach((talentMaturityLevel, index) => {
            talentQueryString += index ? '&' : '';
            talentQueryString += `maturityLevel=${talentMaturityLevel}`;
          });
        }
        // API consumption
        this
          .api(`/queryableTalents?${talentQueryString}`)
          .then((response) => {
            this.talents = response.data._embedded.queryableTalents;
          })
          .finally(() => this.clearLoading());
      },
      newOpportunity() {
        return {
          creator: this.user._links.self.href,
          talent: this.selectedTalent._links.self.href,
          requirement: this.selectedRequirement._links.self.href,
          pitch: this.opportunityPitch,
        };
      },
      sendOpportunity() {
        this.prepareForApiConsumption();
        this.api
          .post('/opportunities', this.newOpportunity())
          .then((/* response */) => {
            this.opportunityDialog = false;
            this.showSnackbar('Opportunity sent');
          })
          .finally(() => this.clearLoading());
      },
    },
    created() {
      this.prepareForApiConsumption(true);
      Promise.all([
        this.api('/requirements?projection=default'),
        this.api('/companyMaturityLevels'),
        this.api('/jobs'),
        this.api('/commodityTypes'),
        this.api('/taskTypes'),
        this.api('/fixedLocations'),
      ])
        .then(([
                 requirementsResponse,
                 companyMaturityLevelsResponse,
                 jobsResponse,
                 commodityTypesResponse,
                 taskTypesResponse,
                 fixedLocationsResponse,
               ]) => {
          this.requirements = requirementsResponse.data._embedded.requirements;
          // reference data
          this.companyMaturityLevels =
            companyMaturityLevelsResponse.data._embedded.companyMaturityLevels;
          this.jobs = jobsResponse.data._embedded.jobs;
          this.commodityTypes = commodityTypesResponse.data._embedded.commodityTypes;
          this.taskTypes = taskTypesResponse.data._embedded.taskTypes;
          this.fixedLocations = fixedLocationsResponse.data._embedded.fixedLocations;
        })
        .finally(() => this.clearLoading(true));
    },
  };
</script>

<style scoped>

</style>
