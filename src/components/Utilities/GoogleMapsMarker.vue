<template>

</template>

<script>
  export default {
    name: 'GoogleMapsMarker',
    props: {
      google: {
        type: Object,
        required: true,
      },
      map: {
        type: Object,
        required: true,
      },
      marker: {
        type: Object,
        required: true,
      },
    },
    mounted() {
      return new this.google.maps.Marker({
        position: this.marker.position,
        map: this.map,
      });
    },
  };
</script>

<style scoped>

</style>
