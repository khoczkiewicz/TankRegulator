from simple_pid import PID
import time

from flask import Flask, Markup, render_template, request

app = Flask(__name__)


class Tank:
    def __init__(self):
        self.Qd = 30
        # dopływ
        self.Qo = 7
        # odpływ
        self.h = 20
        # poziom

    def open(self, x):
        self.h += self.Qd * (x / 100) - self.Qo


def RegulateTank(P = 5, I = 3, D = 0.01):
    hList = []
    tList = []
    setPointList = []  # SP
    sample_time = 0.01

    tank = Tank()
    pid = PID(P, I, D, setpoint=20, sample_time=sample_time)

    N = 100  # okres próbkowania
    currentH = tank.h

    for n in range(1, N):
        output = pid(currentH)

        if output > 100:  # TODO dlaczego
            output = 100

        tank.open(output)
        currentH = tank.h

        time.sleep(sample_time * 2)  # To było najważniejsze :|

        hList.append(currentH)
        setPointList.append(pid.setpoint)
        tList.append(n)
    return tList, hList, setPointList


def RenderTemplate(line_labels, line_values, p, i, d):
    return render_template(
        "line_chart.html",
        title="PID",
		P=p,
		I=i,
		D=d,
        max=max(line_values),
        labels=line_labels,
        values=line_values,
    )
    

@app.route("/line", methods=['GET', 'POST'])
def line():
    if request.method == 'POST':

        P = float(request.form['parg'])
        I = float(request.form['iarg'])
        D = float(request.form['darg'])
        tList, hList, setPointList = RegulateTank(P, I, D)
    else:
        tList, hList, setPointList = RegulateTank()
    return RenderTemplate(tList, hList, P, I, D)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
