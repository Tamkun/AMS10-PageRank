// Bad code ahead.

let width  = window.innerWidth,
	height = window.innerHeight,
	colors = d3.scale.category10();

let svg = d3.select("body").append("svg").attr("oncontextmenu", "return false;").attr("width", width).attr("height", height);
let lastNodeId = 11;
let autosave = true;
let nodes, links;
let still = false;
let messaging = false;
let lastKeyDown = -1;

let control = e => !e.event? e.ctrlKey || e.metaKey : control(e.event);

function nodeIndex(id) {
	return force.nodes().map(n => n.id == id).indexOf(true);
};

function updateNode(node) {
	return node? force.nodes().filter(n => n.id == node.id)[0] : undefined;
};

function linkIndex(link) {
	return links.map(l => l.source.id == link.source.id && l.target.id == link.target.id).indexOf(true);
};

function saveAll() {
	localStorage.nodes = JSON.stringify(force.nodes());
	localStorage.links = JSON.stringify(force.links());
};

function copy(to) {
	autosave = false;
	var obj = JSON.parse(localStorage.copies || "{}");
	let add = JSON.stringify({ nodes: force.nodes(), links: force.links(), size: force.size() });
	obj[to] = JSON.parse(add);
	localStorage.copies = JSON.stringify(obj);
	initUI();
	autosave = true;
};

function load(name) {
	autosave = false;
	force.stop();
	let saved = getCopy(name);
	
	if (saved.size) {
		force.size(saved.size);
	};

	nodes = saved.nodes;
	links = saved.links;

	for (let link of links) {
		if (typeof link.source == "number") {
			link.source = nodes.filter(n => n.id == link.source)[0];
		};

		if (typeof link.target == "number") {
			link.target = nodes.filter(n => n.id == link.target)[0];
		};
	};

	resetMouseVars();
	selected_link = selected_node = null;
	force.nodes(nodes);
	force.links(links);
	updateAllLinks();
	force.resume();
	restart();
	autosave = true;
};

function getCopy(name) {
	let out = JSON.parse(localStorage.copies || "{}")[name];
	out.str = () => JSON.stringify(out);
	return out;
};

setInterval(() => autosave && saveAll(), 100); // very sorry :|

function clearStorage() {
	delete localStorage.nodes;
	delete localStorage.links;
	delete localStorage.copies;
};

function deleteCopy(k) {
	let copies = JSON.parse(localStorage.copies || "{}");
	delete copies[k];
	localStorage.copies = JSON.stringify(copies);
	initUI();
};

if (typeof localStorage.copies == "undefined") {
	localStorage.copies = "{}";
};

