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
                      <img :src="talent.profile.originalPictureUrl" alt="avatar"/>
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
              <v-tabs>
                <v-tab>Profile</v-tab>
                <v-tab-item>Lorem ipsum</v-tab-item>
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
    }),
    props: ['id'],
    computed: {
      ...mapGetters([
        'api',
        'loading',
        'alertComponent',
      ]),
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'setErrorAfterApiConsumption',
        'onAlertComponentDismissed',
        'signInAs',
      ]),
    },
    created() {
      this.prepareForApiConsumption();
      this
        .api(`/talents/${this.id}`)
        .then((response) => {
          this.talent = response.data;
          return Promise.all([
            this.api(this.talent._links.profile.href),
            this.api(this.talent._links.conditions.href),
          ]);
        })
        .then(([
                 profileResponse,
                 conditionsResponse,
               ]) => {
          this.talent.profile = profileResponse.data;
          this.talent.conditions = conditionsResponse.data;
          console.log(this.talent);
        })
        .catch(() => this.setErrorAfterApiConsumption())
        .finally(() => this.clearLoading());
    },
  };
</script>

<style scoped>

</style>
