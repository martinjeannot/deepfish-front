<template>
  <v-select
    v-model="user"
    :hide-details="true"
    :items="users"
    :label="label"
  >
    <template #selection="{ item }">
      <div class="input-group__selections__comma">
        {{ item.firstName }} {{ item.lastName }}
      </div>
    </template>
    <template #item="{ item }">
      <v-list-tile-content>
        <v-list-tile-title>
          {{ item.firstName }} {{ item.lastName }}
        </v-list-tile-title>
      </v-list-tile-content>
    </template>
  </v-select>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'UserSelect',
    props: {
      label: String,
      value: String, // hypermedia link to the user
    },
    data: () => ({
      users: [],
    }),
    computed: {
      ...mapGetters([
        'api',
      ]),
      user: {
        get() {
          return this.users.find(user => user._links.self.href === this.value);
        },
        set(value) {
          this.$emit('input', value._links.self.href);
        },
      },
    },
    methods: {
      ...mapActions([
        'showSnackbar',
      ]),
    },
    created() {
      this
        .api('/users')
        .then((response) => {
          this.users = response.data._embedded.users;
        })
        .catch(() => this.showSnackbar(['Error', 'error']));
    },
  };
</script>

<style scoped>

</style>
