<template>
  <v-card class="w-100 h-100 full-height-centered">
    <google-maps-loader
      v-if="opportunity.company.headquartersGeocode"
      :map-options="mapOptions"
    >
      <template slot-scope="{ google, map }">
        <google-maps-marker
          :google="google"
          :map="map"
          :marker="marker"
        ></google-maps-marker>
      </template>
    </google-maps-loader>
    <v-card-text v-else>
      <v-layout wrap class="text-xs-center">
        <v-flex xs12 class="caption grey--text text--darken-2">
          LIEU DE TRAVAIL
        </v-flex>
        <v-flex xs1 align-self-center class="hidden-sm-and-up">
          <v-icon>location_on</v-icon>
        </v-flex>
        <v-flex xs11 sm12 class="pb-2 white--text">
          <v-icon class="hidden-xs-only">location_on</v-icon>
          <a
            :href="`http://maps.google.com/?q=${opportunity.company.headquartersAddress}`"
            target="_blank"
          >
            {{ opportunity.company.headquartersAddress }}
          </a>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
  import { mapGetters } from 'vuex';
  import GoogleMapsLoader from '@/components/Utilities/GoogleMapsLoader';
  import GoogleMapsMarker from '@/components/Utilities/GoogleMapsMarker';

  export default {
    name: 'TalentOpportunityMap',
    components: {
      GoogleMapsLoader,
      GoogleMapsMarker,
    },
    props: {
      opportunity: Object,
    },
    data: () => ({}),
    computed: {
      ...mapGetters([
        'googleMapsSettings',
      ]),
      mapOptions() {
        return {
          ...this.googleMapsSettings,
          center: {
            lat: this.opportunity.company.headquartersGeocode.geometry.location.lat,
            lng: this.opportunity.company.headquartersGeocode.geometry.location.lng,
          },
        };
      },
      marker() {
        return {
          position: {
            lat: this.opportunity.company.headquartersGeocode.geometry.location.lat,
            lng: this.opportunity.company.headquartersGeocode.geometry.location.lng,
          },
        };
      },
    },
  };
</script>

<style scoped>
  .w-100 {
    width: 100%;
  }

  .h-100 {
    height: 100%;
  }

  .full-height-centered {
    height: 100%;
    display: flex;
    align-items: center;
  }
</style>
