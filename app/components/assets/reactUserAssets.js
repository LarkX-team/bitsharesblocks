var UserAssetHeaderRow = React.createClass({displayName: "UserAssetHeaderRow",
	render: function() {
		var props = this.props;
		var headers = this.props.headers;
		var sortIndex = this.props.sortIndex;
		var inverse = this.props.inverse;

		var headerLength=0;
		for (var key in headers) {
			if (headers.hasOwnProperty(key)) {
				headerLength++;
			}
		}

		var clickHandler = function(ev) {
			if (ev.target.cellIndex!==3 && ev.target.cellIndex!==4) {
				props.onSortClick(					
					ev.target.cellIndex	
					);
			}
		};

		return (
			React.createElement("tr", {onClick: clickHandler}, 
			React.createElement("th", {className: "bold sortable"}, headers['assets.user.th1']), 
			React.createElement("th", {className: "bold sortable"}, headers['assets.market.th1']), 
			React.createElement("th", {className: "bold sortable"}, headers['assets.market.th7']), 
			React.createElement("th", null, headers['assets.user.th4']), 
			React.createElement("th", null, headers['assets.user.th5']), 
			React.createElement("th", {className: "bold sortable"}, headers['assets.user.th6'])
			)
			);
	}
});

var UserAssetRow = React.createClass({displayName: "UserAssetRow",
	render: function() {
		var asset =this.props.data;
		var tdInit;	

		if (asset.initialized) {
			tdInit = React.createElement("td", {className: "success"}, "Yes");
		}
		else {
			tdInit = React.createElement("td", null, "No");
		}			

		return (
			React.createElement("tr", null, 
			React.createElement("td", null, asset._id), 
			React.createElement("td", null, React.createElement("a", {href: 'assets/asset?id='+asset.symbol}, asset.symbol)), 
			React.createElement("td", null, asset.dailyVolume, " BTS"), 
			React.createElement("td", null,  asset.current_share_supply), 
			React.createElement("td", null,  asset.maximum_share_supply), 
			tdInit
			)
			);
	}
});

var UserAssetsTable = React.createClass({
	getInitialState: function() {
		return {
			sortIndex: 5,
			inverse: true,
			filterName: ''
		};
	},
	handleSortClick: function(index) {
		this.setState({
			sortIndex: index,
			inverse: !this.state.inverse
		});
	},
	onFilterChange: function(filterName) {
		this.setState({
			filterName: filterName
		});
	},
	displayName: 'UserAssetsTable',
	render: function() {
		var headers = this.props.headers;
		var filterFields = ['_id','symbol','dailyVolume','','','initialized'];
		var inverse = this.state.inverse;
		if (headers && this.props.data) {			
			var data = JSON.parse(this.props.data);
			var sortIndex = this.state.sortIndex;
			var sortField = filterFields[sortIndex];
			var filterName = this.state.filterName;

			var bodyRows = data
			.filter(function(asset) {
				return (asset.symbol.toLowerCase().indexOf(filterName) > -1 && asset._id!==0);
			})
			.sort(function(a,b) {
				if (inverse===false) {
					if (a[sortField] > b[sortField]) {
						return 1;
					}
					if (a[sortField] < b[sortField]) {
						return -1;
					}
					return 0;	
				}
				else {
					if (a[sortField] > b[sortField]) {
						return -1;
					}
					if (a[sortField] < b[sortField]) {
						return 1;
					}
					return 0;	
				}

			})
			.map(function(asset) {
				return (
					React.createElement(UserAssetRow, {key: asset._id, data: asset})
					);

			});

			var styleLeft = {
				'marginLeft':'0px',
				'marginRight':'0px',
				'float':'none'
			};

			return (
				React.createElement("div", null, 
				React.createElement("div", {style: styleLeft, className: "checkbox container col-md-5 col-xs-12"}, 
				React.createElement(InputBox, {filterName: filterName, onFilterChange: this.onFilterChange, placeHolder: headers['delegates.filter']})
				), 
				React.createElement("table", {className: "table table-condensed table-hover table-bordered"}, 
				React.createElement("thead", null, 
				React.createElement(UserAssetHeaderRow, {onSortClick: this.handleSortClick, headers: headers, sortIndex: sortIndex, inverse: inverse})
				), 
				React.createElement("tbody", null, 
				bodyRows
				)
				)
				)
				);
		}
		else {
			return React.createElement("div", null);
		}
	}
});

app.value('UserAssetsTable',UserAssetsTable);