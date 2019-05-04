<template>
  <v-layout>
    <v-flex xs2 class="pr-3">
      <data-management-navigation></data-management-navigation>
    </v-flex>
    <v-flex xs10>
      <v-card>
        <v-toolbar flat>
          <v-toolbar-title>UTMs</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="editItem(null)">New UTM</v-btn>
        </v-toolbar>
        <v-data-table
          :headers="headers"
          :items="utms"
          :loading="initialLoading || loading"
        >
          <template v-slot:items="props">
            <td>{{ props.item.id }}</td>
            <td>{{ props.item.source }}</td>
            <td>{{ props.item.medium }}</td>
            <td>{{ props.item.campaign }}</td>
            <td>{{ props.item.term }}</td>
            <td>{{ props.item.content }}</td>
            <td>
              <v-icon color="primary" @click="editItem(props.item)">edit</v-icon>
              <v-icon color="error" @click="deleteItem(props.item)">delete</v-icon>
            </td>
          </template>
        </v-data-table>
      </v-card>
    </v-flex>

    <v-dialog v-model="editionDialog" v-if="selectedItem" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ editionDialogTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-text-field v-model="selectedItem.source" label="Source" :rules="[rules.required]"
                          required></v-text-field>
            <v-text-field v-model="selectedItem.medium" label="Medium"></v-text-field>
            <v-text-field v-model="selectedItem.campaign" label="Campaign"></v-text-field>
            <v-text-field v-model="selectedItem.term" label="Term"></v-text-field>
            <v-text-field v-model="selectedItem.content" label="Content"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            flat
            color="primary"
            :disabled="loading"
            @click="editionDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            :disabled="!valid"
            :loading="loading"
            @click="saveItem(selectedItem)"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deletionDialog" v-if="selectedItem" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Confirm UTM deletion ?</span>
        </v-card-title>
        <v-card-text>
          <div>
            <span class="font-weight-bold">ID</span> : {{ selectedItem.id }}
          </div>
          <div>
            <span class="font-weight-bold">Source</span> : {{ selectedItem.source }}
          </div>
          <div>
            <span class="font-weight-bold">Medium</span> : {{ selectedItem.medium }}
          </div>
          <div>
            <span class="font-weight-bold">Campaign</span> : {{ selectedItem.campaign }}
          </div>
          <div>
            <span class="font-weight-bold">Term</span> : {{ selectedItem.term }}
          </div>
          <div>
            <span class="font-weight-bold">Content</span> : {{ selectedItem.content }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            flat
            color="error"
            :disabled="loading"
            @click="deletionDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            :loading="loading"
            @click="confirmItemDeletion(selectedItem)"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import DataManagementNavigation from '../Navigation';

  const rules = {
    required: value => !!value || 'This field is required',
  };

  export default {
    name: 'data-management-utms',
    components: { DataManagementNavigation },
    data: () => ({
      rules,
      headers: [
        { text: 'Id', value: 'id' },
        { text: 'Source', value: 'source' },
        { text: 'Medium', value: 'medium' },
        { text: 'Campaign', value: 'campaign' },
        { text: 'Term', value: 'term' },
        { text: 'Content', value: 'content' },
        { text: 'Actions', value: 'id', sortable: false },
      ],
      utms: [],
      editionDialog: false,
      deletionDialog: false,
      selectedIndex: -1,
      selectedItem: null,
      valid: false,
    }),
    computed: {
      ...mapGetters([
        'api',
        'initialLoading',
        'loading',
      ]),
      editionDialogTitle() {
        return this.selectedIndex === -1 ? 'New UTM' : 'Edit UTM';
      },
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'showSnackbar',
      ]),
      editItem(item) {
        this.selectedIndex = this.utms.indexOf(item);
        this.selectedItem = Object.assign({}, item);
        this.editionDialog = true;
      },
      saveItem(item) {
        this.prepareForApiConsumption();
        if (this.selectedIndex === -1) {
          // item creation
          return this.api
            .post('/utms', item)
            .then((response) => {
              this.utms.push(response.data);
              this.editionDialog = false;
              this.showSnackbar(['New item created', 'success']);
            })
            .catch(() => this.showSnackbar(['Error', 'error']))
            .finally(() => this.clearLoading());
        }
        // item edition
        return this.api
          .patch(item._links.self.href, item)
          .then((response) => {
            this.utms.splice(this.selectedIndex, 1, response.data);
            this.editionDialog = false;
            this.showSnackbar(['Item saved', 'success']);
          })
          .catch(() => this.showSnackbar(['Error', 'error']))
          .finally(() => this.clearLoading());
      },
      deleteItem(item) {
        this.selectedIndex = this.utms.indexOf(item);
        this.selectedItem = Object.assign({}, item);
        this.deletionDialog = true;
      },
      confirmItemDeletion(item) {
        this.prepareForApiConsumption();
        return this.api
          .delete(item._links.self.href)
          .then(() => {
            this.utms.splice(this.selectedIndex, 1);
            this.deletionDialog = false;
            this.showSnackbar(['Item deleted', 'success']);
          })
          .catch(() => this.showSnackbar(['Error', 'error']))
          .finally(() => this.clearLoading());
      },
    },
    created() {
      this.prepareForApiConsumption(true);
      return this
        .api('/utms')
        .then((response) => {
          this.utms = response.data._embedded.utms;
        })
        .finally(() => this.clearLoading(true));
    },
  };
</script>

<style scoped>

</style>
