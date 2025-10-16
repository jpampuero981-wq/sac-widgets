(function() {
    const template = document.createElement("template");
    template.innerHTML = `
        <style>
            :host {
                display: block;
                height: 100%;
                width: 100%;
            }
            #chart {
                height: 100%;
                width: 100%;
            }
        </style>
        <div id="chart"></div>
    `;

    class InvertedLineChart extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(template.content.cloneNode(true));
            this._chartDiv = this.shadowRoot.getElementById("chart");
            this._data = [];
            this._layout = {
                title: "Inverted Line Chart",
                yaxis: { autorange: "reversed" }, // Eje Y invertido
                xaxis: { title: "X" },
                margin: { l: 40, r: 20, t: 40, b: 40 }
            };
            this._plotlyLoaded = false;
        }

        async connectedCallback() {
            try {
                if (!this._plotlyLoaded) {
                    await this.loadPlotly();
                    this._plotlyLoaded = true;
                }
                this.renderChart();
                console.log("InvertedLineChart loaded successfully");
            } catch (e) {
                console.error("Error loading InvertedLineChart:", e);
            }
        }

        async loadPlotly() {
            if (window.Plotly) return;
            return new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.src = "https://cdn.plot.ly/plotly-latest.min.js";
                script.onload = () => resolve();
                script.onerror = () => reject(new Error("Failed to load Plotly"));
                document.head.appendChild(script);
            });
        }

        set data(value) {
            this._data = value;
            this.renderChart();
        }

        renderChart() {
            if (!window.Plotly || !this._chartDiv) return;
            const trace = {
                x: this._data.map(d => d.x),
                y: this._data.map(d => d.y),
                type: "scatter",
                mode: "lines+markers",
                line: { color: "#0072f0" }
            };
            Plotly.newPlot(this._chartDiv, [trace], this._layout, { responsive: true });
        }
    }

    customElements.define("com-example-invertedlinechart", InvertedLineChart);
})();
