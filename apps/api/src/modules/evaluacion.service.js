var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import { Injectable } from '@nestjs/common';
let EvaluacionService = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var EvaluacionService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            EvaluacionService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        prisma;
        constructor(prisma) {
            this.prisma = prisma;
        }
        async getConcentrado(materiaId) {
            const inscripciones = await this.prisma.inscripciones.findMany({
                where: { materia_id: materiaId, estado: 'activa' },
            });
            const alumnos = await Promise.all(inscripciones.map(async (i) => {
                const u = await this.prisma.usuarios.findUnique({ where: { id: i.alumno_id }, select: { id: true, nombre: true } });
                return u;
            }));
            const actividades = await this.prisma.actividades.findMany({
                where: { materia_id: materiaId, estado: 'publicada' },
                select: { id: true, titulo: true, tipo: true },
            });
            const calificaciones = await this.prisma.calificaciones.findMany({
                where: { actividad_id: { in: actividades.map(a => a.id) } },
            });
            const ponderaciones = await this.prisma.ponderaciones_materia.findMany({ where: { materia_id: materiaId } });
            const pondMap = {};
            ponderaciones.forEach(p => { pondMap[p.tipo] = Number(p.peso); });
            return alumnos.map((alumno) => {
                const califAlumno = calificaciones.filter(c => c.alumno_id === alumno.id);
                const porTipo = {};
                for (const c of califAlumno) {
                    const act = actividades.find(a => a.id === c.actividad_id);
                    if (act) {
                        (porTipo[act.tipo] = porTipo[act.tipo] || []).push(Number(c.puntaje));
                    }
                }
                let suma = 0, pesoUsado = 0;
                for (const [tipo, notas] of Object.entries(porTipo)) {
                    const peso = pondMap[tipo] || 0;
                    if (peso > 0) {
                        suma += (notas.reduce((a, b) => a + b, 0) / notas.length) * (peso / 100);
                        pesoUsado += peso;
                    }
                }
                return {
                    alumno: alumno.nombre,
                    nota: pesoUsado > 0 ? Math.round(suma / (pesoUsado / 100) * 100) / 100 : null,
                    avance: pesoUsado,
                };
            });
        }
    };
    return EvaluacionService = _classThis;
})();
export { EvaluacionService };
//# sourceMappingURL=evaluacion.service.js.map