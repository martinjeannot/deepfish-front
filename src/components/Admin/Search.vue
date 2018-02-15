<template>
  <v-layout>
    <v-flex xs2 class="pa-2" style="padding-top: 12px!important;">
      <v-layout wrap class="elevation-1 pa-2" style="background-color: white">
        <div class="pt-1"></div>
        <v-flex xs12>
          <v-checkbox v-for="talentMaturityLevel in talentMaturityLevels"
                      :key="talentMaturityLevel.key"
                      :value="talentMaturityLevel.key"
                      :label="talentMaturityLevel.label"
                      v-model="talentMaturityLevelsCriterion"
          ></v-checkbox>
        </v-flex>
        <v-flex xs12 class="text-xs-right">
          <v-btn @click="search" fab small color="primary">
            <v-icon>search</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
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
      talents: [],
      selectedTalent: null,
      opportunityDialog: false,
      requirements: [],
      selectedRequirement: null,
      opportunityPitch: '',
      rules,
      opportunityValid: false,
      talentMaturityLevels,
      talentMaturityLevelsCriterion: [],
      rowsPerPageItems: [4, 8, 12],
      pagination: {
        rowsPerPage: 4,
      },
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
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
        // talentMaturityLevels
        let talentMaturityLevelsQueryString = '';
        if (this.talentMaturityLevelsCriterion.length) {
          this.talentMaturityLevelsCriterion.forEach((talentMaturityLevel, index) => {
            talentMaturityLevelsQueryString += index ? '&' : '';
            talentMaturityLevelsQueryString += `maturityLevel=${talentMaturityLevel}`;
          });
        }
        // API consumption
        this
          .api(`/talents?${talentMaturityLevelsQueryString}`)
          .then((response) => {
            this.talents = response.data._embedded.talents;
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
      this.prepareForApiConsumption();
      this
        .api('/requirements?projection=default')
        .then((response) => {
          this.requirements = response.data._embedded.requirements;
        })
        .finally(() => this.clearLoading());
    },
  };
</script>

<style scoped>

</style>
