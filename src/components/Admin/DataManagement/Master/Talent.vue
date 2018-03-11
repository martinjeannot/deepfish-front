<template>
  <v-layout>
    <v-flex xs2 class="pr-3">
      <data-management-navigation></data-management-navigation>
    </v-flex>
    <v-flex xs10>
      <v-layout v-if="loading">
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
                      <img :src="talent.profile.pictureUrl" alt="picture"/>
                    </v-avatar>
                  </v-flex>
                  <v-flex xs12 class="text-xs-center">
                    <h2>{{ talent.lastName.toUpperCase() }} {{ talent.firstName }}</h2>
                  </v-flex>
                  <v-flex xs12 class="text-xs-center mb-3">
                    <h4>{{ talent.profile.headline }}</h4>
                  </v-flex>
                  <v-flex xs12>
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
                      <span style="font-weight: bold">Maturity level</span> : {{ talent.maturityLevel.split('_')[0] }}
                    </p>
                  </v-flex>
                  <v-flex xs12>
                    <p>
                      <span style="font-weight: bold">LinkedIn</span> :
                      <v-btn flat icon :href="talent.profile.publicProfileUrl" target="_blank"
                             color="light-blue darken-3">
                        <v-icon>open_in_new</v-icon>
                      </v-btn>
                      {{ talent.profile.numConnections }}{{ talent.profile.numConnectionsCapped ? '+' : ''
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
            <v-flex xs8 class="elevation-1" style="background-color: white">
              <v-tabs grow>
                <v-tab>Profile</v-tab>
                <v-tab>Conditions</v-tab>
                <v-tab>Qualification</v-tab>
                <v-tab>Opportunities</v-tab>
                <v-tab-item>
                  <v-container>
                    <v-layout row wrap>
                      <v-flex xs12 text-xs-center class="pb-3">
                        <h3>{{ talent.profile.lastName }} {{ talent.profile.firstName }}</h3>
                        <h4>{{ talent.profile.headline }}</h4>
                        {{ talent.profile.location.name }} | {{ talent.profile.industry }}
                      </v-flex>
                      <v-flex xs12 class="pb-3">
                        {{ talent.profile.summary }}
                      </v-flex>
                      <v-flex xs12 class="pb-2">
                        <h4>Experience</h4>
                      </v-flex>
                      <v-flex xs12>
                        {{ talent.profile.positions.values[0].title }}
                      </v-flex>
                      <v-flex xs12>
                        {{ talent.profile.positions.values[0].company.name }}
                        ({{ talent.profile.positions.values[0].company.industry }} /
                        {{ talent.profile.positions.values[0].company.size }} employees)
                      </v-flex>
                      <v-flex v-if="talent.profile.positions.values[0].startDate">
                        {{ talent.profile.positions.values[0].startDate.year }} -
                        <span v-if="talent.profile.positions.values[0].isCurrent">Present</span>
                        <span v-else>DATE ICI</span> |
                        {{ talent.profile.positions.values[0].location.name }}
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
                        <h3>Jobs</h3>
                        <v-chip v-for="job in talent.conditions.jobs" :key="job.id">{{ job.l10nKey }}</v-chip>
                      </v-flex>
                      <v-flex xs12>
                        <h3>Commodity types</h3>
                        <v-chip v-for="commodityType in talent.conditions.commodityTypes" :key="commodityType.id">
                          {{ commodityType.l10nKey }}
                        </v-chip>
                      </v-flex>
                      <v-flex xs12>
                        <h3>Task types</h3>
                        <v-chip v-for="taskType in talent.conditions.taskTypes" :key="taskType.id">{{ taskType.l10nKey
                          }}
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
                      <v-flex>
                        <h4>Recommendation</h4>
                        <v-text-field v-model="talent.qualification.recommendation" multi-line rows="9">
                        </v-text-field>
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
                  <v-container>
                    <h3>Accepted opportunities</h3>
                    <v-data-table :headers="acceptedOpportunitiesHeaders" :items="acceptedOpportunities"
                                  class="elevation-1">
                      <template slot="items" slot-scope="props">
                        <td>{{ props.item.companyName }}</td>
                        <td>{{ props.item.companyName }}</td>
                        <td>
                          <v-btn v-if="props.item.forwarded"
                                 icon @click="retrieveTalent(props.item)" color="error">
                            <v-icon>arrow_back</v-icon>
                          </v-btn>
                          <v-btn v-else
                                 icon @click="forwardTalent(props.item)" color="success">
                            <v-icon>arrow_forward</v-icon>
                          </v-btn>
                        </td>
                      </template>
                    </v-data-table>
                  </v-container>
                </v-tab-item>
              </v-tabs>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import DataManagementNavigation from '../Navigation';

  export default {
    name: 'talent',
    components: { DataManagementNavigation },
    data: () => ({
      talent: null,
      acceptedOpportunitiesHeaders: [
        { text: 'Date', value: 'companyName' },
        { text: 'Company', value: 'companyName' },
        { text: 'Actions', value: 'name', sortable: false },
      ],
    }),
    props: ['id'],
    computed: {
      ...mapGetters([
        'api',
        'loading',
        'alertComponent',
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
        if (!this.talent.conditions.jobs.length) {
          profileCompletion.items.push('Jobs');
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
      acceptedOpportunities() {
        return this.talent.opportunities.filter(opportunity => opportunity.status === 'ACCEPTED');
      },
      pendingOpportunities() {
        return this.talent.opportunities.filter(opportunity => opportunity.status === 'PENDING');
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
        const profile = Object.assign({}, this.talent);
        delete profile.conditions;
        delete profile.qualification;
        delete profile.opportunities;
        this.api
          .patch(this.talent._links.self.href, profile)
          .then(() => this.showSnackbar('Success'))
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
        // eslint-disable-next-line no-param-reassign
        opportunity.forwarded = true;
        this.saveOpportunity(opportunity);
      },
      retrieveTalent(opportunity) {
        // eslint-disable-next-line no-param-reassign
        opportunity.forwarded = false;
        this.saveOpportunity(opportunity);
      },
      saveOpportunity(opportunity) {
        this.api
          .patch(opportunity._links.self.href, opportunity)
          .then(() => {
            this.showSnackbar('Success');
            this.$forceUpdate();
          })
          .catch(() => {
            this.fetchData();
            this.showSnackbar('Error');
          });
      },
      fetchInitialData() {
        this.prepareForApiConsumption();
        this
          .api(`/talents/${this.id}`)
          .then((response) => {
            this.talent = response.data;
            return Promise.all([
              this.api(`${this.talent._links.conditions.href}?projection=default`),
              this.api(this.talent._links.qualification.href),
              this.api(`${this.talent._links.opportunities.href}?projection=full`),
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
          })
          .catch(() => this.setErrorAfterApiConsumption())
          .finally(() => this.clearLoading());
      },
    },
    created() {
      this.fetchInitialData();
    },
  };
</script>

<style scoped>

</style>