{
	let copies = JSON.parse(localStorage.copies);
	if (typeof copies.Wikipedia == "undefined") {
		copies.Wikipedia = {"nodes":[{"id":1,"reflexive":false,"index":0,"weight":1,"x":1111.0610051610995,"y":440.4635216822141,"px":1110.8672306622914,"py":440.49123409765247},{"id":2,"reflexive":false,"index":1,"weight":7,"x":844.6285774893836,"y":427.0545243765054,"px":844.7587989539016,"py":427.12411022472526},{"id":3,"reflexive":false,"index":2,"weight":1,"x":796.3259283059804,"y":316.4268861342023,"px":796.4394845929368,"py":316.5870229598331},{"id":4,"reflexive":false,"index":3,"weight":3,"x":981.5551852054004,"y":456.96480975545916,"px":981.3641553271185,"py":456.9826667923623},{"id":5,"reflexive":false,"index":4,"weight":8,"x":875.4948650641663,"y":522.1124786986089,"px":875.5683220027927,"py":522.0166185733115},{"id":6,"reflexive":false,"index":5,"weight":2,"x":912.8711998304553,"y":372.6753725591706,"px":912.8764039039238,"py":372.90176307260094},{"id":7,"reflexive":false,"index":6,"weight":1,"x":837.0632037005408,"y":636.7705712780952,"px":837.1539151726329,"py":636.6008470416596},{"id":8,"reflexive":false,"index":7,"weight":1,"x":954.3109570738366,"y":625.0032920070685,"px":954.2323711044861,"py":624.8199751744478},{"id":9,"reflexive":false,"index":8,"weight":2,"x":963.1578783923982,"y":511.8227540754105,"px":963.0538756847624,"py":511.69325075771894},{"id":10,"reflexive":false,"index":9,"weight":2,"x":948.1927205592749,"y":416.0063801360197,"px":948.1133712593371,"py":416.1285261881198},{"id":11,"reflexive":false,"index":10,"weight":2,"x":761.3224283559705,"y":500.85250095580585,"px":761.5131015325877,"py":500.82173947731076}],"links":[{"source":1,"target":4,"left":true,"right":false},{"source":2,"target":4,"left":true,"right":false},{"source":2,"target":3,"left":true,"right":true},{"source":2,"target":5,"left":true,"right":false},{"source":4,"target":5,"left":true,"right":false},{"source":5,"target":6,"left":true,"right":true},{"source":2,"target":6,"left":true,"right":false},{"source":5,"target":7,"left":true,"right":false},{"source":5,"target":8,"left":true,"right":false},{"source":5,"target":10,"left":true,"right":false},{"source":2,"target":10,"left":true,"right":false},{"source":5,"target":9,"left":true,"right":false},{"source":2,"target":9,"left":true,"right":false},{"source":2,"target":11,"left":true,"right":false},{"source":5,"target":11,"left":true,"right":false}]};
	};

	if (typeof copies.Default == "undefined") {
		copies.Default = {"nodes":[{"id":1,"reflexive":false,"index":0,"weight":0,"x":960,"y":467.4787909196676,"px":960,"py":467.4785316728957}],"links":[]};
	};

	if (typeof copies.Squares == "undefined") {
		copies.Squares = {"nodes":[{"id":1,"reflexive":false,"index":0,"weight":3,"x":1175.1840152225864,"y":491.5817174634643,"px":1173.059263371113,"py":491.16954911974995},{"id":2,"reflexive":false,"x":1101.1881381318376,"y":560.0315417590733,"index":1,"weight":5,"px":1099.5461983183463,"py":558.8445343788748},{"id":3,"reflexive":false,"x":1027.666320282586,"y":632.0866824754904,"index":2,"weight":5,"px":1026.9566818779053,"py":630.5035982738075},{"id":4,"reflexive":false,"x":958.3370931427289,"y":704.6887382090775,"index":3,"weight":3,"px":958.7640382917743,"py":702.5967558943554},{"id":5,"reflexive":false,"x":889.4001435224689,"y":631.0888735758774,"index":4,"weight":5,"px":890.4684200689832,"py":629.5678474953331},{"id":6,"reflexive":false,"x":959.4346799791999,"y":561.8822613079205,"index":5,"weight":8,"px":959.3649402801626,"py":561.0686217516416},{"id":7,"reflexive":false,"x":1032.080347844814,"y":489.9803127362465,"index":6,"weight":8,"px":1031.2998565751325,"py":490.0086378779191},{"id":8,"reflexive":false,"x":1102.698612177978,"y":421.81870326123953,"index":7,"weight":5,"px":1101.0843878576334,"py":422.5429705250759},{"id":9,"reflexive":false,"x":1031.0139641596456,"y":347.70487526895647,"index":8,"weight":5,"px":1029.9503624904808,"py":349.2790629085507},{"id":10,"reflexive":false,"x":961.0265942936696,"y":417.7127395503022,"index":9,"weight":8,"px":961.090249448874,"py":418.5058309373471,"fixed":0},{"id":11,"reflexive":false,"x":888.0613124579271,"y":489.1527655409214,"index":10,"weight":8,"px":888.893443720986,"py":489.1097630278175,"fixed":0},{"id":12,"reflexive":false,"x":817.5456988541674,"y":556.6200082120129,"index":11,"weight":5,"px":819.0871528389558,"py":555.8189240418529},{"id":13,"reflexive":false,"x":744.7938542374169,"y":487.1425880793228,"index":12,"weight":3,"px":746.8875448207611,"py":487.59455014175927},{"id":14,"reflexive":false,"x":818.9077430423952,"y":418.34197862350845,"index":13,"weight":5,"px":820.4394073775065,"py":419.41172471378513,"fixed":0},{"id":15,"reflexive":false,"x":893.0480608470918,"y":347.5546609304495,"index":14,"weight":5,"px":893.9029403029895,"py":349.18700475485065,"fixed":0},{"id":16,"reflexive":false,"x":961.0680751077416,"y":274.09676568067516,"index":15,"weight":3,"px":960.6102944760822,"py":276.2116661817996}],"links":[{"source":{"id":1,"reflexive":false,"index":0,"weight":3,"x":1175.1840152225864,"y":491.5817174634643,"px":1173.059263371113,"py":491.16954911974995},"target":{"id":2,"reflexive":false,"x":1101.1881381318376,"y":560.0315417590733,"index":1,"weight":5,"px":1099.5461983183463,"py":558.8445343788748},"left":false,"right":true},{"source":{"id":2,"reflexive":false,"x":1101.1881381318376,"y":560.0315417590733,"index":1,"weight":5,"px":1099.5461983183463,"py":558.8445343788748},"target":{"id":3,"reflexive":false,"x":1027.666320282586,"y":632.0866824754904,"index":2,"weight":5,"px":1026.9566818779053,"py":630.5035982738075},"left":false,"right":true},{"source":{"id":3,"reflexive":false,"x":1027.666320282586,"y":632.0866824754904,"index":2,"weight":5,"px":1026.9566818779053,"py":630.5035982738075},"target":{"id":4,"reflexive":false,"x":958.3370931427289,"y":704.6887382090775,"index":3,"weight":3,"px":958.7640382917743,"py":702.5967558943554},"left":false,"right":true},{"source":{"id":4,"reflexive":false,"x":958.3370931427289,"y":704.6887382090775,"index":3,"weight":3,"px":958.7640382917743,"py":702.5967558943554},"target":{"id":5,"reflexive":false,"x":889.4001435224689,"y":631.0888735758774,"index":4,"weight":5,"px":890.4684200689832,"py":629.5678474953331},"left":false,"right":true},{"source":{"id":5,"reflexive":false,"x":889.4001435224689,"y":631.0888735758774,"index":4,"weight":5,"px":890.4684200689832,"py":629.5678474953331},"target":{"id":6,"reflexive":false,"x":959.4346799791999,"y":561.8822613079205,"index":5,"weight":8,"px":959.3649402801626,"py":561.0686217516416},"left":false,"right":true},{"source":{"id":3,"reflexive":false,"x":1027.666320282586,"y":632.0866824754904,"index":2,"weight":5,"px":1026.9566818779053,"py":630.5035982738075},"target":{"id":6,"reflexive":false,"x":959.4346799791999,"y":561.8822613079205,"index":5,"weight":8,"px":959.3649402801626,"py":561.0686217516416},"left":false,"right":true},{"source":{"id":6,"reflexive":false,"x":959.4346799791999,"y":561.8822613079205,"index":5,"weight":8,"px":959.3649402801626,"py":561.0686217516416},"target":{"id":7,"reflexive":false,"x":1032.080347844814,"y":489.9803127362465,"index":6,"weight":8,"px":1031.2998565751325,"py":490.0086378779191},"left":false,"right":true},{"source":{"id":2,"reflexive":false,"x":1101.1881381318376,"y":560.0315417590733,"index":1,"weight":5,"px":1099.5461983183463,"py":558.8445343788748},"target":{"id":7,"reflexive":false,"x":1032.080347844814,"y":489.9803127362465,"index":6,"weight":8,"px":1031.2998565751325,"py":490.0086378779191},"left":false,"right":true},{"source":{"id":7,"reflexive":false,"x":1032.080347844814,"y":489.9803127362465,"index":6,"weight":8,"px":1031.2998565751325,"py":490.0086378779191},"target":{"id":8,"reflexive":false,"x":1102.698612177978,"y":421.81870326123953,"index":7,"weight":5,"px":1101.0843878576334,"py":422.5429705250759},"left":false,"right":true},{"source":{"id":1,"reflexive":false,"index":0,"weight":3,"x":1175.1840152225864,"y":491.5817174634643,"px":1173.059263371113,"py":491.16954911974995},"target":{"id":8,"reflexive":false,"x":1102.698612177978,"y":421.81870326123953,"index":7,"weight":5,"px":1101.0843878576334,"py":422.5429705250759},"left":false,"right":true},{"source":{"id":8,"reflexive":false,"x":1102.698612177978,"y":421.81870326123953,"index":7,"weight":5,"px":1101.0843878576334,"py":422.5429705250759},"target":{"id":9,"reflexive":false,"x":1031.0139641596456,"y":347.70487526895647,"index":8,"weight":5,"px":1029.9503624904808,"py":349.2790629085507},"left":false,"right":true},{"source":{"id":9,"reflexive":false,"x":1031.0139641596456,"y":347.70487526895647,"index":8,"weight":5,"px":1029.9503624904808,"py":349.2790629085507},"target":{"id":10,"reflexive":false,"x":961.0265942936696,"y":417.7127395503022,"index":9,"weight":8,"px":961.090249448874,"py":418.5058309373471,"fixed":0},"left":false,"right":true},{"source":{"id":7,"reflexive":false,"x":1032.080347844814,"y":489.9803127362465,"index":6,"weight":8,"px":1031.2998565751325,"py":490.0086378779191},"target":{"id":10,"reflexive":false,"x":961.0265942936696,"y":417.7127395503022,"index":9,"weight":8,"px":961.090249448874,"py":418.5058309373471,"fixed":0},"left":false,"right":true},{"source":{"id":10,"reflexive":false,"x":961.0265942936696,"y":417.7127395503022,"index":9,"weight":8,"px":961.090249448874,"py":418.5058309373471,"fixed":0},"target":{"id":11,"reflexive":false,"x":888.0613124579271,"y":489.1527655409214,"index":10,"weight":8,"px":888.893443720986,"py":489.1097630278175,"fixed":0},"left":false,"right":true},{"source":{"id":6,"reflexive":false,"x":959.4346799791999,"y":561.8822613079205,"index":5,"weight":8,"px":959.3649402801626,"py":561.0686217516416},"target":{"id":11,"reflexive":false,"x":888.0613124579271,"y":489.1527655409214,"index":10,"weight":8,"px":888.893443720986,"py":489.1097630278175,"fixed":0},"left":false,"right":true},{"source":{"id":11,"reflexive":false,"x":888.0613124579271,"y":489.1527655409214,"index":10,"weight":8,"px":888.893443720986,"py":489.1097630278175,"fixed":0},"target":{"id":12,"reflexive":false,"x":817.5456988541674,"y":556.6200082120129,"index":11,"weight":5,"px":819.0871528389558,"py":555.8189240418529},"left":false,"right":true},{"source":{"id":5,"reflexive":false,"x":889.4001435224689,"y":631.0888735758774,"index":4,"weight":5,"px":890.4684200689832,"py":629.5678474953331},"target":{"id":12,"reflexive":false,"x":817.5456988541674,"y":556.6200082120129,"index":11,"weight":5,"px":819.0871528389558,"py":555.8189240418529},"left":false,"right":true},{"source":{"id":12,"reflexive":false,"x":817.5456988541674,"y":556.6200082120129,"index":11,"weight":5,"px":819.0871528389558,"py":555.8189240418529},"target":{"id":13,"reflexive":false,"x":744.7938542374169,"y":487.1425880793228,"index":12,"weight":3,"px":746.8875448207611,"py":487.59455014175927},"left":false,"right":true},{"source":{"id":13,"reflexive":false,"x":744.7938542374169,"y":487.1425880793228,"index":12,"weight":3,"px":746.8875448207611,"py":487.59455014175927},"target":{"id":14,"reflexive":false,"x":818.9077430423952,"y":418.34197862350845,"index":13,"weight":5,"px":820.4394073775065,"py":419.41172471378513,"fixed":0},"left":false,"right":true},{"source":{"id":14,"reflexive":false,"x":818.9077430423952,"y":418.34197862350845,"index":13,"weight":5,"px":820.4394073775065,"py":419.41172471378513,"fixed":0},"target":{"id":15,"reflexive":false,"x":893.0480608470918,"y":347.5546609304495,"index":14,"weight":5,"px":893.9029403029895,"py":349.18700475485065,"fixed":0},"left":false,"right":true},{"source":{"id":15,"reflexive":false,"x":893.0480608470918,"y":347.5546609304495,"index":14,"weight":5,"px":893.9029403029895,"py":349.18700475485065,"fixed":0},"target":{"id":16,"reflexive":false,"x":961.0680751077416,"y":274.09676568067516,"index":15,"weight":3,"px":960.6102944760822,"py":276.2116661817996},"left":false,"right":true},{"source":{"id":9,"reflexive":false,"x":1031.0139641596456,"y":347.70487526895647,"index":8,"weight":5,"px":1029.9503624904808,"py":349.2790629085507},"target":{"id":16,"reflexive":false,"x":961.0680751077416,"y":274.09676568067516,"index":15,"weight":3,"px":960.6102944760822,"py":276.2116661817996},"left":true,"right":false},{"source":{"id":10,"reflexive":false,"x":961.0265942936696,"y":417.7127395503022,"index":9,"weight":8,"px":961.090249448874,"py":418.5058309373471,"fixed":0},"target":{"id":15,"reflexive":false,"x":893.0480608470918,"y":347.5546609304495,"index":14,"weight":5,"px":893.9029403029895,"py":349.18700475485065,"fixed":0},"left":false,"right":true},{"source":{"id":11,"reflexive":false,"x":888.0613124579271,"y":489.1527655409214,"index":10,"weight":8,"px":888.893443720986,"py":489.1097630278175,"fixed":0},"target":{"id":14,"reflexive":false,"x":818.9077430423952,"y":418.34197862350845,"index":13,"weight":5,"px":820.4394073775065,"py":419.41172471378513,"fixed":0},"left":false,"right":true},{"source":{"id":10,"reflexive":false,"x":961.0265942936696,"y":417.7127395503022,"index":9,"weight":8,"px":961.090249448874,"py":418.5058309373471,"fixed":0},"target":{"id":16,"reflexive":false,"x":961.0680751077416,"y":274.09676568067516,"index":15,"weight":3,"px":960.6102944760822,"py":276.2116661817996},"left":false,"right":true},{"source":{"id":9,"reflexive":false,"x":1031.0139641596456,"y":347.70487526895647,"index":8,"weight":5,"px":1029.9503624904808,"py":349.2790629085507},"target":{"id":15,"reflexive":false,"x":893.0480608470918,"y":347.5546609304495,"index":14,"weight":5,"px":893.9029403029895,"py":349.18700475485065,"fixed":0},"left":false,"right":true},{"source":{"id":11,"reflexive":false,"x":888.0613124579271,"y":489.1527655409214,"index":10,"weight":8,"px":888.893443720986,"py":489.1097630278175,"fixed":0},"target":{"id":15,"reflexive":false,"x":893.0480608470918,"y":347.5546609304495,"index":14,"weight":5,"px":893.9029403029895,"py":349.18700475485065,"fixed":0},"left":false,"right":true},{"source":{"id":10,"reflexive":false,"x":961.0265942936696,"y":417.7127395503022,"index":9,"weight":8,"px":961.090249448874,"py":418.5058309373471,"fixed":0},"target":{"id":14,"reflexive":false,"x":818.9077430423952,"y":418.34197862350845,"index":13,"weight":5,"px":820.4394073775065,"py":419.41172471378513,"fixed":0},"left":false,"right":true},{"source":{"id":12,"reflexive":false,"x":817.5456988541674,"y":556.6200082120129,"index":11,"weight":5,"px":819.0871528389558,"py":555.8189240418529},"target":{"id":14,"reflexive":false,"x":818.9077430423952,"y":418.34197862350845,"index":13,"weight":5,"px":820.4394073775065,"py":419.41172471378513,"fixed":0},"left":false,"right":true},{"source":{"id":11,"reflexive":false,"x":888.0613124579271,"y":489.1527655409214,"index":10,"weight":8,"px":888.893443720986,"py":489.1097630278175,"fixed":0},"target":{"id":13,"reflexive":false,"x":744.7938542374169,"y":487.1425880793228,"index":12,"weight":3,"px":746.8875448207611,"py":487.59455014175927},"left":false,"right":true},{"source":{"id":6,"reflexive":false,"x":959.4346799791999,"y":561.8822613079205,"index":5,"weight":8,"px":959.3649402801626,"py":561.0686217516416},"target":{"id":10,"reflexive":false,"x":961.0265942936696,"y":417.7127395503022,"index":9,"weight":8,"px":961.090249448874,"py":418.5058309373471,"fixed":0},"left":false,"right":true},{"source":{"id":7,"reflexive":false,"x":1032.080347844814,"y":489.9803127362465,"index":6,"weight":8,"px":1031.2998565751325,"py":490.0086378779191},"target":{"id":11,"reflexive":false,"x":888.0613124579271,"y":489.1527655409214,"index":10,"weight":8,"px":888.893443720986,"py":489.1097630278175,"fixed":0},"left":false,"right":true},{"source":{"id":6,"reflexive":false,"x":959.4346799791999,"y":561.8822613079205,"index":5,"weight":8,"px":959.3649402801626,"py":561.0686217516416},"target":{"id":12,"reflexive":false,"x":817.5456988541674,"y":556.6200082120129,"index":11,"weight":5,"px":819.0871528389558,"py":555.8189240418529},"left":false,"right":true},{"source":{"id":5,"reflexive":false,"x":889.4001435224689,"y":631.0888735758774,"index":4,"weight":5,"px":890.4684200689832,"py":629.5678474953331},"target":{"id":11,"reflexive":false,"x":888.0613124579271,"y":489.1527655409214,"index":10,"weight":8,"px":888.893443720986,"py":489.1097630278175,"fixed":0},"left":false,"right":true},{"source":{"id":4,"reflexive":false,"x":958.3370931427289,"y":704.6887382090775,"index":3,"weight":3,"px":958.7640382917743,"py":702.5967558943554},"target":{"id":6,"reflexive":false,"x":959.4346799791999,"y":561.8822613079205,"index":5,"weight":8,"px":959.3649402801626,"py":561.0686217516416},"left":false,"right":true},{"source":{"id":3,"reflexive":false,"x":1027.666320282586,"y":632.0866824754904,"index":2,"weight":5,"px":1026.9566818779053,"py":630.5035982738075},"target":{"id":5,"reflexive":false,"x":889.4001435224689,"y":631.0888735758774,"index":4,"weight":5,"px":890.4684200689832,"py":629.5678474953331},"left":false,"right":true},{"source":{"id":3,"reflexive":false,"x":1027.666320282586,"y":632.0866824754904,"index":2,"weight":5,"px":1026.9566818779053,"py":630.5035982738075},"target":{"id":7,"reflexive":false,"x":1032.080347844814,"y":489.9803127362465,"index":6,"weight":8,"px":1031.2998565751325,"py":490.0086378779191},"left":false,"right":true},{"source":{"id":2,"reflexive":false,"x":1101.1881381318376,"y":560.0315417590733,"index":1,"weight":5,"px":1099.5461983183463,"py":558.8445343788748},"target":{"id":6,"reflexive":false,"x":959.4346799791999,"y":561.8822613079205,"index":5,"weight":8,"px":959.3649402801626,"py":561.0686217516416},"left":false,"right":true},{"source":{"id":1,"reflexive":false,"index":0,"weight":3,"x":1175.1840152225864,"y":491.5817174634643,"px":1173.059263371113,"py":491.16954911974995},"target":{"id":7,"reflexive":false,"x":1032.080347844814,"y":489.9803127362465,"index":6,"weight":8,"px":1031.2998565751325,"py":490.0086378779191},"left":false,"right":true},{"source":{"id":2,"reflexive":false,"x":1101.1881381318376,"y":560.0315417590733,"index":1,"weight":5,"px":1099.5461983183463,"py":558.8445343788748},"target":{"id":8,"reflexive":false,"x":1102.698612177978,"y":421.81870326123953,"index":7,"weight":5,"px":1101.0843878576334,"py":422.5429705250759},"left":false,"right":true},{"source":{"id":8,"reflexive":false,"x":1102.698612177978,"y":421.81870326123953,"index":7,"weight":5,"px":1101.0843878576334,"py":422.5429705250759},"target":{"id":10,"reflexive":false,"x":961.0265942936696,"y":417.7127395503022,"index":9,"weight":8,"px":961.090249448874,"py":418.5058309373471,"fixed":0},"left":false,"right":true},{"source":{"id":7,"reflexive":false,"x":1032.080347844814,"y":489.9803127362465,"index":6,"weight":8,"px":1031.2998565751325,"py":490.0086378779191},"target":{"id":9,"reflexive":false,"x":1031.0139641596456,"y":347.70487526895647,"index":8,"weight":5,"px":1029.9503624904808,"py":349.2790629085507},"left":false,"right":true}]};
	};

	localStorage.copies = JSON.stringify(copies);
};

