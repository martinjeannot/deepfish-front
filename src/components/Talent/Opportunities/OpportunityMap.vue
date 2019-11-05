<template>
  <v-card class="w-100 h-100">
    <google-maps-loader
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
    data: () => ({
      marker: {
        position: {
          lat: -34.01,
          lng: 151.01,
        },
      },
    }),
    computed: {
      ...mapGetters([
        'googleMapsSettings',
      ]),
      mapOptions() {
        return {
          ...this.googleMapsSettings,
          center: {
            lat: -34,
            lng: 151,
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
</style>
