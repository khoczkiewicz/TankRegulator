from simple_pid import PID
from skfuzzy import control as ctrl
import time
import skfuzzy as fuzz
import numpy as np
import matplotlib.pyplot as plt
import io
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas


from flask import Flask, Markup, render_template, request, Response, jsonify, make_response

app = Flask(__name__)

def RegulateTankFuzzy(water_level):
    x_waterLevel = ctrl.Antecedent(np.arange(0.00, 1.04, 0.08), 'level')
    x_waterInput = ctrl.Consequent(np.arange(0.00, 1.10, 0.16), 'flow')

    x_waterLevel.automf(3)

    x_waterInput['slow'] = fuzz.trimf(x_waterInput.universe, [0.00, 0.00, 0.48])
    x_waterInput['medium'] = fuzz.trimf(x_waterInput.universe, [0.00, 0.48, 0.96])
    x_waterInput['fast'] = fuzz.trimf(x_waterInput.universe, [0.48, 0.96, 0.96])

    rule1 = ctrl.Rule(x_waterLevel['good'], x_waterInput['slow'])
    rule2 = ctrl.Rule(x_waterLevel['average'], x_waterInput['medium'])
    rule3 = ctrl.Rule(x_waterLevel['poor'], x_waterInput['fast'])

    water_ctrl = ctrl.ControlSystem([rule1, rule2, rule3])
    water = ctrl.ControlSystemSimulation(water_ctrl)

    water.input['level'] = water_level 

    water.compute()
    print(water.output['flow'])
    x_waterInput.view(sim=water)

@app.route('/line', methods=['GET'])
def line():
    return render_template('index.html')


@app.route('/fuzzy.png', methods=['POST', 'GET'])
def fuzz_png():
    if request.method == 'POST':
        water_level = float(request.form['water_level'])
        RegulateTankFuzzy(water_level)
        return Response()
    if request.method == 'GET':
        fig = plt.gcf()
        output = io.BytesIO()
        FigureCanvas(fig).print_png(output)
        return Response(output.getvalue(), mimetype='image/png')

import webbrowser
    
if __name__ == "__main__":
    webbrowser.open('http://localhost:8080/line', new=2)
    app.run(host="0.0.0.0", port=8080, debug=True)