function updateAllLinks() {
	for (let link of force.links()) {
		link.source = updateNode(link.source);
		link.target = updateNode(link.target);
	};
};

if (localStorage.nodes) {
	nodes = JSON.parse(localStorage.nodes);
	let l = JSON.parse(localStorage.links);
	for (let link of l) {
		if (typeof link.source.id == "undefined") {
			link.source = nodes.filter(n => n.id == link.source)[0];
		};

		if (typeof link.target.id == "undefined") {
			link.target = nodes.filter(n => n.id == link.target)[0];
		};
	};

	links = l;
} else {
	nodes = [{id: 1, reflexive: false}];
	links = [];
};

function nextNode() {
	if (force.nodes().length == 0) {
		return 1;
	};

	let max = force.nodes().reduce((a, b) => a < b.id? b.id : a, force.nodes()[0].id)
	for (let i = 1; i < max; i++) {
		if (force.nodes().filter(n => n.id == i).length == 0) {
			return i;
		};
	};

	return max + 1;
};

let force = d3.layout.force().nodes(nodes).links(links).size([width, height]).linkDistance(100).charge(-1000).on("tick", tick)
updateAllLinks();

svg.append("svg:defs").append("svg:marker").attr("id", "end-arrow").attr("viewBox", "0 -5 10 10").attr("refX", 6).attr("markerWidth", 3)
   .attr("markerHeight", 3).attr("orient", "auto").append("svg:path").attr("d", "M0,-5L10,0L0,5").attr("fill", "#000");

