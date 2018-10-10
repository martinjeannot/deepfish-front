<template>
  <v-layout>
    <admin-opportunity-sending-dialog :value.sync="opportunityDialog" :talent="talent"
                                      @opportunity-sent="getOpportunities"></admin-opportunity-sending-dialog>
    <v-flex xs2 class="pr-3">
      <data-management-navigation></data-management-navigation>
    </v-flex>
    <v-flex xs10>
      <v-layout v-if="initialLoading">
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
        </v-flex>
      </v-layout>
      <v-layout v-else>
        <v-flex xs12>
          <v-layout v-if="alertComponent">
            <v-flex xs12>
              <base-alert :type="alertComponent.type" :message="alertComponent.message"
                          @dismissed="onAlertComponentDismissed"></base-alert>
            </v-flex>
          </v-layout>
          <v-layout v-if="talent !== null">
            <v-flex xs4 class="pr-3">
              <v-container class="elevation-1" style="background-color: white">
                <v-layout wrap>
                  <v-flex xs12 class="text-xs-center">
                    <v-avatar size="140">
                      <img :src="talent.basicProfile.pictureUrl" alt="picture"/>
                    </v-avatar>
                  </v-flex>
                  <v-flex xs12 class="text-xs-center">
                    <h2>{{ talent.lastName.toUpperCase() }} {{ talent.firstName }}</h2>
                  </v-flex>
                  <v-flex xs12 class="text-xs-center">
                    <h4>{{ talent.basicProfile.headline }}</h4>
                  </v-flex>
                  <v-flex xs12 class="text-xs-center">
                    <v-btn color="info" @click.native.stop="opportunityDialog = true">
                      <v-icon>send</v-icon>
                    </v-btn>
                  </v-flex>
                  <v-flex xs12 class="pt-2">
                    <p>
                      <span style="font-weight: bold">Registration</span> : {{ talent.createdAt | formatDate('LLL')
                      }}
                    </p>
                  </v-flex>
                  <v-flex xs12>
                    <p>
                      <span style="font-weight: bold">Last Sign-in</span> : {{ talent.lastSignedInAt | formatDate('LLL')
                      }}
                    </p>
                  </v-flex>
                  <v-flex xs12>
                    <p>
                      <v-icon>email</v-icon>
                      {{ talent.email }}
                    </p>
                  </v-flex>
                  <v-flex xs12>
                    <p>
                      <v-icon>phone</v-icon>
                      {{ talent.phoneNumber }}
                    </p>
                  </v-flex>
                  <v-flex xs12>
                    <p>
                      <span style="font-weight: bold">Maturity level</span>
                      : {{ getTalentMaturityLevel(talent.maturityLevel) }}
                    </p>
                  </v-flex>
                  <v-flex xs12 v-if="getTalentLinkedInProfileUrl(talent.basicProfile)">
                    <p>
                      <span style="font-weight: bold">LinkedIn</span> :
                      <v-btn flat icon :href="getTalentLinkedInProfileUrl(talent.basicProfile)" target="_blank"
                             color="light-blue darken-3">
                        <v-icon>fab fa-linkedin</v-icon>
                      </v-btn>
                      {{ talent.basicProfile.numConnections }}{{ talent.basicProfile.numConnectionsCapped ? '+' : ''
                      }} connections
                    </p>
                  </v-flex>
                  <v-flex xs12>
                    <div class="mb-3">
                      <span style="font-weight: bold">Profile completion</span> : {{ profileCompletion.value }}%
                      <ul class="pl-4">
                        <li v-for="item in profileCompletion.items">{{ item }}</li>
                      </ul>
                    </div>
                  </v-flex>
                  <v-flex xs12 class="text-xs-center">
                    <v-btn @click="signInAs(talent.username)" dark>Sign in as</v-btn>
                    <v-btn v-if="talent.active" @click="deactivateProfile" color="error">Deactivate</v-btn>
                    <v-btn v-else @click="activateProfile" color="success">Activate</v-btn>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-flex>
            <v-flex xs8>
              <v-card>
                <v-tabs grow>
                  <v-tab>Profile</v-tab>
                  <v-tab>Conditions</v-tab>
                  <v-tab>Qualification</v-tab>
                  <v-tab>Opportunities</v-tab>
                  <v-tab>Notes</v-tab>
                  <v-tab>LKD Profile</v-tab>
                  <v-tab-item>
                    <v-container>
                      <v-layout row wrap>
                        <v-flex xs12 text-xs-center class="pb-3">
                          <h3>{{ talent.basicProfile.lastName }} {{ talent.basicProfile.firstName }}</h3>
                          <h4>{{ talent.basicProfile.headline }}</h4>
                          {{ talent.basicProfile.location.name }} | {{ talent.basicProfile.industry }}
                        </v-flex>
                        <v-flex xs12 class="pb-3">
                          {{ talent.basicProfile.summary }}
                        </v-flex>
                        <v-flex xs12>
                          <v-select
                            :items="Array(40).fill().map((_, i) => i + 1)"
                            v-model="talent.yearsOfExperience"
                            label="Years of experience"
                            @input="saveProfile"
                          ></v-select>
                        </v-flex>
                        <v-flex xs12 v-if="talent.basicProfile.positions._total">
                          <v-flex xs12 class="pb-2">
                            <h4>Experience</h4>
                          </v-flex>
                          <v-flex xs12>
                            {{ talent.basicProfile.positions.values[0].title }}
                          </v-flex>
                          <v-flex xs12>
                            {{ talent.basicProfile.positions.values[0].company.name }}
                            ({{ talent.basicProfile.positions.values[0].company.industry }} /
                            {{ talent.basicProfile.positions.values[0].company.size }} employees)
                          </v-flex>
                          <v-flex xs12 v-if="talent.basicProfile.positions.values[0].startDate">
                            {{ talent.basicProfile.positions.values[0].startDate | formatLinkedInDate }} -
                            <span v-if="talent.basicProfile.positions.values[0].isCurrent">Present</span>
                            <span v-else>{{ talent.basicProfile.positions.values[0].endDate | formatLinkedInDate
                              }}</span> |
                            {{ talent.basicProfile.positions.values[0].location.name }}
                          </v-flex>
                          <v-flex xs12 v-if="talent.basicProfile.positions.values[0].summary" class="pt-2"
                                  style="white-space: pre-wrap;"
                          >{{ talent.basicProfile.positions.values[0].summary }}
                          </v-flex>
                        </v-flex>
                        <v-flex xs12 v-if="talent.selfPitch" class="pt-3">
                          <h4>Self pitch</h4>
                          <div style="white-space: pre-wrap">{{ talent.selfPitch }}</div>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-tab-item>
                  <v-tab-item>
                    <v-container>
                      <v-layout row wrap>
                        <v-flex xs6>
                          <h3>Fixed salary</h3>
                          {{ talent.conditions.fixedSalary }} €
                        </v-flex>
                        <v-flex xs6>
                          <h3>Can start on</h3>
                          {{ talent.conditions.canStartOn | formatDate('LL') }}
                        </v-flex>
                        <v-flex xs12>
                          <h3>Company maturity levels</h3>
                          <v-chip v-for="companyMaturityLevel in talent.conditions.companyMaturityLevels"
                                  :key="companyMaturityLevel.id">{{ companyMaturityLevel.l10nKey }}
                          </v-chip>
                        </v-flex>
                        <v-flex xs12>
                          <h3>Job Types</h3>
                          <v-chip v-for="jobType in talent.conditions.jobTypes" :key="jobType.id">{{ jobType.l10nKey }}
                          </v-chip>
                        </v-flex>
                        <v-flex xs12>
                          <h3>Commodity types</h3>
                          <v-chip v-for="commodityType in talent.conditions.commodityTypes" :key="commodityType.id">
                            {{ commodityType.l10nKey }}
                          </v-chip>
                        </v-flex>
                        <v-flex xs12>
                          <h3>Task types</h3>
                          <v-chip v-for="taskType in talent.conditions.taskTypes" :key="taskType.id">
                            {{ taskType.l10nKey }}
                          </v-chip>
                        </v-flex>
                        <v-flex xs12>
                          <h3>Locations</h3>
                          <v-chip v-for="fixedLocation in talent.conditions.fixedLocations" :key="fixedLocation.id">
                            {{ fixedLocation.l10nKey }}
                          </v-chip>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-tab-item>
                  <v-tab-item>
                    <v-container>
                      <v-layout row wrap>
                        <v-flex xs12>
                          <v-select
                            :items="talentRankingReferenceData"
                            v-model="talent.qualification.ranking"
                            label="Ranking"
                            @input="saveQualification"
                          ></v-select>
                        </v-flex>
                        <v-flex xs4 class="pr-3">
                          <v-select
                            :items="Array(5).fill().map((_, i) => i + 1)"
                            v-model="talent.qualification.complexSellingSkillsRating"
                            label="Complex selling skills rating"
                            @input="saveQualification"
                          ></v-select>
                        </v-flex>
                        <v-flex xs4 class="pr-3">
                          <v-select
                            :items="Array(5).fill().map((_, i) => i + 1)"
                            v-model="talent.qualification.huntingSkillsRating"
                            label="Hunting skills rating"
                            @input="saveQualification"
                          ></v-select>
                        </v-flex>
                        <v-flex xs4>
                          <v-select
                            :items="Array(5).fill().map((_, i) => i + 1)"
                            v-model="talent.qualification.technicalSkillsRating"
                            label="Technical skills rating"
                            @input="saveQualification"
                          ></v-select>
                        </v-flex>
                        <v-flex xs12>
                          <h4>Recommendation</h4>
                          <v-textarea v-model="talent.qualification.recommendation" rows="9"></v-textarea>
                          <div class="text-xs-right">
                            <v-btn icon fab small color="primary" @click="saveQualification">
                              <v-icon>done</v-icon>
                            </v-btn>
                          </div>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-tab-item>
                  <v-tab-item>
                    <v-flex xs12>
                      <v-btn color="info" @click.native.stop="opportunityDialog = true">
                        <v-icon>send</v-icon>
                      </v-btn>
                    </v-flex>
                    <v-data-table
                      :rows-per-page-items="[100, {text: '$vuetify.dataIterator.rowsPerPageAll', value: 10}]"
                      :items="talent.opportunities" :headers="opportunityTable.headers" :loading="loading"
                      :pagination.sync="opportunityTable.pagination"
                      :total-items="opportunityTable.totalItems">
                      <template slot="items" slot-scope="props">
                        <td>{{ props.item.createdAt | formatDate('LLL') }}</td>
                        <td>
                          <router-link :to="{ name: 'AdminDMCompany', params: {id: props.item.company.id} }">
                            {{ props.item.company.name }}
                          </router-link>
                        </td>
                        <td>
                          <span :class="`${getOpportunityStatusColor(props.item.talentStatus)}--text`"
                                style="font-weight: bold">
                            {{ props.item.talentStatus }}
                          </span>
                        </td>
                        <td>
                          <span :class="`${getOpportunityStatusColor(props.item.employerStatus)}--text`"
                                style="font-weight: bold">
                            {{ props.item.employerStatus }}
                          </span>
                        </td>
                        <td>
                          <v-btn v-if="props.item.forwarded" @click="retrieveTalent(props.item)" color="error">
                            Retrieve from employer
                          </v-btn>
                          <v-btn v-else @click="forwardTalent(props.item)" color="success">
                            Send to employer
                          </v-btn>
                        </td>
                      </template>
                    </v-data-table>
                    <v-flex xs12>
                      <ul style="list-style: none">
                        <li
                          v-for="opportunity in talent.opportunities.filter(opportunity => opportunity.talentDeclinationReason.length || opportunity.employerDeclinationReason.length)">
                          <v-flex xs12 class="mb-3">
                            <div v-if="opportunity.talentDeclinationReason.length">
                              {{talent.firstName }} declined {{ opportunity.company.name
                              }} => {{ opportunity.talentDeclinationReason }}
                            </div>
                            <div v-else>
                              {{ opportunity.company.name }} declined {{ talent.firstName
                              }} => {{ opportunity.employerDeclinationReason }}
                            </div>
                          </v-flex>
                        </li>
                      </ul>
                    </v-flex>
                  </v-tab-item>
                  <v-tab-item>
                    <v-container>
                      <v-layout row wrap>
                        <v-flex xs12>
                          <v-textarea label="Notes" v-model="talent.notes" prepend-inner-icon="lock"
                                      rows="16"></v-textarea>
                          <div class="text-xs-right">
                            <v-btn icon fab small color="primary" @click="saveProfile">
                              <v-icon>done</v-icon>
                            </v-btn>
                          </div>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-tab-item>
                  <v-tab-item>
                    <v-container>
                      <v-layout row wrap>
                        <v-flex xs12>
                          <v-textarea v-model="talent.fullProfileText" prepend-inner-icon="lock" rows="16"></v-textarea>
                          <div class="text-xs-right">
                            <v-btn icon fab small color="primary" @click="saveProfile">
                              <v-icon>done</v-icon>
                            </v-btn>
                          </div>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-tab-item>
                </v-tabs>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
  import moment from 'moment';
  import { mapGetters, mapActions, mapState } from 'vuex';
  import DataManagementNavigation from '../Navigation';
  import AdminOpportunitySendingDialog from '../../Utilities/OpportunitySendingDialog';

  export default {
    name: 'talent',
    components: {
      DataManagementNavigation,
      AdminOpportunitySendingDialog,
    },
    data: () => ({
      talent: null,
      opportunityDialog: false,
      opportunityTable: {
        headers: [
          { text: 'Sent at', value: 'createdAt' },
          { text: 'Company', value: 'company.name', sortable: false },
          { text: 'Talent status', value: 'talentStatus' },
          { text: 'Employer status', value: 'employerStatus' },
          { text: 'Actions', value: 'name', sortable: false },
        ],
        totalItems: 0,
        pagination: {
          sortBy: 'createdAt',
          descending: true,
        },
      },
    }),
    props: ['id'],
    computed: {
      ...mapGetters([
        'api',
        'loading',
        'initialLoading',
        'alertComponent',
        'talentRankingReferenceData',
      ]),
      ...mapState([
        'getTalentMaturityLevel',
        'getOpportunityStatusColor',
        'getTalentLinkedInProfileUrl',
      ]),
      profileCompletion() {
        const profileCompletion = { value: 100, items: [] };
        let profileItemCounter = 0;
        if (this.talent.phoneNumber === 'null') {
          profileCompletion.items.push('Phone number');
        }
        profileItemCounter += 1;
        if (!this.talent.selfPitch) {
          profileCompletion.items.push('Self pitch');
        }
        profileItemCounter += 1;
        if (!this.talent.conditions.fixedSalary) {
          profileCompletion.items.push('Fixed salary');
        }
        profileItemCounter += 1;
        if (!this.talent.conditions.companyMaturityLevels.length) {
          profileCompletion.items.push('Company maturity levels');
        }
        profileItemCounter += 1;
        if (!this.talent.conditions.jobTypes.length) {
          profileCompletion.items.push('Job types');
        }
        profileItemCounter += 1;
        if (!this.talent.conditions.commodityTypes.length) {
          profileCompletion.items.push('Commodity types');
        }
        profileItemCounter += 1;
        if (!this.talent.conditions.taskTypes.length) {
          profileCompletion.items.push('Task types');
        }
        profileItemCounter += 1;
        if (!this.talent.conditions.fixedLocations.length) {
          profileCompletion.items.push('Locations');
        }
        profileItemCounter += 1;
        profileCompletion.value -=
          Math.floor(profileCompletion.items.length * (100 / profileItemCounter));
        return profileCompletion;
      },
    },
    watch: {
      'opportunityTable.pagination': {
        handler() {
          this.getOpportunities();
        },
        deep: true,
      },
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'showSnackbar',
        'showSuccessSnackbar',
        'setErrorAfterApiConsumption',
        'onAlertComponentDismissed',
        'signInAs',
        'saveTalent',
      ]),
      activateProfile() {
        this.talent.active = true;
        this.saveProfile();
      },
      deactivateProfile() {
        this.talent.active = false;
        this.saveProfile();
      },
      saveProfile() {
        this.saveTalent(this.talent)
          .then(() => this.showSnackbar('OK'))
          .catch(() => {
            this.showSnackbar('Error');
            this.fetchInitialData();
          });
      },
      saveQualification() {
        this.api
          .patch(this.talent.qualification._links.self.href, this.talent.qualification)
          .then(() => this.showSuccessSnackbar())
          .catch(() => this.showSnackbar('Error'));
      },
      forwardTalent(opportunity) {
        opportunity.forwarded = true;
        opportunity.forwardedAt = moment().utc().format();
        opportunity.employerStatus = 'PENDING';
        this.saveOpportunity(opportunity);
      },
      retrieveTalent(opportunity) {
        opportunity.forwarded = false;
        opportunity.employerStatus = null;
        this.saveOpportunity(opportunity);
      },
      saveOpportunity(opportunity) {
        const opportunityModel = Object.assign({}, opportunity);
        delete opportunityModel.talent;
        delete opportunityModel.company;
        this.api
          .patch(opportunity._links.self.href, opportunityModel)
          .then(() => {
            this.showSnackbar('Success');
            this.$forceUpdate();
          })
          .catch(() => {
            this.fetchInitialData();
            this.showSnackbar('Error');
          });
      },
      getOpportunitiesPromise() {
        const path = '/opportunities';
        let queryString = `talent=${this.talent._links.self.href.split('/').splice(-1)[0]}&projection=admin-item`;
        queryString += `&page=${this.opportunityTable.pagination.page - 1}&size=${this.opportunityTable.pagination.rowsPerPage}`;
        queryString += this.opportunityTable.pagination.sortBy ? `&sort=${this.opportunityTable.pagination.sortBy},${this.opportunityTable.pagination.descending ? 'desc' : 'asc'}` : '';
        return this.api(`${path}?${queryString}`);
      },
      getOpportunities() {
        this.prepareForApiConsumption();
        this.getOpportunitiesPromise()
          .then((response) => {
            this.talent.opportunities = response.data._embedded.opportunities;
            this.opportunityTable.totalItems = response.data.page.totalElements;
          })
          .catch(() => this.showSnackbar('Error while retrieving opportunities'))
          .finally(() => this.clearLoading());
      },
      fetchInitialData() {
        this.prepareForApiConsumption(true);
        Promise
          .all([
            this.api(`/talents/${this.id}`),
          ])
          .then(([
                   talentResponse,
                 ]) => {
            this.talent = talentResponse.data;
            return Promise.all([
              this.api(`${this.talent._links.conditions.href}?projection=default`),
              this.api(this.talent._links.qualification.href),
              this.getOpportunitiesPromise(),
            ]);
          })
          .then(([
                   conditionsResponse,
                   qualificationResponse,
                   opportunitiesResponse,
                 ]) => {
            this.talent.conditions = conditionsResponse.data;
            this.talent.qualification = qualificationResponse.data;
            this.talent.opportunities = opportunitiesResponse.data._embedded.opportunities;
            this.opportunityTable.totalItems = opportunitiesResponse.data.page.totalElements;
          })
          .catch(() => this.setErrorAfterApiConsumption())
          .finally(() => this.clearLoading(true));
      },
    },
    created() {
      this.fetchInitialData();
    },
  };
</script>

<style scoped>

</style>
