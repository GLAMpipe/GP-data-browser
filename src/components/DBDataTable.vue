<template>
	<div class="data">

		<b-table striped hover :items="data" :fields="fields"></b-table>

	</div>
</template>

<script>

import web from './../web.js'

export default {
	name: 'DBDataTable',
	props: ['project'],
	data() {
		return {
			data: [],
			fields: []
		}
	},
	watch: {
		'$parent.settings': async function() {
			this.fields = this.$parent.settings.item_table.rows
			var result = await web.getData(this.$parent.settings.collection, '')
			this.data = result.data.data
		},
		async $route() {
			console.log('table route happened')
			let result = await web.getData(this.$parent.settings.collection, web.getURLQueryParamsAsString(this.project.node._id))
			this.data = result.data.data
		}
	}
}

</script>
