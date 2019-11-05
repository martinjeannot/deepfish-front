<template>
  <v-card class="w-100 h-100">
    <google-map-loader
      :map-options="mapOptions"
    >
    </google-map-loader>
  </v-card>
</template>

<script>
  import { mapGetters } from 'vuex';
  import GoogleMapLoader from '@/components/Utilities/GoogleMapLoader';

  export default {
    name: 'TalentOpportunityMap',
    components: {
      GoogleMapLoader,
    },
    props: {
      opportunity: Object,
    },
    data: () => ({}),
    computed: {
      ...mapGetters([
        'googleMapSettings',
      ]),
      mapOptions() {
        return {
          ...this.googleMapSettings,
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
