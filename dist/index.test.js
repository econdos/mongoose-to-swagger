"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const documentModel = require(".");
const mongoose_1 = __importStar(require("mongoose"));
const { getFieldsFromMongooseSchema } = documentModel;
describe('index.test.ts', () => {
    describe('mixed', () => {
        it('basic mixed type handling', () => {
            const schema = new mongoose_1.default.Schema({
                a: {
                    type: mongoose_1.default.Schema.Types.Mixed,
                },
            });
            const swagger = documentModel({ schema });
            chai_1.expect(swagger.properties).to.exist;
            chai_1.expect(swagger.properties.a.type).to.equal('object');
            chai_1.expect(swagger.properties.a.properties).to.deep.equal({});
            console.log(JSON.stringify(swagger, null, 2));
        });
        it('basic mixed type handling - inferred', () => {
            const schema = new mongoose_1.default.Schema({
                a: {
                    type: {},
                },
            });
            const swagger = documentModel({ schema });
            chai_1.expect(swagger.properties).to.exist;
            chai_1.expect(swagger.properties.a.type).to.equal('object');
            chai_1.expect(swagger.properties.a.properties).to.deep.equal({});
            console.log(JSON.stringify(swagger, null, 2));
        });
        it('basic mixed type handling - inferred shorthand', () => {
            const schema = new mongoose_1.default.Schema({
                a: {},
            });
            const swagger = documentModel({ schema });
            chai_1.expect(swagger.properties).to.exist;
            chai_1.expect(swagger.properties.a.type).to.equal('object');
            chai_1.expect(swagger.properties.a.properties).to.deep.equal({});
            console.log(JSON.stringify(swagger, null, 2));
        });
        it('nested mixed type handling', () => {
            const schema = new mongoose_1.default.Schema({
                a: new mongoose_1.default.Schema({
                    b: {
                        type: new mongoose_1.default.Schema({}),
                    },
                }),
            });
            const swagger = documentModel({ schema: schema });
            chai_1.expect(swagger.properties).to.exist;
            console.log(JSON.stringify(swagger, null, 2));
            chai_1.expect(swagger.properties.a.properties.b.type).to.equal('object');
            chai_1.expect(swagger.properties.a.properties.b.properties).to.deep.equal({
                _id: {
                    type: 'string',
                },
            });
        });
        it('nested mixed type handling - inferred shorthand', () => {
            const schema = new mongoose_1.default.Schema({
                a: new mongoose_1.default.Schema({
                    b: {},
                }),
            });
            const swagger = documentModel({ schema: schema });
            chai_1.expect(swagger.properties).to.exist;
            chai_1.expect(swagger.properties.a.properties.b.type).to.equal('object');
            chai_1.expect(swagger.properties.a.properties.b.properties).to.deep.equal({});
        });
        it('nested mixed type handling - inferred shorthand 2', () => {
            const schema = new mongoose_1.default.Schema({
                a: new mongoose_1.default.Schema({
                    b: { type: {} },
                    c: String,
                }),
            });
            const swagger = documentModel({ schema: schema });
            console.log(JSON.stringify(swagger, null, 2));
            chai_1.expect(swagger.properties).to.exist;
            chai_1.expect(swagger.properties.a.properties.c.type).to.equal('string');
            chai_1.expect(swagger.properties.a.properties.b.type).to.equal('object');
            chai_1.expect(swagger.properties.a.properties.b.properties).to.deep.equal({});
        });
        it('nested mixed type handling - addtl fields', () => {
            const schema = new mongoose_1.default.Schema({
                a: new mongoose_1.default.Schema({
                    b: {
                        type: new mongoose_1.default.Schema({
                            d: String,
                            e: new mongoose_1.default.Schema({}),
                        }),
                    },
                    c: String,
                }),
            });
            const swagger = documentModel({ schema: schema });
            console.log(JSON.stringify(swagger, null, 2));
            chai_1.expect(swagger.properties).to.exist;
            chai_1.expect(swagger.properties.a.properties.c.type).to.equal('string');
            chai_1.expect(swagger.properties.a.properties.b.type).to.equal('object');
            chai_1.expect(swagger.properties.a.properties.b.properties.d.type).to.equal('string');
            chai_1.expect(swagger.properties.a.properties.b.properties.e.type).to.equal('object');
        });
    });
    it.skip('should do something', () => {
        const Cat = mongoose_1.default.model('Cat', new mongoose_1.Schema({ name: String }));
        const swagger = documentModel(Cat);
        chai_1.expect(swagger.properties).to.exist;
    });
    describe('adjustType', () => {
        it('should work for string', () => {
            const result = documentModel.adjustType('String');
            chai_1.expect(result).to.equal('string');
        });
        it('should work for object - 1 of 2', () => {
            const result = documentModel.adjustType('ObjectId');
            chai_1.expect(result).to.equal('string');
        });
        it('should work for object - 2 of 2 - different spelling', () => {
            const result = documentModel.adjustType('ObjectID');
            chai_1.expect(result).to.equal('string');
        });
    });
    describe('documentModel', () => {
        let schema;
        before(() => {
            schema = new mongoose_1.default.Schema({
                title: String,
                author: String,
                body: String,
                comments: [{ body: String, date: Date }],
                likes: [],
                date: { type: Date, default: Date.now },
                hidden: { type: Boolean, required: true },
                toggles: {
                    type: Map,
                    of: Boolean,
                },
                meta: {
                    votes: Number,
                    favs: Number,
                },
                user: {
                    type: mongoose_1.default.Schema.Types.ObjectId,
                    ref: 'User',
                },
                nestedUser: new mongoose_1.default.Schema({
                    user: {
                        type: mongoose_1.default.Schema.Types.ObjectId,
                        ref: 'User',
                    },
                }),
            });
        });
        it('virtual handling', () => {
            const schema = new mongoose_1.Schema({});
            schema.virtual('f', () => 'b');
            const result = documentModel({ schema });
            const virtualField = result.properties.f;
            chai_1.expect(virtualField).to.not.exist;
        });
        it('sub schema array handling', () => {
            const Thing = new mongoose_1.Schema({
                cost: {
                    type: Number,
                    required: true,
                },
            });
            const schema = new mongoose_1.Schema({
                f: {
                    things: {
                        type: [Thing],
                        required: true,
                    },
                },
            });
            const result = documentModel({ schema });
            const field = result.properties.f;
            chai_1.expect(field).to.exist;
            chai_1.expect(field.type).to.equal('object');
            chai_1.expect(field.properties.things).to.exist;
            chai_1.expect(field.properties.things.type).to.equal('array');
            chai_1.expect(field.properties.things.items.required).to.include('cost');
        });
        it('other various types', () => {
            const schema = new mongoose_1.Schema({
                name: String,
                tags: [String],
                age: {
                    type: Number,
                },
                bonus: {
                    max: {
                        type: Number,
                    },
                },
                names: {
                    asd: String,
                    fgh: [String],
                    fgz: [Number],
                    jkl: [{
                            foo: String,
                        }],
                },
                birthday: Date,
                birthday2: { type: Date },
                status: {
                    type: Number,
                },
                ref: {
                    type: mongoose_1.default.Schema.Types.ObjectId,
                    ref: 'ref',
                    required: true,
                },
                bla: [{
                        foo: String,
                        bar: String,
                    }],
                schemaArr: [new mongoose_1.Schema({
                        type: {
                            type: Number,
                            enum: [1, 2, 3],
                        },
                    })],
                decimal: {
                    type: mongoose_1.default.Types.Decimal128,
                },
            });
            schema.virtual('f', () => 'b');
            const results = getFieldsFromMongooseSchema(schema, { props: [] });
            const nameField = results.find(x => x.field === 'name');
            chai_1.expect(nameField.type, 'nameField.type').to.exist;
            chai_1.expect(nameField.type).to.equal('string');
            const tagsField = results.find(x => x.field === 'tags');
            chai_1.expect(tagsField.type).to.equal('array');
            if (tagsField.type !== 'array') {
                throw new Error('fail');
            }
            chai_1.expect(tagsField.items, 'tagsField.items').to.exist;
            chai_1.expect(tagsField.items.type, 'tagsField.items.type').to.equal('string');
            const namesField = results.find(x => x.field === 'names');
            chai_1.expect(namesField.type).to.equal('object');
            const birthdayField = results.find(x => x.field === 'birthday');
            chai_1.expect(birthdayField.type).to.equal('string');
            chai_1.expect(birthdayField.format).to.equal('date-time');
            const statusField = results.find(x => x.field === 'status');
            chai_1.expect(statusField.type).to.equal('number');
            const refField = results.find(x => x.field === 'ref');
            chai_1.expect(refField.type).to.equal('string');
            const schemaArr = results.find(x => x.field === 'schemaArr');
            if (schemaArr.type !== 'array') {
                throw new Error('fail');
            }
            if (schemaArr.items.type !== 'object') {
                throw new Error('fail');
            }
            const decimal = results.find(x => x.field === 'decimal');
            chai_1.expect(decimal.type).to.equal('number');
            chai_1.expect(schemaArr.items.properties).to.exist;
            chai_1.expect(schemaArr.items.properties.type).to.exist;
        });
        it('nested string array 1 of 2', () => {
            const result = documentModel({
                schema: new mongoose_1.default.Schema({
                    scopes: [
                        {
                            actions: [String],
                        },
                    ],
                }),
            });
            const props = result.properties;
            chai_1.expect(props.scopes).to.exist;
            chai_1.expect(props.scopes.items.properties.actions.type).to.equal('array');
            chai_1.expect(props.scopes.items.properties.actions.items.type).to.equal('string');
        });
        it('nested string array 2 of 2', () => {
            const result = documentModel({
                schema: new mongoose_1.default.Schema({
                    scopes: [
                        {
                            actions: [{ type: String, required: true }],
                        },
                    ],
                }),
            });
            const props = result.properties;
            chai_1.expect(props.scopes).to.exist;
            chai_1.expect(props.scopes.items.properties.actions.type).to.equal('array');
            chai_1.expect(props.scopes.items.properties.actions.items.type).to.equal('string');
            const actions = props.scopes.items.properties.actions;
        });
        it('string', () => {
            const result = documentModel({ schema });
            const props = result.properties;
            chai_1.expect(props.author).to.exist;
            chai_1.expect(props.author.type).to.equal('string');
        });
        it('string - lowercase', () => {
            const result = documentModel({
                schema: new mongoose_1.Schema({
                    author: {
                        type: 'string',
                    },
                }),
            });
            const props = result.properties;
            chai_1.expect(props.author).to.exist;
            chai_1.expect(props.author.type).to.equal('string');
        });
        it('string + enum', () => {
            const result = documentModel({
                schema: new mongoose_1.Schema({
                    foo: {
                        type: String,
                        enum: ['bar', 'baz'],
                        required: true,
                    },
                }),
            });
            const props = result.properties;
            chai_1.expect(props.foo).to.exist;
            chai_1.expect(props.foo.type).to.equal('string');
            chai_1.expect(props.foo.enum).to.exist;
            chai_1.expect(props.foo.enum).to.not.be.empty;
            chai_1.expect(props.foo.enum).to.contain('bar');
            chai_1.expect(result.required).to.not.be.empty;
            chai_1.expect(result.required).to.contain('foo');
        });
        it('date', () => {
            const result = documentModel({ schema });
            const props = result.properties;
            chai_1.expect(props.date).to.exist;
            chai_1.expect(props.date.type).to.equal('string');
            chai_1.expect(props.date.format).to.equal('date-time');
        });
        it('map', () => {
            const result = documentModel({ schema });
            const props = result.properties;
            chai_1.expect(props.toggles).to.exist;
            chai_1.expect(props.toggles.type).to.equal('object');
            const additionalProperties = props.toggles.additionalProperties;
            chai_1.expect(additionalProperties).to.exist;
            chai_1.expect(additionalProperties.type).to.equal('boolean');
        });
        it('mongoose model relation', () => {
            const result = documentModel({ schema });
            const props = result.properties;
            chai_1.expect(props.user).to.exist;
            chai_1.expect(props.user.type).to.equal('string');
        });
        it('nested mongoose model', () => {
            const result = documentModel({ schema });
            const props = result.properties;
            chai_1.expect(props.nestedUser).to.exist;
            chai_1.expect(props.nestedUser.properties).to.exist;
        });
        it('array', () => {
            const result = documentModel({ schema });
            const props = result.properties;
            chai_1.expect(props.comments).to.exist;
            chai_1.expect(props.comments.type).to.equal('array');
            chai_1.expect(props.comments.items).to.exist;
            chai_1.expect(Array.isArray(props.comments.items)).to.equal(false);
            chai_1.expect(props.comments.items.properties).to.exist;
            chai_1.expect(props.comments.items.properties.body).to.exist;
            chai_1.expect(props.comments.items.properties.date).to.exist;
            chai_1.expect(props.comments.items.properties.body).to.deep.equal({ type: 'string' });
            chai_1.expect(result.required).to.deep.equal(['hidden']);
        });
    });
    describe('configurable meta fields', () => {
        it('should be able to add a an arbitrary field to a property on the root object', () => {
            const description = 'something cool';
            const bar = 'baz';
            const result = documentModel({
                schema: new mongoose_1.Schema({
                    foo: {
                        type: String,
                        description,
                        bar,
                    },
                }),
            }, {
                props: ['bar'],
            });
            const field = result.properties.foo;
            chai_1.expect(field).to.exist;
            chai_1.expect(field.description).to.equal(description);
            chai_1.expect(field.bar).to.equal(bar);
        });
        it('should be able to add a an arbitrary field to a property on a nested object', () => {
            const description = 'something cool';
            const bar = 'baz';
            const result = documentModel({
                schema: new mongoose_1.Schema({
                    foo: {
                        buzz: {
                            type: [{
                                    barry: {
                                        type: String,
                                        description,
                                    },
                                }],
                            description,
                            bar,
                        },
                    },
                }),
            }, {
                props: ['bar'],
            });
            const field = result.properties.foo.properties.buzz;
            chai_1.expect(field).to.exist;
            chai_1.expect(field.description).to.equal(description);
            chai_1.expect(field.bar).to.equal(bar);
            chai_1.expect(field.items.properties.barry.description).to.equal(description);
        });
    });
    describe('required array', () => {
        it('root props without required fields shold omit required array (for space?)', () => {
            const result = documentModel({
                schema: new mongoose_1.Schema({
                    foo: {
                        type: String,
                        enum: ['bar', 'baz'],
                    },
                }),
            });
            chai_1.expect(result.required).to.not.exist;
        });
        it('root with required fields should have the required array', () => {
            const result = documentModel({
                schema: new mongoose_1.Schema({
                    foo: {
                        type: String,
                        enum: ['bar', 'baz'],
                        required: true,
                    },
                }),
            });
            chai_1.expect(result.required).to.not.be.empty;
            chai_1.expect(result.required).to.include('foo');
        });
        it('nested', () => {
            const Paw = new mongoose_1.Schema({
                numToes: {
                    type: Number,
                    required: true,
                },
            });
            const schema = new mongoose_1.Schema({
                name: {
                    type: String,
                    required: true,
                },
                color: {
                    type: String,
                    required: true,
                },
                hasTail: {
                    type: Boolean,
                },
                paws: {
                    type: [Paw],
                    required: true,
                },
            });
            const result = documentModel({ schema });
            chai_1.expect(result.required).to.not.be.empty;
            chai_1.expect(result.required).to.not.contain(null);
            chai_1.expect(result.properties.paws.items.required).to.not.be.empty;
            chai_1.expect(result.properties.paws.items.required).to.not.contain(null);
            const [f] = result.properties.paws.items.required;
            chai_1.expect(f).to.exist;
        });
        it('nested - alt format', () => {
            const Paw = new mongoose_1.Schema({
                numToes: {
                    type: Number,
                    required: true,
                },
            });
            const schema = new mongoose_1.Schema({
                name: {
                    type: String,
                    required: true,
                },
                color: {
                    type: String,
                    required: true,
                },
                hasTail: {
                    type: Boolean,
                },
                paws: [Paw],
            });
            const result = documentModel({ schema });
            chai_1.expect(result.required).to.not.be.empty;
            chai_1.expect(result.required).to.not.contain(null);
            chai_1.expect(result.properties.paws.items.required).to.not.be.empty;
            chai_1.expect(result.properties.paws.items.required).to.not.contain(null);
            const [f] = result.properties.paws.items.required;
            chai_1.expect(f).to.exist;
        });
        it('other various types', () => {
            const schema = new mongoose_1.default.Schema({
                a: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'AdminUser' },
                b: { type: Number, default: 0 },
                c: String,
                d: { type: mongoose_1.default.Schema.Types.ObjectId },
                e: String,
                f: Object,
                g: { type: mongoose_1.default.Schema.Types.Mixed },
                h: Boolean,
                i: [Object],
                j: {
                    type: Object,
                },
                k: {
                    type: [Object],
                },
            });
            const result = documentModel({ modelName: 'Cat', schema });
        });
    });
    it('should be able to remove custom fields', () => {
        const result = documentModel({
            schema: new mongoose_1.Schema({
                name: String,
                surname: String,
                nickname: String,
            }),
        }, {
            omitFields: ['_id', 'surname'],
        });
        const root = result.properties;
        chai_1.expect(root).to.exist;
        chai_1.expect(root._id).to.not.exist;
        chai_1.expect(root.surname).to.not.exist;
        chai_1.expect(root.__v).to.not.exist;
        chai_1.expect(root.name).to.exist;
        chai_1.expect(root.nickname).to.exist;
    });
    it('should be able to remove __v field and leave other fields by default', () => {
        const result = documentModel({
            schema: new mongoose_1.Schema({
                name: String,
                surname: String,
                nickname: String,
            }),
        });
        const root = result.properties;
        chai_1.expect(root).to.exist;
        chai_1.expect(root._id).to.exist;
        chai_1.expect(root.name).to.exist;
        chai_1.expect(root.nickname).to.exist;
        chai_1.expect(root.surname).to.exist;
        chai_1.expect(root.__v).to.not.exist;
    });
});
//# sourceMappingURL=index.test.js.map