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
                      <img :src="talent.profile.pictureUrls.values[0]" alt="picture"/>
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
                    <p><span style="font-weight: bold">LinkedIn</span> :
                      <v-btn flat icon :href="talent.profile.publicProfileUrl" target="_blank">
                        <v-icon>open_in_new</v-icon>
                      </v-btn>
                    </p>
                  </v-flex>
                  <v-flex xs12 class="text-xs-center">
                    <v-btn @click="signInAs(talent.username)" dark>Sign in as</v-btn>
                    <v-btn>Enable</v-btn>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-flex>
            <v-flex xs8 class="elevation-1">
              <v-tabs grow>
                <v-tab>Profile</v-tab>
                <v-tab>Conditions</v-tab>
                <v-tab>Qualification</v-tab>
                <v-tab>Opportunities</v-tab>
                <v-tab-item>le profile</v-tab-item>
                <v-tab-item>les conditions du profil</v-tab-item>
                <v-tab-item>la qualif du profile</v-tab-item>
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
        'setErrorAfterApiConsumption',
        'onAlertComponentDismissed',
        'signInAs',
      ]),
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
    },
    created() {
      this.prepareForApiConsumption();
      this
        .api(`/talents/${this.id}`)
        .then((response) => {
          this.talent = response.data;
          return Promise.all([
            this.api(this.talent._links.conditions.href),
            this.api(`${this.talent._links.opportunities.href}?projection=full`),
          ]);
        })
        .then(([
                 conditionsResponse,
                 opportunitiesResponse,
               ]) => {
          this.talent.conditions = conditionsResponse.data;
          this.talent.opportunities = opportunitiesResponse.data._embedded.opportunities;
        })
        .catch(() => this.setErrorAfterApiConsumption())
        .finally(() => this.clearLoading());
    },
  };
</script>

<style scoped>

</style>
