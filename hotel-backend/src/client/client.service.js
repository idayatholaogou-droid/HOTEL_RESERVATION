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
import { BadRequestException, ConflictException, Injectable, } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { Client } from './entities/client.entity.js';
import { Utilisateur } from '../utilisateur/entities/utilisateur.entity.js';
let ClientService = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ClientService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ClientService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        clientRepository;
        constructor(clientRepository) {
            this.clientRepository = clientRepository;
        }
        async inscrire(dto) {
            if (!dto.email || !dto.adresse) {
                throw new BadRequestException("L'email et l'adresse sont obligatoires");
            }
            const email = dto.email.trim().toLowerCase();
            const existant = await this.clientRepository.manager.findOneBy(Utilisateur, { login: email });
            if (existant) {
                throw new ConflictException('Cet email est déjà utilisé');
            }
            const mot_de_passe = await bcrypt.hash(dto.mot_de_passe, 10);
            return this.clientRepository.manager.transaction(async (manager) => {
                const utilisateur = await manager.save(manager.create(Utilisateur, {
                    nom: dto.nom,
                    prenom: dto.prenom,
                    login: email,
                    mot_de_passe,
                    role: 'client',
                }));
                const client = await manager.save(manager.create(Client, {
                    nom: dto.nom,
                    prenom: dto.prenom,
                    telephone: dto.telephone,
                    email,
                    adresse: dto.adresse,
                    utilisateur,
                }));
                return {
                    id_client: client.id_client,
                    nom: client.nom,
                    prenom: client.prenom,
                    telephone: client.telephone,
                    email: client.email,
                    adresse: client.adresse,
                    utilisateur: {
                        id_utilisateur: utilisateur.id_utilisateur,
                        login: utilisateur.login,
                        role: utilisateur.role,
                    },
                };
            });
        }
        create(dto) {
            const client = this.clientRepository.create(dto);
            return this.clientRepository.save(client);
        }
        findAll() {
            return this.clientRepository.find();
        }
        findOne(id) {
            return this.clientRepository.findOneBy({ id_client: id });
        }
        async update(id, dto) {
            await this.clientRepository.update(id, dto);
            return this.findOne(id);
        }
        async remove(id) {
            await this.clientRepository.delete(id);
            return { deleted: true };
        }
    };
    return ClientService = _classThis;
})();
export { ClientService };
