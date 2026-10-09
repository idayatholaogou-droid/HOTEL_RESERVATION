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
import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, } from '@nestjs/common';
import { Paiement } from './entities/paiement.entity.js';
import { Reservation } from '../reservation/entities/reservation.entity.js';
let PaiementService = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PaiementService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PaiementService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        paiementRepository;
        constructor(paiementRepository) {
            this.paiementRepository = paiementRepository;
        }
        async create(dto, utilisateur) {
            if (!dto.mode) {
                throw new BadRequestException('Le mode de paiement est obligatoire');
            }
            return this.paiementRepository.manager.transaction(async (manager) => {
                const reservation = await manager.findOne(Reservation, {
                    where: { id_reservation: dto.id_reservation },
                    relations: { client: true, chambre: { type: true } },
                });
                if (!reservation) {
                    throw new NotFoundException('Réservation introuvable');
                }
                // 🔒 Un client ne peut payer que SA réservation
                if (utilisateur.role === 'client') {
                    if (utilisateur.id_client === null) {
                        throw new ForbiddenException('Client non identifié');
                    }
                    if (reservation.client.id_client !== utilisateur.id_client) {
                        throw new ForbiddenException("Vous ne pouvez pas payer la réservation d'un autre client");
                    }
                }
                if (reservation.statut === 'annulee') {
                    throw new BadRequestException('Cette réservation est annulée');
                }
                if (reservation.statut === 'confirmee') {
                    throw new ConflictException('Cette réservation est déjà payée');
                }
                const nuits = Math.round((new Date(reservation.date_depart).getTime() -
                    new Date(reservation.date_arrivee).getTime()) /
                    86400000);
                const montant = nuits * Number(reservation.chambre.type.prix_nuit);
                const paiement = await manager.save(manager.create(Paiement, { montant, mode: dto.mode, reservation }));
                reservation.statut = 'confirmee';
                await manager.save(reservation);
                return paiement;
            });
        }
        findAll() {
            return this.paiementRepository.find();
        }
        findOne(id) {
            return this.paiementRepository.findOneBy({ id_paiement: id });
        }
    };
    return PaiementService = _classThis;
})();
export { PaiementService };
