<template>
  <div>
    <v-icon v-for="i in maxRating" :key="i" :color="color" :small="small">
      {{ i <= rating ? 'star' : 'star_border' }}
    </v-icon>
  </div>
</template>

<script>
  export default {
    name: 'star-rating',
    props: {
      color: {
        default: 'amber',
      },
      maxRating: {
        type: Number,
        default: 5,
      },
      rating: {
        type: Number,
        default: 0,
      },
      small: {
        default: false,
      },
    },
  };
</script>

<style scoped>

</style>
