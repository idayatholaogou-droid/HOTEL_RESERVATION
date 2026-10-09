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
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, } from 'typeorm';
import { Utilisateur } from '../../utilisateur/entities/utilisateur.entity.js';
let Client = (() => {
    let _classDecorators = [Entity('client')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_client_decorators;
    let _id_client_initializers = [];
    let _id_client_extraInitializers = [];
    let _nom_decorators;
    let _nom_initializers = [];
    let _nom_extraInitializers = [];
    let _prenom_decorators;
    let _prenom_initializers = [];
    let _prenom_extraInitializers = [];
    let _telephone_decorators;
    let _telephone_initializers = [];
    let _telephone_extraInitializers = [];
    let _email_decorators;
    let _email_initializers = [];
    let _email_extraInitializers = [];
    let _adresse_decorators;
    let _adresse_initializers = [];
    let _adresse_extraInitializers = [];
    let _utilisateur_decorators;
    let _utilisateur_initializers = [];
    let _utilisateur_extraInitializers = [];
    var Client = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_client_decorators = [PrimaryGeneratedColumn()];
            _nom_decorators = [Column()];
            _prenom_decorators = [Column()];
            _telephone_decorators = [Column()];
            _email_decorators = [Column({ nullable: true })];
            _adresse_decorators = [Column({ nullable: true })];
            _utilisateur_decorators = [OneToOne(() => Utilisateur, { nullable: true }), JoinColumn({ name: 'id_utilisateur' })];
            __esDecorate(null, null, _id_client_decorators, { kind: "field", name: "id_client", static: false, private: false, access: { has: obj => "id_client" in obj, get: obj => obj.id_client, set: (obj, value) => { obj.id_client = value; } }, metadata: _metadata }, _id_client_initializers, _id_client_extraInitializers);
            __esDecorate(null, null, _nom_decorators, { kind: "field", name: "nom", static: false, private: false, access: { has: obj => "nom" in obj, get: obj => obj.nom, set: (obj, value) => { obj.nom = value; } }, metadata: _metadata }, _nom_initializers, _nom_extraInitializers);
            __esDecorate(null, null, _prenom_decorators, { kind: "field", name: "prenom", static: false, private: false, access: { has: obj => "prenom" in obj, get: obj => obj.prenom, set: (obj, value) => { obj.prenom = value; } }, metadata: _metadata }, _prenom_initializers, _prenom_extraInitializers);
            __esDecorate(null, null, _telephone_decorators, { kind: "field", name: "telephone", static: false, private: false, access: { has: obj => "telephone" in obj, get: obj => obj.telephone, set: (obj, value) => { obj.telephone = value; } }, metadata: _metadata }, _telephone_initializers, _telephone_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _adresse_decorators, { kind: "field", name: "adresse", static: false, private: false, access: { has: obj => "adresse" in obj, get: obj => obj.adresse, set: (obj, value) => { obj.adresse = value; } }, metadata: _metadata }, _adresse_initializers, _adresse_extraInitializers);
            __esDecorate(null, null, _utilisateur_decorators, { kind: "field", name: "utilisateur", static: false, private: false, access: { has: obj => "utilisateur" in obj, get: obj => obj.utilisateur, set: (obj, value) => { obj.utilisateur = value; } }, metadata: _metadata }, _utilisateur_initializers, _utilisateur_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            Client = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        id_client = __runInitializers(this, _id_client_initializers, void 0);
        nom = (__runInitializers(this, _id_client_extraInitializers), __runInitializers(this, _nom_initializers, void 0));
        prenom = (__runInitializers(this, _nom_extraInitializers), __runInitializers(this, _prenom_initializers, void 0));
        telephone = (__runInitializers(this, _prenom_extraInitializers), __runInitializers(this, _telephone_initializers, void 0));
        email = (__runInitializers(this, _telephone_extraInitializers), __runInitializers(this, _email_initializers, void 0));
        adresse = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _adresse_initializers, void 0));
        utilisateur = (__runInitializers(this, _adresse_extraInitializers), __runInitializers(this, _utilisateur_initializers, void 0));
        constructor() {
            __runInitializers(this, _utilisateur_extraInitializers);
        }
    };
    return Client = _classThis;
})();
export { Client };
