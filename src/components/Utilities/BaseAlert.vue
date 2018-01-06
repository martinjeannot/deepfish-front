<template>
  <v-alert :type="type" transition="scale-transition" value="true" dismissible @input="onDismiss">
    {{ message }}
  </v-alert>
</template>

<script>
  export default {
    name: 'base-alert',
    props: ['type', 'message'],
    methods: {
      onDismiss() {
        this.$emit('dismissed');
      },
    },
  };
</script>

<style scoped>

</style>
