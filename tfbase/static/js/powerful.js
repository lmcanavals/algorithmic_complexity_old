(async function() {
	console.log("Toda la alegría del mundo.");

	// Data

	const urldptos = "data/d.json";
	const urlpath  = "peru1"
	const datapath = await d3.json(urlpath);
	const dptos    = await d3.json(urldptos);

	// config

	const width  = 990;
	const height = 690;

	// Canvas y elementos

	const projection = d3
		.geoOrthographic()
		.scale(2150)
		.rotate([75.0, 9.2])
		.translate([width / 2.0, height / 2.0]);

	const path = d3.geoPath().projection(projection);
	const zoom = d3.zoom().scaleExtent([1, 64]).on("zoom", zoomed);

	const l = [2, 5, 2, 9, 6, 5, 5, 3, 3, 2, 2, 2,
						 9, 2, 9, 9, 9, 2, 3, 9, 5, 5, 9, 2, 6];

	const dpto = (d) => d.properties["IDDPTO"]
	const wf = (d) => l[dpto(d) - 1];
	const cf = (d) => `hsl(${220-wf(d)*12}deg ${55+wf(d)*1.5}% ${31+wf(d)*1.5}%)`;
	const ws = (d) => l[dpto(d) - 1] - 1;
	const cs = (d) => `hsl(${220-ws(d)*12}deg ${55+ws(d)*1.5}% ${31+ws(d)*1.5}%)`;

	const svg = d3
		.select("#box")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.on("click", reset);

	const g = svg.append("g");

	const peru = g
		.append("g")
		.attr("cursor", "pointer")
		.selectAll("path")
		.data(dptos.features)
		.join("path")
		.on("click", clicked)
		.attr("d", path)
		.attr("fill", cf)
		.attr("stroke", cs);

	for (const d of datapath) {
		[d["lon"], d["lat"]] = projection([+d["lon"], +d["lat"]]);
	}
	const lon = (d) => d["lon"];
	const lat = (d) => d["lat"];
	const cp  = (d) => d["cp"];

	const lineGenerator = d3.line().x(d => lon(d)).y(d => lat(d));

	g.append("path")
		.attr("d", lineGenerator(datapath))
		.attr("fill", "none")
		.attr("stroke", "Gold")
		.attr("opacity", 0.75);

	g.selectAll("circle")
		.data(datapath)
		.enter()
		.append("circle")
		.attr("cx", lon)
		.attr("cy", lat)
		.attr("r", 0.125)
		.attr("fill", "Orange");

	svg.call(zoom);

	// Funciones y eventos
	
	d3.select("body").on("keypress", (event) => {
		if (event.keyCode == 32) reset();
	});
	function reset() {
		peru.transition().style("fill", null);
		svg
			.transition()
			.duration(750)
			.call(
				zoom.transform,
				d3.zoomIdentity,
				d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
			);
	}
	function clicked(event, d) {
		const [[x0, y0], [x1, y1]] = path.bounds(d);
		const scale = Math.max((x1 - x0) / width, (y1 - y0) / height);
		event.stopPropagation();
		peru.transition().style("fill", null);
		d3.select(this).transition().style("fill", "Sienna");
		svg
			.transition()
			.duration(1000)
			.call(
				zoom.transform,
				d3.zoomIdentity
					.translate(width / 2, height / 2)
					.scale(Math.min(64, 0.9 / scale))
					.translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
				d3.pointer(event, svg.node())
			);
	}
	function zoomed(event) {
		const { transform } = event;
		g.attr("transform", transform);
		g.attr("stroke-width", 1 / transform.k);
	}

	// Empezamos

})();

/* vim: set tabstop=2:softtabstop=2:shiftwidth=2:noexpandtab */