svg.append("svg:defs").append("svg:marker").attr("id", "start-arrow").attr("viewBox", "0 -5 10 10").attr("refX", 4).attr("markerWidth", 3)
   .attr("markerHeight", 3).attr("orient", "auto").append("svg:path").attr("d", "M10,-5L0,0L10,5").attr("fill", "#000");

let drag_line = svg.append("svg:path").attr("class", "link dragline hidden").attr("d", "M0,0L0,0"),
	path = svg.append("svg:g").selectAll("path"),
	circle = svg.append("svg:g").selectAll("g");

let selected_node = selected_link = mousedown_link = mousedown_node = mouseup_node = null;

function resetMouseVars() {
	mousedown_node = mouseup_node = mousedown_link = null;
};

function tick() {
	if (still) return;

	path.attr("d", d => {
		let deltaX = d.target.x - d.source.x,
			deltaY = d.target.y - d.source.y,
			dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
			normX = deltaX / dist,
			normY = deltaY / dist,
			sourcePadding = d.left? 17 : 12,
			targetPadding = d.right? 17 : 12,
			sourceX = d.source.x + (sourcePadding * normX),
			sourceY = d.source.y + (sourcePadding * normY),
			targetX = d.target.x - (targetPadding * normX),
			targetY = d.target.y - (targetPadding * normY);
		return "M" + sourceX + "," + sourceY + "L" + targetX + "," + targetY;
	});

	circle.attr("transform", d => "translate(" + d.x + "," + d.y + ")");
};

