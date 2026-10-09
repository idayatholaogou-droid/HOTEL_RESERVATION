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
import { Controller, Get, Post, Patch, Delete, UseGuards, UseInterceptors, BadRequestException, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
let ChambreController = (() => {
    let _classDecorators = [Controller('chambre')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _findAll_decorators;
    let _uploadImage_decorators;
    let _create_decorators;
    let _update_decorators;
    let _remove_decorators;
    let _findOne_decorators;
    var ChambreController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _findAll_decorators = [Get()];
            _uploadImage_decorators = [Post('upload'), UseGuards(JwtAuthGuard, RolesGuard), Roles('admin'), UseInterceptors(FileInterceptor('image', {
                    storage: diskStorage({
                        destination: './uploads',
                        filename: (req, file, cb) => {
                            const nom = `chambre-${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
                            cb(null, nom);
                        },
                    }),
                    fileFilter: (req, file, cb) => {
                        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
                            return cb(new BadRequestException('Seules les images (jpg, jpeg, png, webp) sont autorisées'), false);
                        }
                        cb(null, true);
                    },
                    limits: { fileSize: 5 * 1024 * 1024 },
                }))];
            _create_decorators = [Post(), UseGuards(JwtAuthGuard, RolesGuard), Roles('admin')];
            _update_decorators = [Patch(':id'), UseGuards(JwtAuthGuard, RolesGuard), Roles('admin')];
            _remove_decorators = [Delete(':id'), UseGuards(JwtAuthGuard, RolesGuard), Roles('admin')];
            _findOne_decorators = [Get(':id')];
            __esDecorate(this, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: obj => "findAll" in obj, get: obj => obj.findAll }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _uploadImage_decorators, { kind: "method", name: "uploadImage", static: false, private: false, access: { has: obj => "uploadImage" in obj, get: obj => obj.uploadImage }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: obj => "update" in obj, get: obj => obj.update }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: obj => "remove" in obj, get: obj => obj.remove }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: obj => "findOne" in obj, get: obj => obj.findOne }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ChambreController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        chambreService = __runInitializers(this, _instanceExtraInitializers);
        constructor(chambreService) {
            this.chambreService = chambreService;
        }
        // ==========================================
        // ROUTES PUBLIQUES
        // ==========================================
        findAll() {
            return this.chambreService.findAll();
        }
        // ==========================================
        // ADMIN : gestion des chambres
        // ==========================================
        // 🔒 ADMIN : uploader une image
        uploadImage(file) {
            if (!file) {
                throw new BadRequestException('Aucun fichier reçu');
            }
            return {
                filename: file.filename,
                url: `/uploads/${file.filename}`,
            };
        }
        // 👑 ADMIN : créer une chambre
        create(dto) {
            return this.chambreService.create(dto);
        }
        // 👑 ADMIN : modifier une chambre
        update(id, dto) {
            return this.chambreService.update(+id, dto);
        }
        // 👑 ADMIN : supprimer une chambre
        remove(id) {
            return this.chambreService.remove(+id);
        }
        // ⚠️ Route `:id` EN DERNIER (sinon elle capture 'upload')
        findOne(id) {
            return this.chambreService.findOne(+id);
        }
    };
    return ChambreController = _classThis;
})();
export { ChambreController };
