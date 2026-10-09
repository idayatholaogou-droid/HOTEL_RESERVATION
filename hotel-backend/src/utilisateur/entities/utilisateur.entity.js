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
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
let Utilisateur = (() => {
    let _classDecorators = [Entity('utilisateur')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_utilisateur_decorators;
    let _id_utilisateur_initializers = [];
    let _id_utilisateur_extraInitializers = [];
    let _nom_decorators;
    let _nom_initializers = [];
    let _nom_extraInitializers = [];
    let _prenom_decorators;
    let _prenom_initializers = [];
    let _prenom_extraInitializers = [];
    let _login_decorators;
    let _login_initializers = [];
    let _login_extraInitializers = [];
    let _mot_de_passe_decorators;
    let _mot_de_passe_initializers = [];
    let _mot_de_passe_extraInitializers = [];
    let _role_decorators;
    let _role_initializers = [];
    let _role_extraInitializers = [];
    var Utilisateur = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_utilisateur_decorators = [PrimaryGeneratedColumn()];
            _nom_decorators = [Column()];
            _prenom_decorators = [Column()];
            _login_decorators = [Column({ unique: true })];
            _mot_de_passe_decorators = [Column()];
            _role_decorators = [Column()];
            __esDecorate(null, null, _id_utilisateur_decorators, { kind: "field", name: "id_utilisateur", static: false, private: false, access: { has: obj => "id_utilisateur" in obj, get: obj => obj.id_utilisateur, set: (obj, value) => { obj.id_utilisateur = value; } }, metadata: _metadata }, _id_utilisateur_initializers, _id_utilisateur_extraInitializers);
            __esDecorate(null, null, _nom_decorators, { kind: "field", name: "nom", static: false, private: false, access: { has: obj => "nom" in obj, get: obj => obj.nom, set: (obj, value) => { obj.nom = value; } }, metadata: _metadata }, _nom_initializers, _nom_extraInitializers);
            __esDecorate(null, null, _prenom_decorators, { kind: "field", name: "prenom", static: false, private: false, access: { has: obj => "prenom" in obj, get: obj => obj.prenom, set: (obj, value) => { obj.prenom = value; } }, metadata: _metadata }, _prenom_initializers, _prenom_extraInitializers);
            __esDecorate(null, null, _login_decorators, { kind: "field", name: "login", static: false, private: false, access: { has: obj => "login" in obj, get: obj => obj.login, set: (obj, value) => { obj.login = value; } }, metadata: _metadata }, _login_initializers, _login_extraInitializers);
            __esDecorate(null, null, _mot_de_passe_decorators, { kind: "field", name: "mot_de_passe", static: false, private: false, access: { has: obj => "mot_de_passe" in obj, get: obj => obj.mot_de_passe, set: (obj, value) => { obj.mot_de_passe = value; } }, metadata: _metadata }, _mot_de_passe_initializers, _mot_de_passe_extraInitializers);
            __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: obj => "role" in obj, get: obj => obj.role, set: (obj, value) => { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            Utilisateur = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        id_utilisateur = __runInitializers(this, _id_utilisateur_initializers, void 0);
        nom = (__runInitializers(this, _id_utilisateur_extraInitializers), __runInitializers(this, _nom_initializers, void 0));
        prenom = (__runInitializers(this, _nom_extraInitializers), __runInitializers(this, _prenom_initializers, void 0));
        login = (__runInitializers(this, _prenom_extraInitializers), __runInitializers(this, _login_initializers, void 0));
        mot_de_passe = (__runInitializers(this, _login_extraInitializers), __runInitializers(this, _mot_de_passe_initializers, void 0));
        role = (__runInitializers(this, _mot_de_passe_extraInitializers), __runInitializers(this, _role_initializers, void 0));
        constructor() {
            __runInitializers(this, _role_extraInitializers);
        }
    };
    return Utilisateur = _classThis;
})();
export { Utilisateur };
