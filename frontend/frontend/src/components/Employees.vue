<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
      <v-flex xs12>
        <v-data-table
          :headers="headers"
          :items="employees"
          :options.sync="options"
          :server-items-length="totalEmployees"
          :loading="loading"
          class="elevation-1"
        ></v-data-table>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
import axios from '../main'
export default {
  data () {
    return {
      totalEmployees: 0,
      employees: [],
      loading: true,
      options: {},
      lastEvaluatedKey: '',
      headers: [
        {
          text: 'Id',
          align: 'left',
          sortable: false,
          value: 'id',
        },
        { text: 'Name', value: 'name' },
        { text: 'Department', value: 'department' },
      ],
    }
  },
  watch: {
    options: {
      handler () {
        this.getDataFromApi(this.lastEvaluatedKey)
          .then(data => {
            this.employees = data.items
            this.totalEmployees = data.total
          })
      },
      deep: true,
    },
  },
  mounted () {
    this.getDataFromApi()
      .then(data => {
        this.employees = data.items
        this.totalEmployees = data.total
      })
  },
  methods: {
    getDataFromApi () {
      this.loading = true

      return new Promise((resolve, reject) => {
        const { sortBy, sortDesc, page, itemsPerPage } = this.options

        axios.get('/employees', {
          params: {
            limit: itemsPerPage,
            startsFrom: this.lastEvaluatedKey
          },
        })
        .catch(error => {
          console.log('Error getting employees from API: ', error)
        })
        .then(res => {
          let items = res.data.results
          this.lastEvaluatedKey = res.data.lastEvaluatedKey
          
          axios.get('/employees/count')
          .catch(error => {
            console.log('Error counting employees from API: ', error)
          })
          .then(res => {
            const total = res.data.totalItemsCount

            if (itemsPerPage > 0) {
              items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
            }

            setTimeout(() => {
              this.loading = false
              resolve({
                items,
                total,
              })
            }, 1000)
          })
        })
      })
    },
  },
};
</script>
