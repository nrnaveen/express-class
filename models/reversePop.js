var _ = require("lodash"), MandatoryFields = ["modelArray", "storeWhere", "arrayPop", "mongooseModel", "idField"],
buildQuery = (opts) => { // Build the query string with user provided options
	var conditions = opts.filters || {};
	var ids = _.map(opts.modelArray, "_id");
	conditions[opts.idField] = { $in: ids };
	var query = opts.mongooseModel.find(conditions);
	if (opts.select) { // Set query select() parameter
		var select = getSelectString(opts.select, opts.idField);
		query = query.select(select);
	}
	if (opts.populate) query = query.populate(opts.populate);
	if (opts.sort) query = query.sort(opts.sort);
	return query;
}, getSelectString = (selectStr, requiredId) => { // Ensure the select option always includes the required id field to populate the relationship
    var selected = selectStr.split(" ");
    var idIncluded = !!~selected.indexOf(requiredId);
	if (!idIncluded) return selectStr + " " + requiredId;
	return selectStr;
}, populateResult = (storeWhere, arrayPop, match, result) => { // Populate the result against the match	
	if (arrayPop) { // If this is a one to many relationship
		// Check if array exists, if not create one
		if (typeof match[storeWhere] === "undefined") match[storeWhere] = [];
		// Push the result into the array
		match[storeWhere].push(result);
	    // This is a one to one relationship
	} else {
		match[storeWhere] = result; // Save the results
	}
}, reversePop = (opts) => {
    let promise = new Promise((resolve, reject) => {
        // Check all mandatory fields have been provided
        MandatoryFields.forEach((fieldName) => {
            if (opts[fieldName] == null) reject(`Missing mandatory field ${fieldName}`);
        });
        // If empty array passed, exit!
        if (!opts.modelArray.length){ resolve(opts.modelArray); }
        // Transform the model array for easy lookups
        var modelIndex = _.keyBy(opts.modelArray, "_id");
        var query = buildQuery(opts);
        // Do the query
        query.exec(function(err, results) {
            // If there is an error, callback with error
            if (err) reject(err);
            // Map over results (models to be populated)
            results.forEach(function(result) {
                // Check if the ID field is an array
                var isArray = !isNaN(result[opts.idField].length);
                // If the idField is an array, map through this
                if (isArray) {
                    result[opts.idField].map(function(resultId) {
                        var match = modelIndex[resultId];
                        // If match found, populate the result inside the match
                        if (match) populateResult(opts.storeWhere, opts.arrayPop, match, result);
                    });
                    // Id field is not an array
                } else {
                    // So just add the result to the model
                    var matchId = result[opts.idField];
                    var match = modelIndex[matchId];
                    // If match found, populate the result inside the match
                    if (match) populateResult(opts.storeWhere, opts.arrayPop, match, result);
                }
            });
            resolve(opts.modelArray);
        });
    });
    return promise;
}

module.exports = function(schema) {
    schema.statics.reversePop = reversePop;
};
module.exports.reversePop = reversePop;