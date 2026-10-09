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
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, } from 'typeorm';
import { Reservation } from '../../reservation/entities/reservation.entity.js';
let Paiement = (() => {
    let _classDecorators = [Entity('paiement')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_paiement_decorators;
    let _id_paiement_initializers = [];
    let _id_paiement_extraInitializers = [];
    let _montant_decorators;
    let _montant_initializers = [];
    let _montant_extraInitializers = [];
    let _date_paiement_decorators;
    let _date_paiement_initializers = [];
    let _date_paiement_extraInitializers = [];
    let _mode_decorators;
    let _mode_initializers = [];
    let _mode_extraInitializers = [];
    let _reservation_decorators;
    let _reservation_initializers = [];
    let _reservation_extraInitializers = [];
    var Paiement = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_paiement_decorators = [PrimaryGeneratedColumn()];
            _montant_decorators = [Column('decimal', { precision: 10, scale: 2 })];
            _date_paiement_decorators = [CreateDateColumn()];
            _mode_decorators = [Column()];
            _reservation_decorators = [ManyToOne(() => Reservation, { nullable: false, eager: true }), JoinColumn({ name: 'id_reservation' })];
            __esDecorate(null, null, _id_paiement_decorators, { kind: "field", name: "id_paiement", static: false, private: false, access: { has: obj => "id_paiement" in obj, get: obj => obj.id_paiement, set: (obj, value) => { obj.id_paiement = value; } }, metadata: _metadata }, _id_paiement_initializers, _id_paiement_extraInitializers);
            __esDecorate(null, null, _montant_decorators, { kind: "field", name: "montant", static: false, private: false, access: { has: obj => "montant" in obj, get: obj => obj.montant, set: (obj, value) => { obj.montant = value; } }, metadata: _metadata }, _montant_initializers, _montant_extraInitializers);
            __esDecorate(null, null, _date_paiement_decorators, { kind: "field", name: "date_paiement", static: false, private: false, access: { has: obj => "date_paiement" in obj, get: obj => obj.date_paiement, set: (obj, value) => { obj.date_paiement = value; } }, metadata: _metadata }, _date_paiement_initializers, _date_paiement_extraInitializers);
            __esDecorate(null, null, _mode_decorators, { kind: "field", name: "mode", static: false, private: false, access: { has: obj => "mode" in obj, get: obj => obj.mode, set: (obj, value) => { obj.mode = value; } }, metadata: _metadata }, _mode_initializers, _mode_extraInitializers);
            __esDecorate(null, null, _reservation_decorators, { kind: "field", name: "reservation", static: false, private: false, access: { has: obj => "reservation" in obj, get: obj => obj.reservation, set: (obj, value) => { obj.reservation = value; } }, metadata: _metadata }, _reservation_initializers, _reservation_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            Paiement = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        id_paiement = __runInitializers(this, _id_paiement_initializers, void 0);
        montant = (__runInitializers(this, _id_paiement_extraInitializers), __runInitializers(this, _montant_initializers, void 0));
        date_paiement = (__runInitializers(this, _montant_extraInitializers), __runInitializers(this, _date_paiement_initializers, void 0));
        mode = (__runInitializers(this, _date_paiement_extraInitializers), __runInitializers(this, _mode_initializers, void 0));
        reservation = (__runInitializers(this, _mode_extraInitializers), __runInitializers(this, _reservation_initializers, void 0));
        constructor() {
            __runInitializers(this, _reservation_extraInitializers);
        }
    };
    return Paiement = _classThis;
})();
export { Paiement };
