<template>
  <v-alert color="error" icon="warning" dismissible value="true" @input="onDismiss">
    {{ text }}
  </v-alert>
</template>

<script>
  export default {
    name: 'base-alert',
    props: ['text'],
    methods: {
      onDismiss() {
        this.$emit('dismissed');
      },
    },
  };
</script>

<style scoped>

</style>
