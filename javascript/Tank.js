class Tank {
    constructor(h, hMax, A, B) {
        this.hLast = h;
        this.h = h;
        this.hMax = hMax;
        this.A = A;
        this.B = B;
    }

    computeOutflow() {
        return this.B * Math.sqrt(h);
    }

    computeInflow(Tp) {
        return (this.A * (this.h - this.hLast) / Tp + this.computeOutflow()) + 30;
    }

    computeWaterLevel(Tp, output) {
        h += 1/this.A * ((output / 100) * this.computeInflow(Tp) - this.computeOutflow())* Tp;
        this.hLast = h;
        return this.h;      
    }
}