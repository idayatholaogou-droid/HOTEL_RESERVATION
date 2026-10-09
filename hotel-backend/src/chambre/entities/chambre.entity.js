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
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, } from 'typeorm';
import { TypeChambre } from '../../type-chambre/entities/type-chambre.entity.js';
let Chambre = (() => {
    let _classDecorators = [Entity('chambre')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_chambre_decorators;
    let _id_chambre_initializers = [];
    let _id_chambre_extraInitializers = [];
    let _numero_decorators;
    let _numero_initializers = [];
    let _numero_extraInitializers = [];
    let _etage_decorators;
    let _etage_initializers = [];
    let _etage_extraInitializers = [];
    let _statut_decorators;
    let _statut_initializers = [];
    let _statut_extraInitializers = [];
    let _image_decorators;
    let _image_initializers = [];
    let _image_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    var Chambre = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_chambre_decorators = [PrimaryGeneratedColumn()];
            _numero_decorators = [Column()];
            _etage_decorators = [Column()];
            _statut_decorators = [Column()];
            _image_decorators = [Column({ nullable: true })];
            _type_decorators = [ManyToOne(() => TypeChambre, { nullable: false, eager: true }), JoinColumn({ name: 'id_type' })];
            __esDecorate(null, null, _id_chambre_decorators, { kind: "field", name: "id_chambre", static: false, private: false, access: { has: obj => "id_chambre" in obj, get: obj => obj.id_chambre, set: (obj, value) => { obj.id_chambre = value; } }, metadata: _metadata }, _id_chambre_initializers, _id_chambre_extraInitializers);
            __esDecorate(null, null, _numero_decorators, { kind: "field", name: "numero", static: false, private: false, access: { has: obj => "numero" in obj, get: obj => obj.numero, set: (obj, value) => { obj.numero = value; } }, metadata: _metadata }, _numero_initializers, _numero_extraInitializers);
            __esDecorate(null, null, _etage_decorators, { kind: "field", name: "etage", static: false, private: false, access: { has: obj => "etage" in obj, get: obj => obj.etage, set: (obj, value) => { obj.etage = value; } }, metadata: _metadata }, _etage_initializers, _etage_extraInitializers);
            __esDecorate(null, null, _statut_decorators, { kind: "field", name: "statut", static: false, private: false, access: { has: obj => "statut" in obj, get: obj => obj.statut, set: (obj, value) => { obj.statut = value; } }, metadata: _metadata }, _statut_initializers, _statut_extraInitializers);
            __esDecorate(null, null, _image_decorators, { kind: "field", name: "image", static: false, private: false, access: { has: obj => "image" in obj, get: obj => obj.image, set: (obj, value) => { obj.image = value; } }, metadata: _metadata }, _image_initializers, _image_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            Chambre = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        id_chambre = __runInitializers(this, _id_chambre_initializers, void 0);
        numero = (__runInitializers(this, _id_chambre_extraInitializers), __runInitializers(this, _numero_initializers, void 0));
        etage = (__runInitializers(this, _numero_extraInitializers), __runInitializers(this, _etage_initializers, void 0));
        statut = (__runInitializers(this, _etage_extraInitializers), __runInitializers(this, _statut_initializers, void 0));
        image = (__runInitializers(this, _statut_extraInitializers), __runInitializers(this, _image_initializers, void 0));
        type = (__runInitializers(this, _image_extraInitializers), __runInitializers(this, _type_initializers, void 0));
        constructor() {
            __runInitializers(this, _type_extraInitializers);
        }
    };
    return Chambre = _classThis;
})();
export { Chambre };