function restart() {
	path = path.data(links);
	path.classed("selected", d => d == selected_link).style("marker-start", d => d.left? "url(#start-arrow)" : "").style("marker-end", d => d.right? "url(#end-arrow)" : "");
	path.enter().append("svg:path").attr("class", "link").classed("selected", d => d == selected_link).style("marker-start", d => d.left? "url(#start-arrow)" : "").style("marker-end", d => d.right? "url(#end-arrow)" : "").on("mousedown", d => {
		if (control(d3)) return;

		mousedown_link = d;
		if (d3.event.altKey) {
			console.log(mousedown_link);
			links.splice(linkIndex(mousedown_link), 1);
			selected_link = null;
			restart();
		} else if (mousedown_link == selected_link) {
			selected_link = null;
		} else {
			selected_link = mousedown_link;
		};

		selected_node = null;
		restart();
	});

	path.exit().remove();
	circle = circle.data(force.nodes(), d => d.id);
	circle.selectAll("circle").style("fill", d => d == selected_node? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id)).classed("reflexive", d => d.reflexive);
	let g = circle.enter().append("svg:g");
	g.append("svg:circle").attr("class", "node").attr("r", 12).style("fill",d => d == selected_node? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id)).style("stroke", d => d3.rgb(colors(d.id)).darker().toString()).classed("reflexive", d => d.reflexive).on("mouseover", function(d) {
		if (mousedown_node && d.id != mousedown_node.id) {
			d3.select(this).attr("transform", "scale(1.1)");
		};
	}).on("mouseout", function(d) {
		if (mousedown_node && d.id != mousedown_node.id) {
			d3.select(this).attr("transform", "");
		};
	}).on("mousedown", d => {
		if (control(d3)) return;

		mousedown_node = d;
		selected_node = mousedown_node == selected_node? null : mousedown_node;
		selected_link = null;
		drag_line.style("marker-end", "url(#end-arrow)").classed("hidden", false).attr("d", `M${mousedown_node.x},${mousedown_node.y}L${mousedown_node.x},${mousedown_node.y}`);
		restart();
	}).on("mouseup", function(d) {
		if (d3.event.altKey) {
			force.nodes().splice(nodeIndex(d.id), 1);
			spliceLinksForNode(d);
			selected_link = selected_node = null;
			return restart();
		};

		if (!mousedown_node) return;

		drag_line.classed("hidden", true).style("marker-end", "");
		mouseup_node = d;

		if (mouseup_node.id == mousedown_node.id) {
			return resetMouseVars()
		};

		d3.select(this).attr("transform", "");
		var source, target, direction;
		if (mousedown_node.id < mouseup_node.id) {
			source = mousedown_node;
			target = mouseup_node;
			direction = "right";
		} else {
			source = mouseup_node;
			target = mousedown_node;
			direction = "left";
		};

		let link = links.filter(l => l.source.id == source.id && l.target.id == target.id)[0];
		if (link) {
			link[direction] = true;
		} else {
			link = {source, target, left: false, right: false};
			link[direction] = true;
			links.push(link);
		};

		selected_link = link;
		selected_node = null;
		restart();
	});

	g.append("svg:text").attr("x", 0).attr("y", 4).attr("class", "id").text(function(d) { return d.id; });
	circle.exit().remove();
	force.start();
};

