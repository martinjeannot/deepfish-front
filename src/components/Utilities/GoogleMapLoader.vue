<template>
  <div class="w-100 h-100">
    <div
      ref="googleMap"
      class="w-100 h-100"
    ></div>
    <template v-if="Boolean(this.google) && Boolean(this.map)">
      <slot
        :google="google"
        :map="map"
      ></slot>
    </template>
  </div>
</template>

<script>
  import GoogleMapsApiLoader from 'google-maps-api-loader';

  export default {
    name: 'GoogleMapLoader',
    props: {
      mapOptions: Object,
    },
    data: () => ({
      google: null,
      map: null,
    }),
    async created() {
      this.google = await GoogleMapsApiLoader({
        apiKey: process.env.GOOGLE_MAPS_API_KEY,
      });
      this.map = new this.google.maps.Map(
        this.$refs.googleMap,
        this.mapOptions,
      );
    },
  };
</script>

<style>
  .w-100 {
    width: 100%;
  }

  .h-100 {
    height: 100%;
  }
</style>
