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
import { Client } from '../../client/entities/client.entity.js';
import { Chambre } from '../../chambre/entities/chambre.entity.js';
let Reservation = (() => {
    let _classDecorators = [Entity('reservation')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_reservation_decorators;
    let _id_reservation_initializers = [];
    let _id_reservation_extraInitializers = [];
    let _date_arrivee_decorators;
    let _date_arrivee_initializers = [];
    let _date_arrivee_extraInitializers = [];
    let _date_depart_decorators;
    let _date_depart_initializers = [];
    let _date_depart_extraInitializers = [];
    let _statut_decorators;
    let _statut_initializers = [];
    let _statut_extraInitializers = [];
    let _date_creation_decorators;
    let _date_creation_initializers = [];
    let _date_creation_extraInitializers = [];
    let _note_decorators;
    let _note_initializers = [];
    let _note_extraInitializers = [];
    let _commentaire_decorators;
    let _commentaire_initializers = [];
    let _commentaire_extraInitializers = [];
    let _client_decorators;
    let _client_initializers = [];
    let _client_extraInitializers = [];
    let _chambre_decorators;
    let _chambre_initializers = [];
    let _chambre_extraInitializers = [];
    var Reservation = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_reservation_decorators = [PrimaryGeneratedColumn()];
            _date_arrivee_decorators = [Column({ type: 'date' })];
            _date_depart_decorators = [Column({ type: 'date' })];
            _statut_decorators = [Column({ default: 'en_attente' })];
            _date_creation_decorators = [CreateDateColumn()];
            _note_decorators = [Column({ type: 'int', nullable: true })];
            _commentaire_decorators = [Column({ type: 'text', nullable: true })];
            _client_decorators = [ManyToOne(() => Client, { nullable: false, eager: true }), JoinColumn({ name: 'id_client' })];
            _chambre_decorators = [ManyToOne(() => Chambre, { nullable: false, eager: true }), JoinColumn({ name: 'id_chambre' })];
            __esDecorate(null, null, _id_reservation_decorators, { kind: "field", name: "id_reservation", static: false, private: false, access: { has: obj => "id_reservation" in obj, get: obj => obj.id_reservation, set: (obj, value) => { obj.id_reservation = value; } }, metadata: _metadata }, _id_reservation_initializers, _id_reservation_extraInitializers);
            __esDecorate(null, null, _date_arrivee_decorators, { kind: "field", name: "date_arrivee", static: false, private: false, access: { has: obj => "date_arrivee" in obj, get: obj => obj.date_arrivee, set: (obj, value) => { obj.date_arrivee = value; } }, metadata: _metadata }, _date_arrivee_initializers, _date_arrivee_extraInitializers);
            __esDecorate(null, null, _date_depart_decorators, { kind: "field", name: "date_depart", static: false, private: false, access: { has: obj => "date_depart" in obj, get: obj => obj.date_depart, set: (obj, value) => { obj.date_depart = value; } }, metadata: _metadata }, _date_depart_initializers, _date_depart_extraInitializers);
            __esDecorate(null, null, _statut_decorators, { kind: "field", name: "statut", static: false, private: false, access: { has: obj => "statut" in obj, get: obj => obj.statut, set: (obj, value) => { obj.statut = value; } }, metadata: _metadata }, _statut_initializers, _statut_extraInitializers);
            __esDecorate(null, null, _date_creation_decorators, { kind: "field", name: "date_creation", static: false, private: false, access: { has: obj => "date_creation" in obj, get: obj => obj.date_creation, set: (obj, value) => { obj.date_creation = value; } }, metadata: _metadata }, _date_creation_initializers, _date_creation_extraInitializers);
            __esDecorate(null, null, _note_decorators, { kind: "field", name: "note", static: false, private: false, access: { has: obj => "note" in obj, get: obj => obj.note, set: (obj, value) => { obj.note = value; } }, metadata: _metadata }, _note_initializers, _note_extraInitializers);
            __esDecorate(null, null, _commentaire_decorators, { kind: "field", name: "commentaire", static: false, private: false, access: { has: obj => "commentaire" in obj, get: obj => obj.commentaire, set: (obj, value) => { obj.commentaire = value; } }, metadata: _metadata }, _commentaire_initializers, _commentaire_extraInitializers);
            __esDecorate(null, null, _client_decorators, { kind: "field", name: "client", static: false, private: false, access: { has: obj => "client" in obj, get: obj => obj.client, set: (obj, value) => { obj.client = value; } }, metadata: _metadata }, _client_initializers, _client_extraInitializers);
            __esDecorate(null, null, _chambre_decorators, { kind: "field", name: "chambre", static: false, private: false, access: { has: obj => "chambre" in obj, get: obj => obj.chambre, set: (obj, value) => { obj.chambre = value; } }, metadata: _metadata }, _chambre_initializers, _chambre_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            Reservation = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        id_reservation = __runInitializers(this, _id_reservation_initializers, void 0);
        date_arrivee = (__runInitializers(this, _id_reservation_extraInitializers), __runInitializers(this, _date_arrivee_initializers, void 0));
        date_depart = (__runInitializers(this, _date_arrivee_extraInitializers), __runInitializers(this, _date_depart_initializers, void 0));
        statut = (__runInitializers(this, _date_depart_extraInitializers), __runInitializers(this, _statut_initializers, void 0));
        date_creation = (__runInitializers(this, _statut_extraInitializers), __runInitializers(this, _date_creation_initializers, void 0));
        note = (__runInitializers(this, _date_creation_extraInitializers), __runInitializers(this, _note_initializers, void 0));
        commentaire = (__runInitializers(this, _note_extraInitializers), __runInitializers(this, _commentaire_initializers, void 0));
        client = (__runInitializers(this, _commentaire_extraInitializers), __runInitializers(this, _client_initializers, void 0));
        chambre = (__runInitializers(this, _client_extraInitializers), __runInitializers(this, _chambre_initializers, void 0));
        constructor() {
            __runInitializers(this, _chambre_extraInitializers);
        }
    };
    return Reservation = _classThis;
})();
export { Reservation };
