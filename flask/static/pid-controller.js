// Remarks https://codepen.io/sbrekken/pen/juxzs
// Adapted from https://github.com/br3ttb/Arduino-PID-Library
function PID(p, i, d) {
    this.sampleTime = 100
    this.target = 0
    this.output = 0

    this.errorSum = 0
    this.lastInput = 0
    this.lastTime = Date.now() - this.sampleTime

    this.setTunings(p, i, d)
}

PID.prototype.setTunings = function(p, i, d) {
    var ratio = this.sampleTime / 1000

    this.p = p
    this.i = i * ratio
    this.d = d / ratio
}

PID.prototype.setSampleTime = function(sampleTime) {
    var ratio = sampleTime / this.sampleTime

    this.i *= ratio
    this.d /= ratio
    this.sampleTime = sampleTime
}

PID.prototype.setOutputLimits = function(min, max) {
    this.min = min
    this.max = max
}

PID.prototype.setTarget = function(value) {
    this.target = value
}

PID.prototype.compute = function(input) {
    var now = Date.now(),
        timeDiff = now - this.lastTime

    if (timeDiff >= this.sampleTime) {
        var error = this.target - input,
            inputDiff = input - this.lastInput

        this.errorSum = Math.max(this.min, Math.min(this.max, this.errorSum + (this.i * error)))
        this.output = Math.max(this.min, Math.min(this.max, (this.p * error) + this.errorSum - (this.d * inputDiff)))
        this.lastInput = input
        this.lastTime = now
    }

    return this.output
}