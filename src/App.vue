
<template>
	<div>
		<div class="alert alert-danger" v-if="error">{{error}}</div>
		<b-navbar toggleable="lg" type="dark" variant="info">
			<b-navbar-brand href="">Data Browser - <b><span v-if="project">{{project.title}} - {{project.collection.title}}</span></b></b-navbar-brand>

			<b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

			<b-collapse id="nav-collapse" is-nav>


				<!-- Right aligned nav items -->
				<b-navbar-nav class="ml-auto">
					<b-navbar-nav>
						<b-nav-item @click="resetView()" href="#">Reset View</b-nav-item>
					</b-navbar-nav>
					<!--
					<b-nav-form>
						<b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
						<b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
					</b-nav-form>
				-->
				</b-navbar-nav>
			</b-collapse>
		</b-navbar>


		<b-row>
			<b-col cols="3"  class="sideBar">
				<b-container fluid>
					<DBFacet :project="project" ref="facets"/>
				</b-container>
			</b-col>

			<b-col cols="9">
				<DBDataTable :project="project"/>
			</b-col>
		</b-row>
	</div>
</template>
<script>

import DBFacet from './components/DBFacet.vue'
import DBDataTable from './components/DBDataTable.vue'
import web from './web.js'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


export default {
	name: 'App',
	components: {DBFacet, DBDataTable},
	data() {
		return {
			project: null,
			settings: null,
			error: null
		}
	},
	methods: {
		resetView() {
			this.$refs.facets.reset()
		}
	},
	mounted: function() {

	},
	created: async function () {
		const node_id = this.$route.query.node
		if(!node_id) this.error = 'Node URL parameter missing! This app must be open from node.'
		else {
			this.project = await web.getProject(node_id)
			this.$loadScript(`/api/v2/nodes/${this.project.node._id}/js/config.js`)
				.then(() => {
					console.log('config loaded')
					this.settings = window.config
					this.error = null
				})
				.catch(() => {
					console.log('config.js not found')
					this.error = 'Data browser configuration not found. You must run Data Browser node first!'
				});
		}
	}
}
console.log()
</script>
