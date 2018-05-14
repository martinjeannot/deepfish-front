<template>
  <v-alert :type="type" transition="scale-transition" value="true" dismissible @input="onDismiss">
    <div v-if="rawHtml" v-html="message"></div>
    <div v-else>
      {{ message }}
    </div>
  </v-alert>
</template>

<script>
  export default {
    name: 'base-alert',
    props: ['type', 'message', 'rawHtml'],
    methods: {
      onDismiss() {
        this.$emit('dismissed');
      },
    },
  };
</script>

<style scoped>

</style>
