<template>
  <v-img
    :src="opportunity.company.coverImageUrl"
    max-height="26rem"
    gradient="rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)"
  >
    <v-layout wrap fill-height align-center class="pa-3">
      <v-flex xs6 offset-xs3 sm3 offset-sm1 md2 lg1
              :class="['text-xs-center', {'pb-2': $vuetify.breakpoint.xsOnly}]"
      >
        <v-card
          class="d-inline-flex pa-3"
        >
          <v-img
            :src="opportunity.company.logoURL"
            min-width="8rem"
          ></v-img>
        </v-card>
      </v-flex>
      <v-flex xs12 sm7 md8 lg9>
        <v-layout wrap class="text-xs-center">
          <v-flex xs12 class="pb-2">
            <h4 class="display-1 white--text">
              {{ opportunity.company.name }}
            </h4>
          </v-flex>
          <v-flex xs1 align-self-center class="hidden-sm-and-up">
            <v-icon dark small>location_on</v-icon>
          </v-flex>
          <v-flex xs11 sm12 class="pb-2 white--text">
            <v-icon dark small class="hidden-xs-only">location_on</v-icon>
            {{ opportunity.company.headquartersAddress }}
          </v-flex>
          <v-flex xs1 align-self-center class="hidden-sm-and-up">
            <v-icon dark small>public</v-icon>
          </v-flex>
          <v-flex xs11 sm12>
            <v-icon dark small class="hidden-xs-only">public</v-icon>
            <a :href="opportunity.company.websiteUrl" target="_blank"
               style="color: white">{{ opportunity.company.websiteUrl }}</a>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-img>
</template>

<script>
  export default {
    name: 'TalentOpportunityCover',
    props: ['opportunity'],
    data: () => ({}),
  };
</script>

<style scoped>

</style>
