<template>
  <v-layout row wrap v-if="initialLoading">
    <v-flex xs12 class="text-xs-center">
      <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
    </v-flex>
  </v-layout>
  <v-layout row wrap v-else>
    <admin-opportunity-sending-dialog :value.sync="opportunityDialog"
                                      :talent="selectedTalent"></admin-opportunity-sending-dialog>
    <v-flex xs2>
      <v-flex xs12 class="text-xs-center">
        <v-btn block color="primary" @click="search(true)" :disabled="loading" :loading="loading">
          <v-icon>search</v-icon>
        </v-btn>
      </v-flex>
      <v-card>
        <v-card-title>
          <v-flex xs12 class="white">
            <v-text-field v-model="criteria.searchQuery" label="Search" clearable hide-details
                          @keyup.native.enter="search" v-focus></v-text-field>
          </v-flex>
        </v-card-title>
      </v-card>
      <v-card>
        <v-card-title>
          <requirement-select
            v-model="criteria.requirementNotIn"
          ></requirement-select>
        </v-card-title>
      </v-card>
      <v-expansion-panel>
        <v-expansion-panel-content>
          <div slot="header">Company maturity level</div>
          <v-card>
            <v-card-text>
              <ternary-checkbox v-for="companyMaturityLevel in companyMaturityLevels"
                                :key="companyMaturityLevel.id"
                                :value="companyMaturityLevel.id"
                                :label="getLabelFromCompanyMaturityLevelL10nKey(companyMaturityLevel.l10nKey)"
                                :checked-state-model.sync="criteria.companyMaturityLevels"
                                :indeterminate-state-model.sync="criteria.companyMaturityLevelsNotIn"
              ></ternary-checkbox>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
          <div slot="header">Job type</div>
          <v-card>
            <v-card-text>
              <v-checkbox v-for="jobType in jobTypes"
                          :key="jobType.id"
                          :value="jobType.id"
                          :label="jobType.l10nKey"
                          v-model="criteria.jobTypes"
              ></v-checkbox>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
          <div slot="header">Commodity type</div>
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
          <div slot="header">Task type</div>
          <v-card>
            <v-card-text>
              <ternary-checkbox v-for="taskType in taskTypes"
                                :key="taskType.id"
                                :value="taskType.id"
                                :label="taskType.l10nKey"
                                :checked-state-model.sync="criteria.taskTypes"
                                :indeterminate-state-model.sync="criteria.taskTypesNotIn"
              ></ternary-checkbox>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
          <div slot="header">Industry type</div>
          <v-card>
            <v-card-text>
              <v-checkbox v-for="industryType in industryTypes"
                          :key="industryType.id"
                          :value="industryType.id"
                          :label="industryType.l10nKey"
                          v-model="criteria.industryTypes"
              ></v-checkbox>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
          <div slot="header">Client industry type</div>
          <v-card>
            <v-card-text>
              <v-checkbox v-for="clientIndustryType in clientIndustryTypes"
                          :key="clientIndustryType.id"
                          :value="clientIndustryType.id"
                          :label="clientIndustryType.l10nKey"
                          v-model="criteria.clientIndustryTypes"
              ></v-checkbox>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
          <div slot="header">Location</div>
          <v-card>
            <v-card-text>
              <ternary-checkbox v-for="fixedLocation in fixedLocations"
                                :key="fixedLocation.id"
                                :value="fixedLocation.id"
                                :label="fixedLocation.l10nKey"
                                :checked-state-model.sync="criteria.fixedLocations"
                                :indeterminate-state-model.sync="criteria.fixedLocationsNotIn"
              ></ternary-checkbox>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
          <div slot="header">Fixed salary</div>
          <v-card>
            <v-card-text>
              <v-text-field type="number" label="Minimum" suffix="€" v-model="criteria.minFixedSalary"></v-text-field>
              <v-text-field type="number" label="Maximum" suffix="€" v-model="criteria.maxFixedSalary"></v-text-field>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
          <div slot="header">Years of experience</div>
          <v-card>
            <v-card-text>
              <v-text-field type="number" label="Minimum" v-model="criteria.minYearsOfExperience"></v-text-field>
              <v-text-field type="number" label="Maximum" v-model="criteria.maxYearsOfExperience"></v-text-field>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
          <div slot="header">Talent ranking</div>
          <v-card>
            <v-card-text>
              <v-checkbox v-for="talentRanking in talentRankingReferenceData"
                          :key="talentRanking.value"
                          :value="talentRanking.value"
                          :label="talentRanking.text"
                          v-model="criteria.talentRankings"
              ></v-checkbox>
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
        <v-expansion-panel-content>
          <div slot="header">Active</div>
          <v-card>
            <v-card-text>
              <v-checkbox label="Active" v-model="criteria.active"></v-checkbox>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-flex xs12 class="text-xs-center">
        <v-btn block color="primary" @click="search(true)" :disabled="loading" :loading="loading">
          <v-icon>search</v-icon>
        </v-btn>
      </v-flex>
    </v-flex>
    <v-flex xs10>
      <v-container fluid grid-list-md>
        <v-data-iterator content-tag="v-layout" row wrap :items="talents" :pagination.sync="pagination"
                         :rows-per-page-items="rowsPerPageItems" :total-items="totalItems" ref="talentDataIterator">
          <v-flex slot="item" slot-scope="props" xs12 sm6 md4 lg3>
            <v-card>
              <v-layout row wrap class="px-2">
                <v-flex xs3 class="text-xs-center">
                  <v-badge overlap>
                    <span slot="badge">{{ getTalentRankingLetter(props.item) }}</span>
                    <v-avatar size="60" class="light-blue">
                      <v-avatar size="50">
                        <v-img
                          :src="props.item.profilePictureUrl"
                          alt="picture"
                          style="margin-top: 2px"
                        ></v-img>
                      </v-avatar>
                    </v-avatar>
                  </v-badge>
                </v-flex>
                <v-flex xs6 style="margin: auto">
                  <h4>
                    <router-link :to="{ name: 'AdminDMTalent', params: {id: props.item.id} }" target="_blank">
                      {{ props.item.firstName }} {{ props.item.lastName.toUpperCase() }}
                    </router-link>
                  </h4>
                  {{ props.item.fullProfile ? props.item.fullProfile.general.headline : 'N/A' }}
                </v-flex>
                <v-flex xs3 class="text-xs-right">
                  <v-btn fab small color="primary"
                         @click.native.stop="selectedTalent = props.item; opportunityDialog = true">
                    <v-icon>send</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex xs12>
                  <v-divider></v-divider>
                </v-flex>
                <v-flex xs9>
                  Member since {{ props.item.createdAt | formatDate('ll') }}
                </v-flex>
                <v-flex xs3 class="text-xs-right">
                  {{ getTalentMaturityLevel(props.item.maturityLevel) }}
                </v-flex>
                <v-flex xs12>
                  <v-divider></v-divider>
                </v-flex>
                <v-flex xs12 justify-center>
                  <v-btn v-if="getTalentLinkedInProfileUrl(props.item)" flat icon
                         :href="getTalentLinkedInProfileUrl(props.item)" target="_blank"
                         color="light-blue darken-3">
                    <v-icon>fab fa-linkedin</v-icon>
                  </v-btn>
                  <span
                    v-if="props.item.fullProfile && props.item.fullProfile.jobs && props.item.fullProfile && props.item.fullProfile.jobs.length"
                  >
                    {{ props.item.fullProfile.jobs[0].jobTitle }}
                    <span class="font-weight-bold">at</span>
                    {{ props.item.fullProfile.jobs[0].companyName }}
                  </span>
                  <span v-else>N/A</span>
                </v-flex>
                <v-flex xs12>
                  <v-divider></v-divider>
                </v-flex>
                <v-flex xs6>
                  <v-icon small>euro_symbol</v-icon>
                  {{ props.item.conditions.fixedSalary | formatMonetaryAmount }}
                </v-flex>
                <v-flex xs6>
                  {{ props.item.yearsOfExperience ? props.item.yearsOfExperience : '??' }} years of exp
                </v-flex>
                <v-flex xs12>
                  <v-chip v-for="taskType in props.item.conditions.taskTypes" :key="taskType.id" small>
                    {{ taskType.l10nKey }}
                  </v-chip>
                </v-flex>
                <v-flex xs12>
                  <v-divider></v-divider>
                </v-flex>
                <v-flex xs12 v-if="props.item.qualification.recommendation">
                  <div style="white-space: pre-wrap">{{ props.item.qualification.recommendation.substr(0, 120) }}</div>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
        </v-data-iterator>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions, mapState } from 'vuex';
  import AdminOpportunitySendingDialog from './Utilities/OpportunitySendingDialog';
  import RequirementSelect from './Utilities/RequirementSelect';

  const talentMaturityLevels = [
    { key: 'CLEAR_WATER', label: 'Clear water' },
    { key: 'OPEN_WATER', label: 'Open water' },
    { key: 'DEEP_WATER', label: 'Deep water' },
  ];

  export default {
    name: 'AdminSearch',
    components: {
      AdminOpportunitySendingDialog,
      RequirementSelect,
    },
    data: () => ({
      talents: [],
      totalItems: 0,
      pagination: {},
      rowsPerPageItems: [4, 8, 12],
      selectedTalent: null,
      opportunityDialog: false,
      // REFERENCE DATA
      companyMaturityLevels: [],
      jobTypes: [],
      commodityTypes: [],
      taskTypes: [],
      industryTypes: [],
      clientIndustryTypes: [],
      fixedLocations: [],
      talentMaturityLevels,
      // CRITERIA
      criteria: {
        searchQuery: null,
        requirementNotIn: null,
        companyMaturityLevels: [],
        companyMaturityLevelsNotIn: [],
        jobTypes: [],
        commodityTypes: [],
        taskTypes: [],
        taskTypesNotIn: [],
        industryTypes: [],
        clientIndustryTypes: [],
        fixedLocations: [],
        fixedLocationsNotIn: [],
        minFixedSalary: null,
        maxFixedSalary: null,
        minYearsOfExperience: null,
        maxYearsOfExperience: null,
        talentRankings: [],
        talentMaturityLevels: [],
        active: true,
      },
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
        'initialLoading',
        'user',
        'talentRankingReferenceData',
      ]),
      ...mapState([
        'getTalentMaturityLevel',
        'getLabelFromCompanyMaturityLevelL10nKey',
        'getTalentLinkedInProfileUrl',
      ]),
    },
    watch: {
      pagination: {
        handler() {
          this.search();
        },
        deep: true,
      },
      selectedRequirement(requirement) {
        this.populateOpportunityPitch(requirement);
      },
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'showSnackbar',
      ]),
      search(resetPagination = false) {
        this.prepareForApiConsumption();
        if (resetPagination) {
          this.$refs.talentDataIterator.resetPagination();
        }
        let talentQueryString = '';
        // Search query
        if (this.criteria.searchQuery) {
          talentQueryString += talentQueryString ? '&' : '';
          talentQueryString += `searchQuery=${encodeURIComponent(this.criteria.searchQuery)}`;
        }
        // Requirements criterion
        if (this.criteria.requirementNotIn) {
          talentQueryString += talentQueryString ? '&' : '';
          talentQueryString += `requirementIdsNotIn=${this.criteria.requirementNotIn.id}`;
        }
        // Company maturity levels criterion
        if (this.criteria.companyMaturityLevels.length) {
          talentQueryString += talentQueryString ? '&' : '';
          talentQueryString += 'conditions.companyMaturityLevels=';
          this.criteria.companyMaturityLevels.forEach((companyMaturityLevel, index) => {
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
        // Job types criterion
        if (this.criteria.jobTypes.length) {
          talentQueryString += talentQueryString ? '&' : '';
          talentQueryString += 'conditions.jobTypes=';
          this.criteria.jobTypes.forEach((jobType, index) => {
            talentQueryString += index ? ',' : '';
            talentQueryString += `${jobType}`;
          });
        }
        // Commodity types criterion
        if (this.criteria.commodityTypes.length) {
          talentQueryString += talentQueryString ? '&' : '';
          talentQueryString += 'conditions.commodityTypes=';
          this.criteria.commodityTypes.forEach((commodityType, index) => {
            talentQueryString += index ? ',' : '';
            talentQueryString += `${commodityType}`;
          });
        }
        // Task types
        if (this.criteria.taskTypes.length) {
          talentQueryString += talentQueryString ? '&' : '';
          talentQueryString += 'conditions.taskTypes=';
          this.criteria.taskTypes.forEach((taskType, index) => {
            talentQueryString += index ? ',' : '';
            talentQueryString += `${taskType}`;
          });
        }
        if (this.criteria.taskTypesNotIn.length) {
          talentQueryString += talentQueryString ? '&' : '';
          talentQueryString += 'taskTypesNotIn=';
          this.criteria.taskTypesNotIn.forEach((taskType, index) => {
            talentQueryString += index ? ',' : '';
            talentQueryString += `${taskType}`;
          });
        }
        // Industry types
        if (this.criteria.industryTypes.length) {
          talentQueryString += talentQueryString ? '&' : '';
          talentQueryString += 'conditions.industryTypes=';
          this.criteria.industryTypes.forEach((industryType, index) => {
            talentQueryString += index ? ',' : '';
            talentQueryString += `${industryType}`;
          });
        }
        // Client industry types
        if (this.criteria.clientIndustryTypes.length) {
          talentQueryString += talentQueryString ? '&' : '';
          talentQueryString += 'conditions.clientIndustryTypes=';
          this.criteria.clientIndustryTypes.forEach((clientIndustryType, index) => {
            talentQueryString += index ? ',' : '';
            talentQueryString += `${clientIndustryType}`;
          });
        }
        // Fixed locations
        if (this.criteria.fixedLocations.length) {
          talentQueryString += talentQueryString ? '&' : '';
          talentQueryString += 'conditions.fixedLocations=';
          this.criteria.fixedLocations.forEach((fixedLocation, index) => {
            talentQueryString += index ? ',' : '';
            talentQueryString += `${fixedLocation}`;
          });
        }
        if (this.criteria.fixedLocationsNotIn.length) {
          talentQueryString += talentQueryString ? '&' : '';
          talentQueryString += 'fixedLocationsNotIn=';
          this.criteria.fixedLocationsNotIn.forEach((fixedLocation, index) => {
            talentQueryString += index ? ',' : '';
            talentQueryString += `${fixedLocation}`;
          });
        }
        // Fixed salary criterion
        if (this.criteria.minFixedSalary) {
          talentQueryString += talentQueryString ? '&' : '';
          talentQueryString += `minFixedSalary=${this.criteria.minFixedSalary}`;
        }
        if (this.criteria.maxFixedSalary) {
          talentQueryString += talentQueryString ? '&' : '';
          talentQueryString += `maxFixedSalary=${this.criteria.maxFixedSalary}`;
        }
        // Years of experience criterion
        if (this.criteria.minYearsOfExperience) {
          talentQueryString += talentQueryString ? '&' : '';
          talentQueryString += `minYearsOfExperience=${this.criteria.minYearsOfExperience}`;
        }
        if (this.criteria.maxYearsOfExperience) {
          talentQueryString += talentQueryString ? '&' : '';
          talentQueryString += `maxYearsOfExperience=${this.criteria.maxYearsOfExperience}`;
        }
        // Talent rankings
        if (this.criteria.talentRankings.length) {
          talentQueryString += talentQueryString ? '&' : '';
          this.criteria.talentRankings.forEach((talentRanking, index) => {
            talentQueryString += index ? '&' : '';
            talentQueryString += `qualification.ranking=${talentRanking}`;
          });
        }
        // Talent maturity levels criterion
        if (this.criteria.talentMaturityLevels.length) {
          talentQueryString += talentQueryString ? '&' : '';
          this.criteria.talentMaturityLevels.forEach((talentMaturityLevel, index) => {
            talentQueryString += index ? '&' : '';
            talentQueryString += `maturityLevel=${talentMaturityLevel}`;
          });
        }
        // Active criterion
        talentQueryString += talentQueryString ? '&' : '';
        talentQueryString += `active=${this.criteria.active}`;
        // Pagination
        talentQueryString += talentQueryString ? '&' : '';
        talentQueryString += `page=${this.pagination.page - 1}&size=${this.pagination.rowsPerPage}`;
        // Sorting
        talentQueryString += talentQueryString ? '&' : '';
        talentQueryString += 'sort=createdAt,desc';
        // API consumption
        this
          .api(`/queryableTalents?projection=default&${talentQueryString}`)
          .then((response) => {
            this.talents = response.data._embedded.queryableTalents;
            this.totalItems = response.data.page.totalElements;
          })
          .catch(() => this.showSnackbar(['Error', 'error']))
          .finally(() => this.clearLoading());
      },
      getTalentRankingLetter(talent) {
        const foundTalentRanking = this.talentRankingReferenceData
          .find(talentRanking => talentRanking.value === talent.qualification.ranking);
        return foundTalentRanking ? foundTalentRanking.text : '';
      },
    },
    created() {
      this.prepareForApiConsumption(true);
      Promise.all([
        this.api('/companyMaturityLevels'),
        this.api('/jobTypes'),
        this.api('/commodityTypes'),
        this.api('/taskTypes'),
        this.api('/industryTypes'),
        this.api('/clientIndustryTypes'),
        this.api('/fixedLocations?enabled=true'),
      ])
        .then(([
                 companyMaturityLevelsResponse,
                 jobTypesResponse,
                 commodityTypesResponse,
                 taskTypesResponse,
                 industryTypesResponse,
                 clientIndustryTypesResponse,
                 fixedLocationsResponse,
               ]) => {
          // reference data
          this.companyMaturityLevels =
            companyMaturityLevelsResponse.data._embedded.companyMaturityLevels;
          this.jobTypes = jobTypesResponse.data._embedded.jobTypes;
          this.commodityTypes = commodityTypesResponse.data._embedded.commodityTypes;
          this.taskTypes = taskTypesResponse.data._embedded.taskTypes;
          this.industryTypes = industryTypesResponse.data._embedded.industryTypes;
          this.clientIndustryTypes = clientIndustryTypesResponse.data._embedded.clientIndustryTypes;
          this.fixedLocations = fixedLocationsResponse.data._embedded.fixedLocations;
        })
        .finally(() => this.clearLoading(true));
    },
    directives: {
      focus: {
        inserted(el) {
          // we must use a query selector since vuetify bury the input element inside other stuff
          el.querySelector('input').focus();
        },
      },
    },
  };
</script>

<style scoped>

</style>
