$(document).ready(function () {
	var cfg = {
		sizeMode: 1,
		audios: [],
		autoEvaluate: true,
		platform: "SM",
		navigationBar: { x: 393, y: 552 },
		items:
		[
			{
				engine: "sm.SeriesEngine",
				cfg:
				{
					enunciado: cadenas.Enunc,
					SeriesEngine: { gameType: "arrastrar"},
					backgroundImage: { id:"dioxido_fondo", x: -6, y: 39},
					audioOK: audios.ok,
					audioKO: audios.ko,
					audioClic: audios.sinAudio,
					audioFinal: audios.sinAudio,
					hotAreas: [
						{
							name: "hotArea0",
							points: [ { x: 35, y: 384}, { x: 441, y: 380}, { x: 440, y: 556}, { x: 28, y: 567}, ],
							hotAreaVisible: false,
							multidrop: false,
						},
					],

					successes: 1,
					imageObjects: [{ x: 169, y: 207, id: "dioxido", hotAreas: [{hotArea: "hotArea0", dropZones: [{x: 48, y: 472},]}], clonable: false, initScale: 1, dragScale: 0.7, dropScale: 0.3  }, ],
					buttonEnd: {x:400, y:400, width:100, textId:cadenas.empty },
					buttonRepeat: {x:870, y:553, width:85, textId:cadenas.Rep },
				},
			},
			{
				engine: "sm.SeriesEngine",
				cfg:
				{
					enunciado: cadenas.Enunc,
					SeriesEngine: { gameType: "arrastrar"},
					backgroundImage: { id:"sal_fondo", x: -6, y: 35},
					audioOK: audios.ok,
					audioKO: audios.ko,
					audioClic: audios.sinAudio,
					audioFinal: audios.sinAudio,
					hotAreas: [
						{
							name: "hotArea0",
							points: [ { x: 27, y: 369}, { x: 471, y: 369}, { x: 456, y: 545}, { x: 26, y: 555}, ],
							hotAreaVisible: false,
							multidrop: false,
						},
					],

					successes: 1,
					imageObjects: [{ x: 193, y: 212, id: "micro_sal", hotAreas: [{hotArea: "hotArea0", dropZones: [{x: 127, y: 385},]}], clonable: false, initScale: 1, dragScale: 0.7, dropScale: 0.3  }, ],
					buttonEnd: {x:400, y:400, width:100, textId:cadenas.empty },
					buttonRepeat: {x:870, y:549, width:85, textId:cadenas.Rep },
				},
			},
			{
				engine: "sm.SeriesEngine",
				cfg:
				{
					enunciado: cadenas.Enunc,
					SeriesEngine: { gameType: "arrastrar"},
					backgroundImage: { id:"cobre_fondo", x: -2, y: 38},
					audioOK: audios.ok,
					audioKO: audios.ko,
					audioClic: audios.sinAudio,
					audioFinal: audios.sinAudio,
					hotAreas: [
						{
							name: "hotArea0",
							points: [ { x: 33, y: 363}, { x: 456, y: 366}, { x: 457, y: 546}, { x: 28, y: 550}, ],
							hotAreaVisible: false,
							multidrop: false,
						},
					],

					successes: 1,
					imageObjects: [{ x: 183, y: 208, id: "micro_cobre", hotAreas: [{hotArea: "hotArea0", dropZones: [{x: 182, y: 457},]}], clonable: false, initScale: 1, dragScale: 0.7, dropScale: 0.3  }, ],
					buttonEnd: {x:400, y:400, width:100, textId:cadenas.empty },
					buttonRepeat: {x:867, y:547, width:85, textId:cadenas.Rep },
				},
			},
			{
				engine: "sm.SeriesEngine",
				cfg:
				{
					enunciado: cadenas.Enunc,
					SeriesEngine: { gameType: "arrastrar"},
					backgroundImage: { id:"aire_fondo", x: 3, y: 34},
					audioOK: audios.ok,
					audioKO: audios.ko,
					audioClic: audios.sinAudio,
					audioFinal: audios.sinAudio,
					hotAreas: [
						{
							name: "hotArea0",
							points: [ { x: 519, y: 366}, { x: 927, y: 369}, { x: 932, y: 545}, { x: 517, y: 548}, ],
							hotAreaVisible: false,
							multidrop: false,
						},
					],

					successes: 1,
					imageObjects: [{ x: 233, y: 218, id: "aire", hotAreas: [{hotArea: "hotArea0", dropZones: [{x: 522, y: 454},]}], clonable: false, initScale: 1, dragScale: 0.7, dropScale: 0.3  }, ],
					buttonEnd: {x:400, y:400, width:100, textId:cadenas.empty },
					buttonRepeat: {x:865, y:553, width:85, textId:cadenas.Rep },
				},
			},
			{
				engine: "sm.SeriesEngine",
				cfg:
				{
					enunciado: cadenas.Enunc,
					SeriesEngine: { gameType: "arrastrar"},
					backgroundImage: { id:"aguaazucarada_fondo", x: 0, y: 31},
					audioOK: audios.ok,
					audioKO: audios.ko,
					audioClic: audios.sinAudio,
					audioFinal: audios.sinAudio,
					hotAreas: [
						{
							name: "hotArea0",
							points: [ { x: 515, y: 372}, { x: 929, y: 371}, { x: 926, y: 535}, { x: 513, y: 548}, ],
							hotAreaVisible: false,
							multidrop: false,
						},
					],

					successes: 1,
					imageObjects: [{ x: 228, y: 210, id: "agua azucarada", hotAreas: [{hotArea: "hotArea0", dropZones: [{x: 610, y: 391},]}], clonable: false, initScale: 1, dragScale: 0.7, dropScale: 0.3  }, ],
					buttonEnd: {x:400, y:400, width:100, textId:cadenas.empty },
					buttonRepeat: {x:863, y:550, width:85, textId:cadenas.Rep },
				},
			},
			{
				engine: "sm.SeriesEngine",
				cfg:
				{
					enunciado: cadenas.Enunc,
					SeriesEngine: { gameType: "arrastrar"},
					backgroundImage: { id:"aguasalada_fondo", x: 0, y: 40},
					audioOK: audios.ok,
					audioKO: audios.ko,
					audioClic: audios.sinAudio,
					audioFinal: audios.sinAudio,
					hotAreas: [
						{
							name: "hotArea0",
							points: [ { x: 495, y: 375}, { x: 925, y: 366}, { x: 925, y: 550}, { x: 485, y: 550}, ],
							hotAreaVisible: false,
							multidrop: false,
						},
					],

					successes: 1,
					imageObjects: [{ x: 238, y: 211, id: "agua salada", hotAreas: [{hotArea: "hotArea0", dropZones: [{x: 681, y: 458},]}], clonable: false, initScale: 1, dragScale: 0.7, dropScale: 0.3  }, ],
					buttonEnd: {x:400, y:400, width:100, textId:cadenas.empty },
					buttonRepeat: {x:869, y:553, width:85, textId:cadenas.Rep },
				},
			},
			{
				engine: "sm.SeriesEngine",
				cfg:
				{
					enunciado: cadenas.Enunc,
					SeriesEngine: { gameType: "arrastrar"},
					backgroundImage: { id:"agua_fondo", x: -6, y: 42},
					audioOK: audios.ok,
					audioKO: audios.ko,
					audioClic: audios.sinAudio,
					audioFinal: audios.sinAudio,
					hotAreas: [
						{
							name: "hotArea0",
							points: [ { x: 33, y: 382}, { x: 455, y: 378}, { x: 464, y: 547}, { x: 35, y: 556}, ],
							hotAreaVisible: false,
							multidrop: false,
						},
					],

					successes: 1,
					imageObjects: [{ x: 188, y: 215, id: "agua", hotAreas: [{hotArea: "hotArea0", dropZones: [{x: 237, y: 385},]}], clonable: false, initScale: 1, dragScale: 0.7, dropScale: 0.3  }, ],
					buttonEnd: {x:400, y:400, width:100, textId:cadenas.empty },
					buttonRepeat: {x:867, y:550, width:85, textId:cadenas.Rep },
				},
			},
			{
				engine: "sm.SeriesEngine",
				cfg:
				{
					enunciado: cadenas.Enunc,
					SeriesEngine: { gameType: "arrastrar"},
					backgroundImage: { id:"oxidomercurio_fondo", x: 0, y: 42},
					audioOK: audios.ok,
					audioKO: audios.ko,
					audioClic: audios.sinAudio,
					audioFinal: audios.sinAudio,
					hotAreas: [
						{
							name: "hotArea0",
							points: [ { x: 33, y: 373}, { x: 455, y: 372}, { x: 470, y: 549}, { x: 33, y: 569}, ],
							hotAreaVisible: false,
							multidrop: false,
						},
					],

					successes: 1,
					imageObjects: [{ x: 177, y: 210, id: "oxido de mercurio", hotAreas: [{hotArea: "hotArea0", dropZones: [{x: 304, y: 460},]}], clonable: false, initScale: 1, dragScale: 0.7, dropScale: 0.3  }, ],
					buttonEnd: {x:400, y:400, width:100, textId:cadenas.empty },
					buttonRepeat: {x:868, y:551, width:85, textId:cadenas.Rep },
				},
			},
			{
				engine: "sm.SeriesEngine",
				cfg:
				{
					enunciado: cadenas.Enunc,
					SeriesEngine: { gameType: "arrastrar"},
					backgroundImage: { id:"amoniaco_fondo", x: 1, y: 36},
					audioOK: audios.ok,
					audioKO: audios.ko,
					audioClic: audios.sinAudio,
					audioFinal: audios.sinAudio,
					hotAreas: [
						{
							name: "hotArea0",
							points: [ { x: 516, y: 379}, { x: 926, y: 374}, { x: 937, y: 550}, { x: 515, y: 559}, ],
							hotAreaVisible: false,
							multidrop: false,
						},
					],

					successes: 1,
					imageObjects: [{ x: 231, y: 204, id: "amoniaco", hotAreas: [{hotArea: "hotArea0", dropZones: [{x: 768, y: 392},]}], clonable: false, initScale: 1, dragScale: 0.7, dropScale: 0.3  }, ],
					buttonEnd: {x:400, y:400, width:100, textId:cadenas.empty },
					buttonRepeat: {x:866, y:551, width:85, textId:cadenas.Rep },
				},
			},
			{
				engine: "sm.HotAreaArtEngine",
				cfg:
				{
					pantallaInicio: false,
					enunciado: cadenas.Enunciado,
					hotAreaArtEngine: { gameType: "simple"},
					backgroundImage: { id:"finala-cajas", x: -4, y: 18},
					audioOK: audios.sinAudio,
					audioKO: audios.sinAudio,
					audioClic: audios.sinAudio,
					audioFinal: audios.sinAudio,
					hotAreas: [
						{
							orderId: 0,
							color: "#000000",
							opacity: 0.15,
							sound: audios.sinAudio,
							points: [ { x: 502, y: 135}, { x: 552, y: 135}, { x: 552, y: 185}, { x: 502, y: 185}, ],
							hitable: true,
							hotAreaVisible: false,
							disableOnClick: false,
							dotArea: { x: 525, y: 160, radius: 16, color: "#6859A2"},
							popup: { x: 166, y: 82, width: 300, height: 200, texts: [{ value: cadenas.Sus, x: 53, y: 61, width: 198, height: 88, font: "bold 30px SourceSansProBold", fontColor: "#000000" },], images: [], },
						},
						{
							orderId: 1,
							color: "#6859A2",
							opacity: 0.19,
							sound: audios.sinAudio,
							points: [ { x: 872, y: 387}, { x: 922, y: 387}, { x: 922, y: 437}, { x: 872, y: 437}, ],
							hitable: true,
							hotAreaVisible: false,
							disableOnClick: false,
							dotArea: { x: 898, y: 412, radius: 16, color: "#6859A2"},
							popup: { x: 528, y: 336, width: 300, height: 200, texts: [{ value: cadenas.Dis, x: 54, y: 78, width: 184, height: 39, font: "bold 30px SourceSansProBold", fontColor: "#000000" },], images: [], },
						},
					],
					buttonShowHotAreas: {x:105, y:544, width:180, textShowId:cadenas.Ar, textHideId:cadenas.empty },
					buttonRepeat: {x:862, y:548, width:85, textId:cadenas.Rep },
				},
			},
		],
	};
	var multiEngine = new sm.MultiEngine("html5Canvas", cfg, null);
	multiEngine.run();
});
