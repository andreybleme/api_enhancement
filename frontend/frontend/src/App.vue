<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>ENERGICOS</span>
        <span class="font-weight-light">EMPLOYEES</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        text
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">How it works?</span>
      </v-btn>
    </v-app-bar>

    <v-content>
      <Employees/>
    </v-content>
  </v-app>
</template>

<script>
import Employees from './components/Employees';

export default {
  name: 'App',
  components: {
    Employees,
  },
  data: () => ({
    //
  }),
};
</script>
