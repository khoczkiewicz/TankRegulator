from simple_pid import PID
import time

from flask import Flask, Markup, render_template

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


def RegulateTank():
    hList = []
    tList = []
    setPointList = []  # SP
    sample_time = 0.01

    tank = Tank()
    pid = PID(5, 3, 0.01, setpoint=20, sample_time=sample_time)

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


def RenderTemplate(line_labels, line_values):
    return render_template(
        "line_chart.html",
        title="PID",
        max=max(line_values),
        labels=line_labels,
        values=line_values,
    )


@app.route('/resource', methods = ['POST'])
def update_text():
    # TODO
    return RenderTemplate()
    

@app.route("/line")
def line():
    tList, hList, setPointList = RegulateTank()
    return RenderTemplate(tList, hList)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
