var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
import { Controller, Get, Post } from '@nestjs/common';
let EntregasController = (() => {
    let _classDecorators = [Controller({ path: 'entregas', version: '1' })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _findPendientes_decorators;
    let _enviar_decorators;
    let _evaluar_decorators;
    var EntregasController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _findPendientes_decorators = [Get('pendientes')];
            _enviar_decorators = [Post()];
            _evaluar_decorators = [Post(':id/evaluar')];
            __esDecorate(this, null, _findPendientes_decorators, { kind: "method", name: "findPendientes", static: false, private: false, access: { has: obj => "findPendientes" in obj, get: obj => obj.findPendientes }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _enviar_decorators, { kind: "method", name: "enviar", static: false, private: false, access: { has: obj => "enviar" in obj, get: obj => obj.enviar }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _evaluar_decorators, { kind: "method", name: "evaluar", static: false, private: false, access: { has: obj => "evaluar" in obj, get: obj => obj.evaluar }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            EntregasController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        entregasService = __runInitializers(this, _instanceExtraInitializers);
        constructor(entregasService) {
            this.entregasService = entregasService;
        }
        findPendientes(req) { return this.entregasService.findPendientes(req.user.institucion_id); }
        enviar(body, req) {
            return this.entregasService.enviar(body.actividad_id, req.user.id, req.user.institucion_id);
        }
        evaluar(id, body, req) {
            return this.entregasService.evaluar(id, body.decision, body.puntaje, body.comentario, req.user.id);
        }
    };
    return EntregasController = _classThis;
})();
export { EntregasController };
//# sourceMappingURL=entregas.controller.js.map