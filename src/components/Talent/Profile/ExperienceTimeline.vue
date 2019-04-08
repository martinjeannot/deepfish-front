<template>
  <v-timeline
    dense
  >
    <v-timeline-item
      v-for="(job, i) in jobs"
      :key="i"
      color="blue darken-2"
      icon="work"
      fill-dot
    >
      <v-card>
        <v-card-text>
          <v-flex xs12 class="font-weight-bold">
            {{ job.jobTitle }}
          </v-flex>
          <v-flex xs12>
            <a
              :href="job.companyUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ job.companyName }}
            </a>
          </v-flex>
          <v-flex xs12>
            {{ job.dateRange }}
          </v-flex>
          <v-flex xs12 class="grey--text text--darken-2">
            {{ job.location }}
          </v-flex>
          <v-flex xs12 style="white-space: pre-line">
            {{ job.description }}
          </v-flex>
        </v-card-text>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
  export default {
    name: 'ExperienceTimeline',
    props: ['jobs'],
    data: () => ({}),
  };
</script>

<style scoped>

</style>
