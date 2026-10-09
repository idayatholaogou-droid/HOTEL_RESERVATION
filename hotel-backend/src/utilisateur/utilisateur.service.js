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
import { Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcryptjs';
let UtilisateurService = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var UtilisateurService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            UtilisateurService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        utilisateurRepository;
        clientRepository;
        authService;
        constructor(utilisateurRepository, clientRepository, authService) {
            this.utilisateurRepository = utilisateurRepository;
            this.clientRepository = clientRepository;
            this.authService = authService;
        }
        sansMotDePasse(utilisateur) {
            if (!utilisateur) {
                return null;
            }
            const { mot_de_passe, ...reste } = utilisateur;
            return reste;
        }
        async create(dto) {
            const mot_de_passe = await bcrypt.hash(dto.mot_de_passe, 10);
            const utilisateur = this.utilisateurRepository.create({
                ...dto,
                mot_de_passe,
            });
            const enregistre = await this.utilisateurRepository.save(utilisateur);
            return this.sansMotDePasse(enregistre);
        }
        async findAll() {
            const utilisateurs = await this.utilisateurRepository.find();
            return utilisateurs.map((u) => this.sansMotDePasse(u));
        }
        async findOne(id) {
            const utilisateur = await this.utilisateurRepository.findOneBy({
                id_utilisateur: id,
            });
            return this.sansMotDePasse(utilisateur);
        }
        async update(id, dto) {
            const donnees = { ...dto };
            if (donnees.mot_de_passe) {
                donnees.mot_de_passe = await bcrypt.hash(donnees.mot_de_passe, 10);
            }
            await this.utilisateurRepository.update(id, donnees);
            return this.findOne(id);
        }
        async login(login, mot_de_passe) {
            const utilisateur = await this.utilisateurRepository.findOneBy({ login });
            if (!utilisateur ||
                !(await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe))) {
                throw new UnauthorizedException('Login ou mot de passe incorrect');
            }
            // Récupère le client lié si c'est un client
            let id_client = null;
            if (utilisateur.role === 'client') {
                const client = await this.clientRepository.findOne({
                    where: {
                        utilisateur: { id_utilisateur: utilisateur.id_utilisateur },
                    },
                });
                id_client = client?.id_client ?? null;
            }
            // Génère le token avec id_client
            const token = await this.authService.genererToken({
                id_utilisateur: utilisateur.id_utilisateur,
                login: utilisateur.login,
                role: utilisateur.role,
                id_client,
            });
            const resultat = this.sansMotDePasse(utilisateur);
            return {
                ...resultat,
                id_client,
                access_token: token,
            };
        }
        async remove(id) {
            await this.utilisateurRepository.delete(id);
            return { deleted: true };
        }
    };
    return UtilisateurService = _classThis;
})();
export { UtilisateurService };
