<template>
  <v-timeline
    dense
  >
    <v-timeline-item
      v-for="(school, i) in schools"
      :key="i"
      color="indigo darken-2"
      icon="school"
      fill-dot
    >
      <v-card>
        <v-card-text>
          <v-flex xs12 class="font-weight-bold">
            <a
              :href="school.schoolUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ school.schoolName }}
            </a>
          </v-flex>
          <v-flex xs12>
            {{ school.degree }} &mdash; <span class="font-italic">{{ school.degreeSpec }}</span>
          </v-flex>
          <v-flex xs12>
            {{ school.dateRange }}
          </v-flex>
          <v-flex xs12 class="pt-2" v-if="school.description">
            {{ school.description }}
          </v-flex>
        </v-card-text>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
  export default {
    name: 'EducationTimeline',
    props: ['schools'],
    data: () => ({}),
  };
</script>

<style scoped>

</style>
