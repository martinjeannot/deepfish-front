<template>
  <v-layout>
    <v-flex xs12 sm8 offset-sm2>
      <v-card>
        <v-card-title>
          <v-flex xs12 class="text-xs-center">
            <div class="headline">Déclarer un nouveau besoin</div>
          </v-flex>
        </v-card-title>
        <div
          class="calendly-inline-widget"
          :data-url="calendlyUrl"
          style="min-width:288px;height:642px;"
        ></div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'CalendlyRequirement',
    data: () => ({}),
    computed: {
      ...mapGetters([
        'user',
      ]),
      calendlyUrl() {
        return `${process.env.REQUIREMENT_CALENDLY_URL}?name=${this.user.firstName}%20${this.user.lastName}&email=${this.user.username}&a1=${this.user.phoneNumber}`;
      },
    },
    mounted() {
      const calendlyScript = document.createElement('script');
      calendlyScript.setAttribute('src', 'https://assets.calendly.com/assets/external/widget.js');
      document.head.appendChild(calendlyScript);
    },
  };
</script>

<style scoped>

</style>