function mousedown() {
	d3.event.preventDefault();
	svg.classed("active", true);

	if (control(d3) || mousedown_node || mousedown_link) return;

	if (d3.event.shiftKey) {
		let point = d3.mouse(this);
		force.nodes().push({id: nextNode(), reflexive: false, x: point[0], y: point[1]});
	};

	selected_link = selected_node = null;
	restart();
};

function mousemove() {
	if (!mousedown_node) return;
	drag_line.attr("d", `M${mousedown_node.x},${mousedown_node.y}L${d3.mouse(this)[0]},${d3.mouse(this)[1]}`);
	restart();
};

function mouseup() {
	if (mousedown_node) {
		drag_line.classed("hidden", true).style("marker-end", "");
	};

	svg.classed("active", false);
	resetMouseVars();
};

function spliceLinksForNode(node) {
	links.filter(l => l.source.id == node.id || l.target.id == node.id).map(l => links.splice(linkIndex(l), 1));
};

function keydown() {
	if (lastKeyDown !== -1) return;

	lastKeyDown = d3.event.keyCode;

	if (d3.event.keyCode == 17) { // ctrl
		circle.call(force.drag);
		svg.classed("ctrl", true);
	};

	if (d3.event.keyCode == 88) { // X
		load("Default");
	};

	if (d3.event.keyCode == 68) { // D
		load("Wikipedia");
	};

	if (d3.event.keyCode == 83) { // S
		let cname = prompt("Preset name:");
		if (cname && cname != "default") {
			copy(cname);
		};
	};

	if (d3.event.keyCode == 80) { // P
		still = !still;
		if (still) {
			force.stop();
		} else {
			force.resume();
		};
	};

	if (!selected_node && !selected_link) {
		return;
	};

	switch(d3.event.keyCode) {
		case 8: // backspace
		case 46: // delete
			d3.event.preventDefault();
			if (selected_node) {
				force.nodes().splice(nodeIndex(selected_node.id), 1);
				spliceLinksForNode(selected_node);
			} else if (selected_link) {
				links.splice(linkIndex(selected_link), 1);
			};

			selected_link = selected_node = null;
			restart();
			break;
		case 66: // B
			if (selected_link) {
				selected_link.left = selected_link.right = true;
			};

			restart();
			break;
		case 76: // L
			if (selected_link) {
				selected_link.left = !(selected_link.right = false);
			};

			restart();
			break;
		case 82: // R
			if (selected_link) {
				selected_link.right = !(selected_link.left = false);
			};

			restart();
			break;
		case 84:  // T
			if (selected_node) {
				selected_node.reflexive = !selected_node.reflexive;
			} else if (selected_link) {
				if (selected_link.left && selected_link.right) {
					selected_link.left = true;
					selected_link.right = false;
				} else if (selected_link.left) {
					selected_link.left = false;
					selected_link.right = true;
				} else {
					selected_link.left = true;
				};
			};

			restart();
			break;
	};
};

