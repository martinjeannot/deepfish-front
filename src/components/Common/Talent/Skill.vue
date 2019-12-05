<template>
  <v-chip color="blue darken-2" text-color="white">
    <v-avatar class="blue darken-4">
      {{ skill.endorsements }}
    </v-avatar>
    {{ skill.name }}
  </v-chip>
</template>

<script>
  export default {
    name: 'Skill',
    props: ['skill'],
    data: () => ({}),
  };
</script>

<style scoped>

</style>
