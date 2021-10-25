
import axios from "axios"
let web = {}

web.getProject = async function(node_id) {
	var node_data = await axios.get(`/api/v2/nodes/${node_id}`)
	const project_id = node_data.data.project
	var project_data = await axios.get(`/api/v2/projects/${project_id}`)
	var current_node = project_data.data.nodes.find(node => node._id === node_id)
	var current_collection = project_data.data.collections.find(col => col.name === current_node.collection)
	var out = {
		title: project_data.data.title,
		id: project_data.data._id,
		node: current_node,
		collection: current_collection
	}
	return out
}

web.getFacetValues = async function(collection, fields, query) {
	var result = await axios.get(`/api/v2/collections/${collection}/facet?fields=${fields}&${query}`)
	return result
}

web.getData = async function(collection, query) {
	var result = await axios.get(`/api/v2/collections/${collection}/docs?${query}`)
	return result
}

web.getURLQueryParamsAsString = function(node_id) {
	var url = document.URL.split('?')
	if(url.length == 2) {
		url[1] = url[1].replace(`node=${node_id}`, '')
		return url[1].replace(/\?/g, '')
	} else
		return ''
}

export default web
