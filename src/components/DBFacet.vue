<style>
.pointer {
	cursor: pointer
}
</style>

<template>
  <div class="hello">
	<b-card v-for="facet in facets" v-bind:key="facet.key" :title="facet.title">
		<b-list-group v-for="fdata in facet_data[facet.key]" :key="fdata._id">
			<b-list-group-item class="pointer" @click="updateData(facet, fdata._id)">{{fdata._id}} ({{fdata.count}})
			</b-list-group-item>
		</b-list-group>

	</b-card>


  </div>
</template>

<script>
import web from './../web.js'

export default {
	name: 'DBFacet',
	props: ['project'],
	data() {
		return {
			//facet_values: [],
			facets: [],
			filters: [],
			facet_data: {},
			facet_selections: {},
			data: []
		}
	},
	watch: {
		'$parent.settings': function() {
			console.log('config updated')
			this.parseFacets()
			this.loadFacetData()
		}
	},
	methods: {
		setFacetValues(values) {
			for(var key in values) {
				var facet = this.facets.find(f => f.key === key)
				facet.values = values
			}
		},
		setFacetSelection(facet, value) {
			if(facet.key in this.facet_selections) {
				if(this.facet_selections[facet.key].includes(value)) {
					// remove value
					this.facet_selections[facet.key] = this.facet_selections[facet.key].filter(item => item !== value)
				} else {
					this.facet_selections[facet.key].push(value)
				}
			} else {
				this.$set(this.facet_selections, facet.key, [value])
			}
		},
		async loadFacetData() {
			var facet_fields = this.facets.map(f => f.key)
			var query = web.getURLQueryParamsAsString(this.project.node._id)
			var response = await web.getFacetValues(this.$parent.settings.collection, facet_fields.join('|'), query)
			this.facet_data = response.data[0]
		},
		parseFacets() {
			this.facets = []
			if(this.$parent.settings.filters) {
				for(var f of this.$parent.settings.filters) {
					f.values = []
					if(f.mode == 'facet') {
						this.facets.push(f)
						//this.$set(this.facet_values, f.key, []) // make key reactive
					}
					if(f.mode == 'filter') this.filters.push(f)
				}
			}
			if(this.facets.length === 0) alert('No facets. Did you configure them?')
		},
		reset() {
			console.log('facet reset')
			for(var facet in this.facet_selections) {
				console.log(facet)
				this.facet_selections[facet] = []
			}
			this.$router.push({ query: {node:this.project.node._id}})
			this.loadFacetData()
		},
		async updateData(facet, facet_value) {
			this.setFacetSelection(facet, facet_value)
			var params = this.facet_selections
			params.node = this.project.node._id
			this.$router.push({ query: this.facet_selections})
			this.loadFacetData()
		}

	}
}

</script>