function keyup() {
	lastKeyDown = -1;
	if (d3.event.keyCode == 17) { // ctrl
		circle.on("mousedown.drag", null).on("touchstart.drag", null);
		svg.classed("ctrl", false);
	};
};

document.addEventListener("copy", e => {
	event.preventDefault();

	if (force.nodes().length == 0)
		return;

	force.nodes().sort((x, y) => x.id > y.id? 1 : (x.id == y.id? 0 : -1));

	let	pages = {}, idMap = {}, i = 0, size = force.nodes().length, data = new Array(size);

	for (node of force.nodes()) {
		data[i] = new Float64Array(size);
		idMap[node.id] = i;
		pages[i] = [];
		if (node.reflexive)
			pages[i].push(i);

		i++;
	};

	for (link of links) {
		let {source, target, left, right} = link;
		if (left)
			pages[idMap[target.id]].push(idMap[source.id]);

		if (right)
			pages[idMap[source.id]].push(idMap[target.id]);
	};

	for (let row = 0; row < size; row++)
		for (let col = 0; col < size; col++)
			if (pages[col].length)
				data[row][col] = pages[col].reduce((a, b) => a + (b == row), 0) / pages[col].length;

	let frac = function(n) {
		for (let i = 2; i <= 10; i++)
			if (n == 1/i)
				return `\\frac{1}{${i}}`;
		return n.toString();
	};

	let text;
	let type = $("#code").val();
	
	if (type == "latex") {
		text = "\\begin{bmatrix}" + data.map(x => Array.from(x).map(frac).join("&")).join("\\\\") + "\\end{bmatrix}";
	} else if (type == "nofrac") {
		text = "\\begin{bmatrix}" + data.map(x => x.map(y => Math.floor(y * 1000) / 1000).join("&")).join("\\\\") + "\\end{bmatrix}";
	} else {
		text = "[" + data.map(x => x.join(" ")).join(";") + "]";
	};

	e.clipboardData.setData("text/plain", text);
	notify("Text copied.");
});

svg.on("mousedown", mousedown).on("mousemove", mousemove).on("mouseup", mouseup);
d3.select(window).on("keydown", keydown).on("keyup", keyup);
restart();

function initUI() {
	$("#presets option:not([disabled])").remove();
	let select = $("#presets").off("change"), obj = JSON.parse(localStorage.copies || "{}");
	$.each(obj, (k, v) => {
		$("<option></option>").appendTo(select).text(k).attr({value: k});
	});

	select.on("change", x => {
		console.log(select.val());
		load(select.val());
	});
};

function notify(msg) {
	if (messaging) return;

	messaging = true;
	$("#notify").text(msg).show();
	setTimeout(() => $("#notify").text("").hide(void(messaging = false)), 2000);
};

$(function() {
	initUI();
	$("#code").on("change", () => localStorage.codeType = $("#code").val())
	$("article").css("opacity", 1);
});
