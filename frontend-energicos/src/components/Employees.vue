<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
      <v-flex xs12>
        <h1 align="left">Employees Report</h1>
        
        <v-divider></v-divider><br/>
        
        <v-data-table
          :headers="headers"
          :items="employees"
          :options.sync="options"
          :server-items-length="totalEmployees"
          :loading="loading"
          class="elevation-1"
        ></v-data-table>
        
        <v-footer>
          <div class="flex-grow-1"></div>
          <div>&copy; Lucas Andrey Bleme {{ new Date().getFullYear() }}</div>
        </v-footer>
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
      lastPage: 1,
      pageAndFirstItemKeys: new Map(),
      headers: [
        { text: 'Id', align: 'left', sortable: false, value: 'id' },
        { text: 'Name', sortable: false, value: 'name' },
        { text: 'Department', sortable: false, value: 'department' },
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
        
        if (page < this.lastPage) {
          this.lastEvaluatedKey = this.pageAndFirstItemKeys.get(page)
        }
        this.lastPage = page
        
        axios.get('/employees/count')
          .catch(error => {
            console.log('Error getting employees count from API: ', error)
          })
          .then(res => {
            const total = res.data.totalItemsCount
            console.log('Total --> ', total)

            axios.get('/employees', {
              params: {
                limit: (itemsPerPage == -1) ? total : itemsPerPage,
                startsFrom: (page !== 1) ? this.lastEvaluatedKey : ''
              },
            })
              .catch(error => {
                console.log('Error getting employees from API: ', error)
              })
              .then(res => {
                let items = res.data.results
                console.log('Items --> ', items)
                this.lastEvaluatedKey = res.data.lastEvaluatedKey
                this.pageAndFirstItemKeys.set(page, items[0].id)
                
                setTimeout(() => {
                  this.loading = false
                  resolve({ items, total })
                }, 1000)
              })
          })
      })
    },
  },
};
</script>
