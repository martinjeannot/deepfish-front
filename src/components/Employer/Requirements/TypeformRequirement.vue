<template>
  <v-layout>
    <v-flex xs12 sm8 offset-sm2>
      <v-card>
        <v-card-title>
          <v-flex xs12 class="text-xs-center">
            <div class="headline">Déclarer un nouveau besoin</div>
          </v-flex>
        </v-card-title>
        <v-card-text>
          <div class="typeform-widget" :data-url="requirementCreationTypeformUrl + user.id" data-transparency="100"
               data-hide-headers="true" data-hide-footer="true" style="width: 100%; height: 500px;"></div>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'typeform-requirement',
    data: () => ({
      jobTypes: [],
      seniorities: [],
      requirement: null,
      requirementValid: false,
      requirementCreationTypeformUrl: `${process.env.REQUIREMENT_CREATION_TYPEFORM_URL}`,
    }),
    computed: {
      ...mapGetters(['user']),
    },
    methods: {
      loadTypeform() {
        let js;
        let q;
        const d = document;
        const gi = d.getElementById;
        const ce = d.createElement;
        const gt = d.getElementsByTagName;
        const id = 'typef_orm';
        const b = 'https://embed.typeform.com/';
        if (!gi.call(d, id)) {
          js = ce.call(d, 'script');
          js.id = id;
          js.src = `${b}embed.js`;
          q = gt.call(d, 'script')[0];
          q.parentNode.insertBefore(js, q);
        }
      },
    },
    created() {
      this.loadTypeform();
    },
  };
</script>

<style scoped>

</style>
